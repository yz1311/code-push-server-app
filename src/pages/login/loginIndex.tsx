import React, {PureComponent} from "react";
import {TouchableOpacity, View, Text, DeviceEventEmitter, EmitterSubscription} from "react-native";
import {Styles} from "../../common/styles";
import {NavigationBar} from "@yz1311/teaset";
import {Input,Button} from '@yz1311/teaset';
import {Api} from "../../api";
import ToastUtils from "../../utils/toastUtils";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from "react-redux";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {userInfoModel, userLoginRequest} from "../../api/login";
import Svg, {Defs, Ellipse, LinearGradient, Rect, Stop} from 'react-native-svg';
import SplashScreen from "react-native-splash-screen";

export interface IProps extends IReduxProps{

}

export interface IState {
    userName: string,
    password: string,
    serverPath: string
}

@(connect() as any)
export default class LoginIndex extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            header: null
        };
    }

    readonly state:IState = {
        userName: '',
        password: '',
        serverPath: ''
    };

    private fillUserIdListener:EmitterSubscription;

    async componentDidMount() {
        // ToastUtils.showLoading();
        let serverPath = await gStorage.load(gStorageKeys.ServerPath);
        if(serverPath) {
            this.setState({
                serverPath: serverPath || '',
            });
            gServerPath = serverPath;
        }
        let token = await gStorage.load('token');
        if(token) {
            this.props.dispatch({
                type: 'loginIndex/setUserLogin',
                payload: {
                    token: token
                }
            });
            setTimeout(()=>{
                this.props.dispatch({
                    type: 'loginIndex/getUserInfo',
                    payload: {

                    }
                });
            },200);
            NavigationHelper.replace('HomeIndex');
            setTimeout(()=>{
                SplashScreen.hide();
            },500);
        } else {
            SplashScreen.hide();
        }
        let userInfo:userInfoModel = await gStorage.load(gStorageKeys.CurrentUser);
        if(userInfo) {
            this.setState({
                userName: userInfo.name || userInfo.email || '',
            });
        }
        this.fillUserIdListener = DeviceEventEmitter.addListener('fill_userId',(userId)=>{
           this.setState({
               userName: userId
           });
        });
    }

    componentWillUnmount(): void {
        this.setState = (state, callback)=>{
            return;
        };
        this.fillUserIdListener&&this.fillUserIdListener.remove();
    }

    userLogin = async ()=>{
        if(this.state.userName=='') {
            ToastUtils.showToast('用户名不能为空');
            return;
        }
        if(this.state.password=='') {
            ToastUtils.showToast('密码不能为空');
            return;
        }
        if(this.state.serverPath==''||!/(http:|https:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(this.state.serverPath)) {
            ToastUtils.showToast('服务器地址格式不正确');
            return;
        }
        let serverPath = this.state.serverPath;
        //如果url不是以/结尾，则帮助添加
        if(this.state.serverPath[this.state.serverPath.length-1]!='/') {
            serverPath += '/';
        }
        gServerPath = serverPath;
        this.props.dispatch({
            type: 'loginIndex/userLogin',
            payload: {
                request: {
                    account: this.state.userName,
                    password: this.state.password,
                    serverPath: serverPath,
                }
            } as userLoginRequest
        });
    }

    render () {
        return (
            <View style={[Styles.container,{backgroundColor: gColors.bgColorF}]}>
                <NavigationBar style={{position:'relative'}} title={'登录'} leftView={null}/>
                <KeyboardAwareScrollView style={[Styles.flexColumn,{marginTop:gScreen.width*0.3,paddingHorizontal:gScreen.width*0.1}]}>
                    <View style={{flexDirection:'row',alignItems:"center"}}>
                        <FontAwesome5 name={'user'} size={22} color={'#89D4FC'}/>
                        <Input
                            style={{borderWidth:0,flex:1,fontSize:gScreen.px2dp(28)}}
                            autoCapitalize={'none'}
                            placeholder={'用户名'}
                            value={this.state.userName}
                            onChangeText={value=>this.setState({userName: value})}
                        />
                    </View>
                    <View style={{height:gScreen.onePix,backgroundColor:gColors.color999,marginTop:10}}/>
                    <View style={{flexDirection:'row',alignItems:"center",marginTop:20,}}>
                        <FontAwesome5 name={'lock'} size={22} color={'#89D4FC'}/>
                        <Input
                            style={{borderWidth:0,flex:1,fontSize:gScreen.px2dp(28)}}
                            placeholder={'密码'}
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={value=>this.setState({password: value})}
                        />
                    </View>
                    <View style={{height:gScreen.onePix,backgroundColor:gColors.color999,marginTop:10}}/>
                    <View style={{flexDirection:'row',alignItems:"center",marginTop:20,}}>
                        <FontAwesome5 name={'server'} size={22} color={'#89D4FC'}/>
                        <Input
                            style={{borderWidth:0,flex:1,fontSize:gScreen.px2dp(28)}}
                            placeholder={'服务器地址'}
                            value={this.state.serverPath}
                            onChangeText={value=>this.setState({serverPath: value})}
                        />
                    </View>
                    <View style={{height:gScreen.onePix,backgroundColor:gColors.color999,marginTop:10}}/>
                    <TouchableOpacity
                        onPress={this.userLogin}
                        style={{width:gScreen.width*0.8,height:40,justifyContent:'center',alignItems:'center',marginTop:50}}
                        >
                        <Svg style={{position:'absolute'}} width={gScreen.width*0.8} height={40}>
                            <Defs>
                                <LinearGradient id="Gradient" x1={0} y1="100%" x2="100%" y2={0}>
                                    <Stop offset="0" stopColor={'#60B4FC'}/>
                                    <Stop offset="1" stopColor={'#0068F9'}/>
                                </LinearGradient>
                            </Defs>
                            <Rect x="0" y="0" rx={20} ry={20} width={gScreen.width*0.8} height={40} fill="url(#Gradient)"/>
                        </Svg>
                        <Text style={{fontSize:gFont.size15,color:gColors.bgColorF}}>登录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            NavigationHelper.navigate('Register');
                        }}
                        style={{width:gScreen.width*0.8-2,height:40-2,justifyContent:'center',
                            backgroundColor:'white',
                            borderColor:'#21B7F9',
                            borderWidth: 1,
                            alignItems:'center',borderRadius:20,marginTop:20}}
                        >
                        <Text style={{fontSize:gFont.size15,color:'#21B7F9'}}>注册</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
