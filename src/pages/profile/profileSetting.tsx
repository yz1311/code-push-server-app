import React, {PureComponent} from "react";
import {View} from "react-native";
import {Styles} from "../../common/styles";
import {Alert, Button, NavigationBar, NavigationIconButton, Input, ListRow} from "@yz1311/teaset";
import {connect} from "react-redux";
import {getCacheSize, clearCache} from '@yz1311/react-native-http-cache';
import ToastUtils from "../../utils/toastUtils";


export interface IProps extends IReduxProps {

}

export interface IState {
    cacheSize: number
}


class ProfileSetting extends PureComponent<IProps,IState>{

    readonly state:IState = {
        cacheSize: 0.0
    };

    componentDidMount(): void {
        this.getCacheSize();
    }

    getCacheSize = async ()=>{
        try {
            let cacheSize = await getCacheSize();
            this.setState({
                cacheSize
            });
        } catch (e) {

        }
    }

    logout = ()=>{
        Alert.alert('','是否退出登录?',[{
            text: '取消'
        }, {
            text: '退出',
            style: 'destructive',
            onPress: ()=>{
                this.props.dispatch({
                    type: 'loginIndex/logout'
                });
            }
        }]);
    }

    render () {
        const {cacheSize} = this.state;
        return (
            <View style={[Styles.container]}>
                <View style={{flex:1,paddingTop:10}}>
                    <ListRow
                        style={{marginTop:10}}
                        title={'清除缓存'}
                        detail={bytesToDesc(cacheSize)}
                        onPress={async ()=>{
                            await clearCache();
                            ToastUtils.showToast('清除成功!');
                            setTimeout(()=>{
                                this.getCacheSize();
                            },500);
                        }}
                    />
                    <ListRow
                        title={'修改密码'}
                        onPress={()=>{
                            NavigationHelper.navigate('ChangePassword');
                        }}
                    />
                    <ListRow title={'关于'}  onPress={()=>{
                        NavigationHelper.push('ProfileAbout');
                    }}/>
                </View>
                <Button style={{backgroundColor:gColors.colorRed,borderColor:gColors.colorRed,
                            height:40,
                            marginHorizontal:gScreen.width*0.1,marginVertical:20}}
                        onPress={this.logout}
                        type={'primary'} title={'退出登录'}></Button>
            </View>
        );
    }
}

const bytesToDesc = (bytesCount)=>{
    if(bytesCount>0) {
        return (bytesCount/1024/1024/8).toFixed(1)+'M';
    }
    return (bytesCount||0).toFixed(1)+'M';
}

export default connect()(ProfileSetting)
