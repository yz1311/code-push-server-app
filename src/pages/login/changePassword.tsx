import React, {PureComponent} from "react";
import {DeviceEventEmitter, Text, TouchableOpacity, View} from "react-native";
import {Styles} from "../../common/styles";
import {Button, Input, Theme} from "@yz1311/teaset";
import ToastUtils from "../../utils/toastUtils";
import {Api} from "../../api";
import set = Reflect.set;
import {connect} from "react-redux";
import {ReduxState} from "../../models";
import {userInfoModel} from "../../api/login";

export interface IProps extends IReduxProps {
    userInfo?: userInfoModel
}

export interface IState {
    password: string,
    newPassword: string,
    reNewPassword: string
}

@(connect((state:ReduxState)=>({
    userInfo: state.loginIndex.userInfo
})) as any)
export default class ChangePassword extends PureComponent<IProps,IState>{
    readonly state:IState = {
        password: '',
        newPassword: '',
        reNewPassword: ''
    };

    submit = async ()=>{
        if(this.state.password=='' || this.state.newPassword=='' || this.state.reNewPassword =='') {
            ToastUtils.showToast('密码不能为空');
            return ;
        }
        if(this.state.newPassword != this.state.reNewPassword) {
            ToastUtils.showToast('两次输入的密码不一致');
            return ;
        }
        if(this.state.newPassword.length<6) {
            ToastUtils.showToast('密码不能少于6位');
            return ;
        }
        ToastUtils.showLoading();
        console.log(this.props.userInfo.email)
        try {
            let response = await Api.login.changePassword({
                request: {
                    oldPassword: this.state.password,
                    newPassword: this.state.reNewPassword
                }
            });
            ToastUtils.showToast('修改成功!');
            this.props.dispatch({
                type: 'loginIndex/logout'
            });
            NavigationHelper.resetTo('LoginIndex');
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        return (
            <View style={[Styles.container]}>
                <View style={{marginTop:60,paddingHorizontal:gScreen.width*0.1}}>
                    <Input
                        style={{marginTop:15}}
                        autoCapitalize={'none'}
                        value={this.state.password}
                        onChangeText={value=>this.setState({password: value})}
                        placeholder={'原密码'}
                    />
                    <Input
                        style={{marginTop:15}}
                        autoCapitalize={'none'}
                        value={this.state.newPassword}
                        secureTextEntry={true}
                        onChangeText={value=>this.setState({newPassword: value})}
                        placeholder={'新密码'}
                    />
                    <Input
                        style={{marginTop:15}}
                        autoCapitalize={'none'}
                        value={this.state.reNewPassword}
                        secureTextEntry={true}
                        onChangeText={value=>this.setState({reNewPassword: value})}
                        placeholder={'重输新密码'}
                    />
                    <Button style={{marginTop:30}} type={'primary'} title={'修改'} onPress={this.submit}/>
                </View>
            </View>
        );
    }
}
