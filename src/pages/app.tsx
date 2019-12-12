import React, {Component} from 'react';

import {
    View,
    StatusBar,
    BackHandler,
    AppState,
    NativeAppEventEmitter,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import ToastUtils from "../utils/toastUtils";
import YZLoading from '../components/YZLoading';
import {CodePushHandler} from '@yz1311/teaset-code-push';
import {NavigationHelper, Theme} from '@yz1311/teaset';
import {ReduxState} from "../models";

let lastClickTime = 0;

interface IProps extends IReduxProps {
    barStyle?: any;
    isFetching?: boolean;
    loadingTitle?: string;
    isConnected?: boolean;
    nav?: any;
    AppNavigator: any;
}

interface IState {}

@(connect(
    (state: ReduxState) => ({
        barStyle: state.app.barStyle,
        isFetching: state.app.isFetching,
        loadingTitle: state.app.loadingTitle,
        isConnected: state.app.isConnected,
    }),
    dispatch => ({
        dispatch,
    }),
) as any)
@CodePushHandler({isDebugMode: false})
export default class App extends Component<IProps, IState> {
    private reloadThemeListener: any;

    componentDidMount() {
        __ANDROID__ &&
        BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);
        this.reloadThemeListener = DeviceEventEmitter.addListener(
            'reloadTheme',
            () => {
                this.forceUpdate();
            },
        );
    }

    componentWillUnmount() {
        __ANDROID__ &&
        BackHandler.removeEventListener('hardwareBackPress', this._onBackAndroid);
        this.reloadThemeListener && this.reloadThemeListener.remove();
    }

    _onBackAndroid = () => {
        //初始页时,navRouters为空,需要判断
        if (NavigationHelper.navRouters&&NavigationHelper.navRouters.length > 1) {
            // 默认行为： 退出当前界面。
            NavigationHelper.goBack();
            return true;
        }

        let now = new Date().getTime();
        if (now - lastClickTime < 2500) return false;

        lastClickTime = now;
        ToastUtils.showToast('再按一次退出' + appName);
        return true;
    };

    render() {
        const AppNavigator = this.props.AppNavigator;
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    barStyle={this.props.barStyle}
                    animated={true}
                    translucent={true}
                    backgroundColor="transparent"
                />
                {/*<View style={{height:gScreen.statusBarHeight,backgroundColor:gColors.themeColor}}/>*/}
                <AppNavigator
                    onNavigationStateChange={(prevState, currentState, action) => {
                        //这个是跳转了才去回调，所以不能利用routes来判断路由栈
                        NavigationHelper.navRouters = currentState.routes;
                    }}
                />
                {Theme.isIPhoneX ? <View style={{height: 34,backgroundColor:'white'}} /> : null}

                <YZLoading
                    isShow={this.props.isFetching}
                    title={this.props.loadingTitle}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    promptTitle: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 15,
    },
});
