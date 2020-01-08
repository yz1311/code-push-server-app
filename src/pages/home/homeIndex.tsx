import React, {Component, FC} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    AppState,
    StatusBar,
    Platform,
} from 'react-native';
import ScrollableTabView from '@yz1311/react-native-scrollable-tab-view';
import {Theme} from '@yz1311/teaset';
import YZTabBar from '../../components/YZTabBar';
import {connect} from "react-redux";
import {ReduxState} from "../../models";
import YZFileViewerHandler from '../../components/YZFileViewerHandler';
import AppIndex from "../app/appIndex";
import ProfileIndex from "../profile/profileIndex";

interface IProps extends IReduxProps{

}

interface IState {
    tabNames: Array<string>;
    tabIconNames: Array<any>;
    selectedTabIconNames: Array<any>;
}

const {width:DEVICE_WIDTH,height:DEVICE_HEIGHT} = Dimensions.get('window');

@(connect((state:ReduxState)=>({

})) as any)
//@ts-ignore
@YZFileViewerHandler
export default class HomeIndex extends Component<IProps, IState> {
    readonly state: IState = {
        tabNames: ['主页', '我的'],
        tabIconNames: [
            require('../../resources/tab/dock-home-off.png'),
            require('../../resources/tab/dock-my-off.png'),
        ],
        selectedTabIconNames: [
            require('../../resources/tab/dock-home-on.png'),
            require('../../resources/tab/dock-my-on.png'),
        ],
    };

    private tabBar: any;
    private scrollableTabView:ScrollableTabView;

    static navigationOptions = () => {
        return {
            headerShown: false
        };
    };

    componentDidMount(): void {
        AppState.addEventListener('change',this._handleAppStateChange);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = async (appState) => {
        if (appState === 'active') {
            //https://github.com/facebook/react-native/issues/23058
            //在android下会有上面的bug，状态栏在返回退出或者长时间在后台，进去时会重新显示出来
            if(Platform.OS==='android' && gScreen.isTranslucent) {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor('transparent');
            }
        }
    };

    _onChangeTab = obj => {
        switch (obj.i)
        {
            case 2:

                break;
            default:
                break;
        }
    }

    render() {
        const {tabNames, tabIconNames, selectedTabIconNames} = this.state;
        return (
            <View style={{flex:1}}>
                <ScrollableTabView
                    style={{flex:1}}
                    ref={(ref) => { this.scrollableTabView = ref; }}
                    renderTabBar={() =>
                        <YZTabBar
                            ref={bar=>this.tabBar = bar}
                            tabNames={tabNames}
                            tabIconNames={tabIconNames}
                            selectedTabIconNames={selectedTabIconNames}
                        />
                    }
                    tabBarPosition='bottom'
                    initialPage={0}
                    scrollWithoutAnimation={true}
                    locked={true}
                    onChangeTab={this._onChangeTab}
                >
                    <AppIndex />
                    <ProfileIndex />
                </ScrollableTabView>
            </View>
        );
    }
}



const styles = StyleSheet.create({


});
