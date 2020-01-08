/**
 * 采购发布就是销售发布去掉仓单的版本
 */
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {withMappedNavigationProps} from 'react-navigation-props-mapper';
import {CardStyleInterpolators, createStackNavigator, Header} from 'react-navigation-stack';
import {NavigationBar, Theme, NavigationHelper} from '@yz1311/teaset';
import LoginIndex from './login/loginIndex';
import Register from './login/register';
import ChangePassword from './login/changePassword';
import HomeIndex from './home/homeIndex';
import DeploymentIndex from './deployment/deploymentIndex';
import CollaboratorList from './home/collaboratorList';
import DeploymentDetail from './deployment/deploymentDetail';
import ModifyName from './common/modifyName';
import AccessKeyIndex from './accessKey/accessKeyIndex';
import DeploymentTypeList from './deployment/deploymentTypeList';
import ProfileSetting from './profile/profileSetting';
import ProfileAbout from './profile/profileAbout';
import ScannerDemo from './demo/scannerDemo';
import DemoIndex from './demo/demoIndex';
import WheelPickerDemo from './demo/wheelPickerDemo';
import ClearCacheDemo from './demo/clearCacheDemo';

let _navigation;

const AppNavigation = createStackNavigator(
    {
        LoginIndex: {screen: withMappedNavigationProps(LoginIndex)},
        Register: {
            screen: withMappedNavigationProps(Register),
            navigationOptions: {headerTitle: '注册'},
        },
        ChangePassword: {
            screen: withMappedNavigationProps(ChangePassword),
            navigationOptions: {headerTitle: '修改密码'},
        },
        HomeIndex: {screen: withMappedNavigationProps(HomeIndex)},
        DeploymentIndex: {screen: withMappedNavigationProps(DeploymentIndex)},
        CollaboratorList: {screen: withMappedNavigationProps(CollaboratorList)},
        DeploymentDetail: {screen: withMappedNavigationProps(DeploymentDetail)},
        ModifyName: {screen: withMappedNavigationProps(ModifyName)},
        AccessKeyIndex: {screen: withMappedNavigationProps(AccessKeyIndex)},
        DeploymentTypeList: {screen: withMappedNavigationProps(DeploymentTypeList)},
        ScannerDemo: {screen: withMappedNavigationProps(ScannerDemo)},
        WheelPickerDemo: {screen: withMappedNavigationProps(WheelPickerDemo)},
        ProfileSetting: {
            screen: withMappedNavigationProps(ProfileSetting),
            navigationOptions: {headerTitle: '设置'},
        },
        ProfileAbout: {
            screen: withMappedNavigationProps(ProfileAbout),
            navigationOptions: {headerTitle: '关于'},
        },
        DemoIndex: {screen: withMappedNavigationProps(DemoIndex)},
        ClearCacheDemo: {screen: withMappedNavigationProps(ClearCacheDemo)},
    },
    {
        initialRouteName: 'LoginIndex',
        // headerMode: 'screen',
        defaultNavigationOptions: args => {
            let navigation = args.navigation;
            _navigation = navigation;
            NavigationHelper.navigation = navigation;
            let params = navigation.state.params;
            let leftTitle,headerStyle, headerLeft, headerRight;
            if (params) {
                leftTitle = params.leftTitle;
                headerStyle = params.headerStyle;
                headerLeft = params.headerLeft;
                headerRight = params.headerRight;
            }
            const leftView = (
                <TouchableOpacity
                    activeOpacity={activeOpacity}
                    style={{
                        paddingLeft: 9,
                        paddingRight: 8,
                        alignSelf: 'stretch',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{
                            width: 22,
                            height: 22,
                            resizeMode: 'contain',
                        }}
                        source={require('../resources/img/goBack.png')}
                    />
                </TouchableOpacity>
            );
            return {
                header: props => {
                    let options = props.scene.descriptor.options;
                    return (
                        <NavigationBar
                            style={[{position: 'relative', paddingLeft: 0},headerStyle]}
                            // type={'ios'}

                            title={
                                options.headerTitle
                                    ? options.headerTitle
                                    : navigation.state.params
                                        ? navigation.state.params.title
                                        : ''
                            }
                            leftView={headerLeft?headerLeft:leftView}
                            rightView={headerRight}
                        />
                    );
                },
                headerTintColor: Theme.navTitleColor,
                headerTitleStyle: {
                    fontSize: Theme.navTitleFontSize,
                    fontWeight: 'normal',
                } as any,
                headerStyle: {
                    backgroundColor: Theme.navColor,
                },
                headerBackTitle: null, // 左上角返回键文字
                headerTitleAlign: 'center',  //标题的对齐方向，android默认为left，ios默认为center，取代了前面上一层的headerLayoutPreset
                headerLeft: ()=>leftView,
                //ios默认开启，android默认关闭,现在开启
                gestureEnabled: true,
                cardStack: {
                    gestureEnabled: true,
                },
                cardStyleInterpolator: (props)=> CardStyleInterpolators.forHorizontalIOS(props)
            };
        },
    },
);

export default AppNavigation;
