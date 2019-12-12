import React, {Component, FC} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    TouchableOpacity,
    ImageSourcePropType,
    ScrollView,
    PixelRatio, TextInput, StatusBar,
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
            header: null,
        };
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
