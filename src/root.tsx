console.log('1222')
import * as YZConstants from './common/constants';
import * as YZStorage from './utils/globalStorage';
/* eslint-enable */
import codePush from 'react-native-code-push';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter, ActivityIndicator
} from 'react-native';
import {Provider} from 'react-redux';
import {create} from 'dva-core';
import useImmer from 'dva-immer';
import {ListRow, Theme, NavigationHelper, NavigationBar} from "@yz1311/teaset";
import {createAppContainer} from "react-navigation";
import models from './models';
import axios from 'axios';
import RequestUtils, {AxiosRequestConfigPatch} from "./utils/requestUtils";
import YZStateView from "./components/YZStateCommonView";
const a = YZConstants;
const b = YZStorage;
NavigationHelper.init(NavigationHelper);
Theme.set({
    primaryColor: '#1f76fa',
    navColor: '#1f76fa',
    btnBorderColor: '#1f76fa',
});
//必须要延后加载，否则Theme设置无效
const App = require('./pages/app').default;

const dvaApp = create();
dvaApp.use(useImmer());
models.forEach(x => {
    dvaApp.model(x);
});
dvaApp.start();

const store = dvaApp._store;

RequestUtils.init();

class Root extends Component<any,any> {
    constructor(props) {
        super(props);
        //全局设置 禁止APP受系统字体放大缩小影响
        // @ts-ignore
        Text.defaultProps={...(Text.defaultProps||{}),allowFontScaling:false};
        // @ts-ignore
        TouchableOpacity.defaultProps = {...(Text.defaultProps||{}),activeOpacity:0.75};
        // @ts-ignore
        TextInput.defaultProps={...(TextInput.defaultProps||{}),allowFontScaling:false};
        // @ts-ignore
        TextInput.defaultProps.underlineColorAndroid = "transparent";
        // @ts-ignore
        TextInput.defaultProps.autoCapitalize = "none";
        // @ts-ignore
        NavigationBar.defaultProps = {
            // @ts-ignore
            ...(NavigationBar.defaultProps||{}),
            leftView: (
                <TouchableOpacity
                    activeOpacity={activeOpacity}
                    style={{
                        paddingLeft: 9,
                        paddingRight: 8,
                        alignSelf: 'stretch',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        NavigationHelper.goBack();
                    }}>
                    <Image
                        style={{
                            width: 22,
                            height: 22,
                            resizeMode: 'contain',
                        }}
                        source={require('./resources/img/goBack.png')}
                    />
                </TouchableOpacity>
            )
        }
        // TextInput.defaultProps.textAlignVertical = false;
        // YZStateView.defaultProps.loadingView = (
        //     <View style={{alignItems:'center'}}>
        //         <Image
        //             style={{width: 30, height: 30}}
        //             source={require('./resources/img/loading_page.gif')}
        //         />
        //         <Text style={styles.title}>{'正在加载中…'}</Text>
        //     </View>);
        // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    _handleConnectivityChange = isConnected => {
        // const {dispatch} = store;
        // dispatch(changeAppNetInfo(isConnected))
        this.setState({isConnected});
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Provider store={store}>
                    <App  AppNavigator={createAppContainer(require('./pages/appNav').default)}/>
                </Provider>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        color: gColors.color333,
        fontSize: 14,
        marginTop: 10
    }
});

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL};

export default codePush(codePushOptions)(Root);
