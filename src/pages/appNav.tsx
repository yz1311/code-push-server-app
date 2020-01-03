/**
 * 采购发布就是销售发布去掉仓单的版本
 */
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
    createStackNavigator,
    withNavigationFocus,
    Header,
} from 'react-navigation';
import {withMappedNavigationProps} from 'react-navigation-props-mapper';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/module/views/StackView/StackViewStyleInterpolator';
import {NavigationBar, Theme, NavigationHelper} from '@yz1311/teaset';
import LoginIndex from './login/loginIndex';
import Register from './login/register';
import ChangePassword from './login/changePassword';
import HomeIndex from "./home/homeIndex";
import DeploymentIndex from "./deployment/deploymentIndex";
import CollaboratorList from './home/collaboratorList';
import DeploymentDetail from './deployment/deploymentDetail';
import ModifyName from "./common/modifyName";
import AccessKeyIndex from "./accessKey/accessKeyIndex";
import DeploymentTypeList from "./deployment/deploymentTypeList";
import ProfileSetting from "./profile/profileSetting";
import ProfileAbout from './profile/profileAbout';
import Scanner from './home/scanner';


let _navigation;

const AppNavigation = createStackNavigator(
    {
        LoginIndex:{screen:withMappedNavigationProps(LoginIndex)},
        Register:{screen:withMappedNavigationProps(Register),navigationOptions: {headerTitle: '注册'}},
        ChangePassword:{screen:withMappedNavigationProps(ChangePassword),navigationOptions: {headerTitle: '修改密码'}},
        HomeIndex:{screen:withMappedNavigationProps(HomeIndex)},
        DeploymentIndex:{screen:withMappedNavigationProps(DeploymentIndex)},
        CollaboratorList:{screen:withMappedNavigationProps(CollaboratorList)},
        DeploymentDetail:{screen:withMappedNavigationProps(DeploymentDetail)},
        ModifyName:{screen:withMappedNavigationProps(ModifyName)},
        AccessKeyIndex:{screen:withMappedNavigationProps(AccessKeyIndex)},
        DeploymentTypeList:{screen:withMappedNavigationProps(DeploymentTypeList)},
        Scanner:{screen:withMappedNavigationProps(Scanner)},
        ProfileSetting:{screen:withMappedNavigationProps(ProfileSetting),navigationOptions: {headerTitle: '设置'}},
        ProfileAbout:{screen:withMappedNavigationProps(ProfileAbout),navigationOptions: {headerTitle: '关于'}},
    },
    {
        initialRouteName: 'LoginIndex',
        // headerMode: 'screen',
        headerLayoutPreset: 'center',
        //@ts-ignore
        defaultNavigationOptions: (args) => {
            let navigation = args.navigation;
            _navigation = navigation;
            NavigationHelper.navigation = navigation;
            let params = navigation.state.params;
            let leftTitle;
            if (params) {
                leftTitle = params.leftTitle;
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
                            style={{position: 'relative', paddingLeft: 0}}
                            // type={'ios'}
                            title={
                                options.headerTitle
                                    ? options.headerTitle
                                    : navigation.state.params
                                    ? navigation.state.params.title
                                    : ''
                            }
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
                headerLeft: leftView,
                //ios默认开启，android默认关闭,现在开启
                gesturesEnabled: true,
                cardStack: {
                    gesturesEnabled: true,
                },
            };
        },
        transitionConfig: () => ({
            screenInterpolator: props => {
                const last = props.scenes[props.scenes.length - 1];
                // Transitioning from search screen (goBack)
                if (['YZVideoPlayerPage','HomeSearch'].indexOf(last.route.routeName)>=0) {
                    return StackViewStyleInterpolator.forFadeFromBottomAndroid(props);
                }

                return StackViewStyleInterpolator.forHorizontal(props);
            },
        }),
    },
);

export default AppNavigation;
