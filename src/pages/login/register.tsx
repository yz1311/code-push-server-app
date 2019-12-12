import React, {PureComponent} from "react";
import {TouchableOpacity, View, Text, DeviceEventEmitter} from "react-native";
import {Styles} from "../../common/styles";
import {Button, Input, Theme} from "@yz1311/teaset";
import ToastUtils from "../../utils/toastUtils";
import {spawn} from "redux-saga/effects";
import {Api} from "../../api";

export interface IProps {

}

export interface IState {
    email: string,
    password: string,
    code: string
}

const EMAIL_REGEX = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

export default class Register extends PureComponent<IProps,IState>{

    readonly state:IState = {
        email: '',
        password: '',
        code: ''
    };

    sendCode = async ()=>{
        const {email} = this.state;
        if(!EMAIL_REGEX.test(email)) {
            ToastUtils.showToast('请输入正确的邮箱');
            return;
        }
        ToastUtils.showLoading();
        try {
            let response = await Api.login.sendRegisterCode({
                request: {
                    email: email
                }
            });
            ToastUtils.showToast('验证码发送成功，请注意查收!');
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    submit = async ()=>{
        const {email} = this.state;
        if(!EMAIL_REGEX.test(email)) {
            ToastUtils.showToast('请输入正确的邮箱');
            return;
        }
        if(this.state.password=='' || this.state.password.trim()=='') {
            ToastUtils.showToast('密码不能为空');
            return;
        }
        if(this.state.code=='' || this.state.code.trim()=='') {
            ToastUtils.showToast('验证码不能为空');
            return;
        }
        if(this.state.password.length<6) {
            ToastUtils.showLoading('密码不能少于6位');
            return ;
        }
        try {
            let response = await Api.login.register({
                    request: {
                        email: this.state.email,
                        password: this.state.password,
                        token: this.state.code,
                    }
                });
            ToastUtils.showToast('注册成功!');
            DeviceEventEmitter.emit('fill_userId',this.state.email);
            NavigationHelper.goBack();
        } catch (e) {

        } finally {

        }
    }

    render () {
        return (
            <View style={[Styles.container]}>
                <View style={{marginTop:60,paddingHorizontal:gScreen.width*0.1}}>
                    <Input
                        autoCapitalize={'none'}
                        value={this.state.email}
                        onChangeText={value=>this.setState({email: value})}
                        placeholder={'输入邮箱'}
                    />
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:15}}>
                        <Input
                            style={{flex:1}}
                            value={this.state.code}
                            onChangeText={value=>this.setState({code: value})}
                            placeholder={'输入验证码'}
                        />
                        <TouchableOpacity style={{alignSelf:'stretch',justifyContent:"center",paddingLeft:20}} onPress={this.sendCode}>
                            <Text style={{color:Theme.btnPrimaryBorderColor,fontSize:gFont.size14}}>获取验证码</Text>
                        </TouchableOpacity>
                    </View>
                    <Input
                        style={{marginTop:15}}
                        value={this.state.password}
                        onChangeText={value=>this.setState({password: value})}
                        placeholder={'输入密码'}
                    />
                    <Button style={{marginTop:30}} type={'primary'} title={'注册'} onPress={this.submit}/>
                </View>
            </View>
        );
    }
}
