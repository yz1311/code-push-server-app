/**
 * 目前由于没有办法传参复写navigationOptions
 * 所以只适合于没有header的页面
 */

import React, { Component } from 'react';
import {
    TouchableWithoutFeedback,
    View,
    BackHandler,
    DeviceEventEmitter,
    EmitterSubscription,
    Alert,
    Platform,
    CameraRoll,
    Modal,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import Permissions from 'react-native-permissions';
import RNFetchBlob, { RNFetchBlobStat } from 'rn-fetch-blob';
import PermissionUtils from '../utils/permissionUtils';
import ImageViewer from 'react-native-image-zoom-viewer';
import hoistNonReactStatic from 'hoist-non-react-statics';



interface IProps {

}

interface IState {
    imgList: Array<any>,
    imgListVisible: boolean,
    imgListIndex: number,
    canSign: boolean,
    //图片背景色是白色，用于显示签名文件
    whiteBackgroundIndex: number
}

//反向继承
const decorator = (WrappedComponent) => {
    class HOC extends Component<IProps, IState> {

        private showImgListListener: EmitterSubscription;
        private downloadListener: EmitterSubscription;

        readonly state: IState = {
            imgList: [],
            imgListVisible: false,
            imgListIndex: 0,
            //pdf能否签章
            canSign: false,
            whiteBackgroundIndex: -1
        };

        componentDidMount() {
            this.showImgListListener = DeviceEventEmitter.addListener('showImgList', ({ imgList, imgListIndex, whiteBackgroundIndex }) => {
                this.setState({
                    imgList: imgList.map(x => ({ url: x })),
                    imgListVisible: true,
                    imgListIndex: imgListIndex,
                    whiteBackgroundIndex: whiteBackgroundIndex
                });
            });
            this.downloadListener = DeviceEventEmitter.addListener('downloadFile', (item) => {
                this.setState({
                    canSign: item.canSign
                });
                this.savePhoto(item);
            });
        }

        componentWillUnmount() {
            this.showImgListListener.remove();
            this.downloadListener.remove();
        }

        async savePhoto(item) {
            if (__ANDROID__) {
                let response;
                try {
                    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                    //@ts-ignore
                    response = await Permissions.request('storage');
                } catch (e) {
                    console.log('错误', e);
                }
                if (!PermissionUtils.checkPermissionResult(response, '存储权限')) {
                    return;
                }
            }
            //视频可以不用下载，直接播放
            if (['.mp4', '.avi', '.wmv', '.flv', '.mkv', '.mov', '.3gp', '.mpeg'].indexOf(gUtils.string.getSuffix(item.url)) >= 0) {
                // this.setState({
                //   videoPlayerVisible: true,
                //   //url是相对地址，则显示本地文件
                //   videoUrl: item.url.indexOf('http') === 0 ? item.url : item.uri
                // });
                NavigationHelper.push('YZVideoPlayerPage', {
                    videoUrl: item.url.indexOf('http') === 0 ? item.url : item.uri
                });
                return;
            }
            this.downloadFile(item.url, item.forceDownload);
        }

        getFileName = (url) => {
            console.log('pdf照片', url);
            var pos = url.lastIndexOf('/') * 1;
            return url.substring(pos + 1);
        };

        getFilExt = (url) => {
            let aaa = /\.[\s\S]+$/.exec(url);
            if (aaa.length === 0) {
                return '';
            } else {
                return aaa[0];
            }
        };

        downloadFile = async (uri, forceDownload) => {
            //      let url = item.word || item.excel;
            //    let fileExt = this.getFilExt(url);
            let dirs = RNFetchBlob.fs.dirs;
            // url = FILR_BASE_URL + url;
            let savePath = __IOS__ ? dirs.DocumentDir : dirs.SDCardDir + '/ych/files';
            //删除本地文件
            if(forceDownload) {
                try {
                    await RNFetchBlob.fs.unlink(savePath + '/' + this.getFileName(uri));
                } catch (e) {

                }
            }
            let localFile: RNFetchBlobStat;
            try {
                localFile = await RNFetchBlob.fs.stat(savePath + '/' + this.getFileName(uri));
                this.viewOrSaveToCameraRoll(uri, savePath + '/' + this.getFileName(uri));
                return;
            } catch (e) {

            }
            RNFetchBlob
                .config({
                    fileCache: true,
                    path: savePath + '/' + this.getFileName(uri)
                    // path: SavePath + '/' + this.getFileName(url)
                    // appendExt : fileExt.replace('.','').toLowerCase()
                })
                .fetch('GET', uri, {})
                .then((res) => {
                    this.viewOrSaveToCameraRoll(uri, res.path());
                })
                .catch((err) => {
                    console.log(err);
                    // error handling ..
                    Alert.alert('', '下载失败!');
                });
        };

        viewOrSaveToCameraRoll = (uri, filePath) => {
            if (uri.slice(-4) == '.pdf') {
                NavigationHelper.navigate('OrderManagerPdfViewer', {
                    uri: uri,
                    filePath: filePath,
                    canSign: this.state.canSign
                });
                return;
            } else if(uri.slice(-4) == '.png'||uri.slice(-4) == '.jpg') {
                var promise = CameraRoll.saveToCameraRoll((__ANDROID__ ? 'file://' : '') + filePath);
                promise.then(function(result) {
                    console.log('图片已保存至相册');
                    Alert.alert('', '图片已保存至相册', [{
                        text: '知道了'
                    }], { cancelable: false });
                }).catch(function(error) {
                    console.log('保存失败');
                    this.props.showToastFn('保存失败');
                });
            }
        };

        render() {
            let page = <WrappedComponent {...this.props}/>;
            return (
                <View style={{ flex: 1 }}>
                    {page}
                    <Modal visible={this.state.imgListVisible}
                           animationType={'slide'}
                           onRequestClose={() => {
                               this.setState({
                                   imgListVisible: false
                               });
                           }}
                           transparent={true}>
                        <ImageViewer
                            backgroundColor={this.state.imgListIndex === this.state.whiteBackgroundIndex ? 'white' : 'black'}
                            onClick={() => this.setState({ imgListVisible: false })}
                            enableImageZoom={true} // 是否开启手势缩放
                            saveToLocalByLongPress={true} //是否开启长按保存
                            onSwipeDown={() => this.setState({ imgListVisible: false })}
                            index={this.state.imgListIndex}
                            loadingRender={() =>
                                <ActivityIndicator
                                    color={'white'}
                                    size={'large'}
                                />
                            }
                            enableSwipeDown={false}
                            menuContext={{ saveToLocal: '保存到相册', cancel: '取消' }}
                            onCancel={() => this.setState({ imgListVisible: false })}
                            onSave={(url) => {
                                this.savePhoto(this.state.imgList[this.state.imgListIndex]);
                            }}
                            imageUrls={this.state.imgList}/>
                    </Modal>
                </View>
            );
            // return super.render();
        }
    }

    hoistNonReactStatic(HOC, WrappedComponent);
    return HOC;
};

export default decorator;
