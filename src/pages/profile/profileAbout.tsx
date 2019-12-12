

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Clipboard,
    DeviceEventEmitter, Linking
} from 'react-native';
import {Styles} from "../../common/styles";
import {ListRow, Overlay, OverlayPopView} from "@yz1311/teaset";
import {connect} from "react-redux";
import {ReduxState} from '../../models';
import ToastUtils from "../../utils/toastUtils";
import {displayName} from '../../../app.json';
import codePush from 'react-native-code-push';

interface IProps {
    dispatch: any,
}

interface IState {
    isLoading: boolean
}

export default class ProfileAbout extends Component<IProps,IState> {

    private overlayView:OverlayPopView;

    showUpdateInfoDialog=async ()=>{
        //不要讲modal也放在这个组件，两个modal同时存在会报错，不知道咋回事
        DeviceEventEmitter.emit('showUpdateInfoDialog');
    }

    checkForUpdate = async ()=>{
        //防止更新日志被修改，所以实时获取最新的
        //不知道是不是缓存的原因，还是获取到的是老的数据
        codePush.getUpdateMetadata(codePush.UpdateState.LATEST).then((update)=>{
            if(update)
            {
                let desc = update.description ;
                let uuid = '0';
                //兼容老版本
                try
                {
                    desc = JSON.parse(update.description).description;
                }
                catch(e)
                {
                    console.log(e.message);
                }
                try{
                    uuid = JSON.parse(update.description).uuid;
                }
                catch(e)
                {

                }
                // let version;
                // version = gBaseConfig.BuildVersion+'_V'+uuid+(update.isPending?"(未生效)":"");
                // this.updateLogModal.show({
                //     version:version,
                //     isPending:update.isPending,
                //     description:desc
                // });
            }
            else
            {
                ToastUtils.showToast('当前已是最新版本!');
            }
        });
    }

    render () {
        let appIcon = require('../../resources/img/app_icon.png');
        return (
            <View
                style={[Styles.container]}>
                <ScrollView style={{flex:1}}>
                    <View style={{marginTop:10,alignItems:'center'}}>
                        <Image
                            style={{ width: 90, height: 90, alignSelf: 'center', marginTop: 40 }}
                            resizeMode="contain"
                            source={appIcon}/>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginTop: 10
                        }}>{appName}</Text>
                        <Text style={{fontSize:gFont.size16,marginTop:10}}>{'版本: V'+gBaseConfig.BuildVersion}</Text>
                        <View style={{alignSelf:'stretch',marginTop:30}}>
                            <ListRow
                                title="检查更新"
                                onPress={()=>{
                                    this.showUpdateInfoDialog();
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={[styles.center, { paddingHorizontal: 15, paddingBottom: 10 }]}>
                    <TouchableOpacity
                        style={{ marginTop: 25 ,display:'none'}}
                        onPress={() => {
                            // NavigationHelper.navigate('YZWebPage', {
                            //     uri: '',
                            //     title: '隐私声明'
                            // });
                        }}
                    >
                        <Text style={{
                            fontSize: gFont.size15,
                            color: gColors.color666,
                            textDecorationLine: 'underline'
                        }}>《{displayName}APP服务协议》</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: gFont.size13, color: gColors.color666, marginTop: 20 }}>©
                        版权所有</Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    paddingLeftRight: {
        paddingLeft: 15,
        paddingRight: 15
    },
    center: {
        justifyContent: 'center',
        alignItems: "center",
    },
    updateLogItem:{
        backgroundColor:gColors.bgColorF,
        alignSelf:'stretch',
        marginTop:18,
        borderTopColor:gColors.borderColorE5,
        borderTopWidth:gScreen.onePix,
        borderBottomColor:gColors.borderColorE5,
        borderBottomWidth:gScreen.onePix,
    }
});
