import React,{Component} from 'react';
import {
    Clipboard,
    Linking,
    Share,
    View,
    TouchableOpacity
} from 'react-native';
import {WebView, WebViewProps} from 'react-native-webview';
import PropTypes from 'prop-types';
import {ListRow, Overlay, BackHandler as YZBackHandler} from "@yz1311/teaset";
import {WebViewSource} from "react-native-webview/lib/WebViewTypes";

const injectedJsCode = `var headArr = document.getElementsByTagName('head');
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no';
            headArr[0].appendChild(meta);
            var bodyArr = document.getElementsByTagName('body');
             
             bodyArr[0].style.padding='0px 0px 0px 0px';
             true;
            `;

export interface IProps extends WebViewProps{

}

export default class YZWebPage extends Component<IProps,any>{
    static propTypes = {
        uri: PropTypes.string,
        title: PropTypes.string
    };

    static navigationOptions = ({navigation}) =>{
        const {state} = navigation;
        const {title, headerRight} = state.params || {headerRight: undefined, title: undefined};
        return {
            title: title,
            headerRight: headerRight
        };
    }

    private fromView: any;
    private overlayKey: any;
    private webView: any;



    _onBack=()=>{
        if(this.overlayKey)
        {
            Overlay.hide(this.overlayKey);
            this.overlayKey = null;
            return true;
        }
        NavigationHelper.goBack();
        return true;
    }


    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1,overflow:'hidden'}}>
                    <WebView
                        ref={ref=>this.webView = ref}
                        originWhitelist={['*']}
                        source={this.props.source}
                        automaticallyAdjustContentInsets
                        // scalesPageToFit
                        injectedJavaScript={injectedJsCode}
                        style={{flex:1}}
                        {...this.props}
                    />
                </View>
            </View>
        );
    }
}
