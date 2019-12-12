import {Alert, Platform} from "react-native";
import Permissions from "react-native-permissions";
import DeviceInfo from "react-native-device-info";
import IntentLauncher, {IntentConstant} from "@yz1311/react-native-intent-launcher";

export default class permissionUtils {
    static checkPermissionResult = (permissionResult:string,permissionTitle:string)=>{
        let promptText = `${appName}尚未开启${permissionTitle}权限，是否前往设置？`;
        //ios被拒绝一次后就不会再弹出请求窗口了
        //ios和android权限被更改后，app都会被系统强制重启，不是bug
        if(Platform.OS === 'ios')
        {
            if(['denied','restricted'].indexOf(permissionResult)>=0)
            {
                //@ts-ignore
                if(Permissions.canOpenSettings())
                {
                    Alert.alert(
                        '',
                        promptText,
                        [
                            {text: '取消'},
                            {text: '确定', onPress: () => Permissions.openSettings()}
                        ],
                        { cancelable: false }
                    )
                }
                else
                {
                    Alert.alert(
                        '',
                        `${appName}尚未开启${permissionTitle}权限，该该设备不支持跳转设置，请联系客服!`,
                        [
                            {text: '确定'}
                        ]
                    );
                }
                return false;
            }
        }
        else
        {
            if(permissionResult === 'restricted')
            {
                Alert.alert(
                    '',
                    promptText,
                    [
                        {text: '取消'},
                        {text: '确定', onPress: () => {
                                const bundleId = DeviceInfo.getBundleId();
                                IntentLauncher.startActivity({
                                    action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
                                    category: IntentConstant.CATEGORY_DEFAULT,
                                    flags: IntentConstant.FLAG_ACTIVITY_NEW_TASK | IntentConstant.FLAG_ACTIVITY_NO_HISTORY | IntentConstant.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS,
                                    data: 'package:' + bundleId,
                                })
                            }}
                    ],
                    { cancelable: false }
                )
                return false;
            }
        }
        return true;
    }

    static launcheBarcodePage = async (successAction,failAction)=>{
        //request方法整合到static方法里面，会报Can reqeust only one set of permissions at a time,不知道咋回事
        let permissionResult;
        //不要使用request，因为其对于手动设置权限的无效
        try {
            //@ts-ignore
            permissionResult = await Permissions.request('camera');
        }catch (e) {

        }
        const requestResult = permissionUtils.checkPermissionResult(permissionResult,'相机');
        if(!requestResult)
        {
            failAction&&failAction();
            return;
        }
        if(permissionResult === 'authorized')
        {
            successAction&&successAction();
        }
        else
        {
            Alert.alert(
                '',
                '需要相机权限才能进行二维码扫描,是否请求权限?',
                [
                    {text: '取消'},
                    {
                        text: '确定',
                        onPress: ()=>{
                            permissionUtils.launcheBarcodePage(successAction,failAction);
                        }
                    }
                ]

            );
        }
    }
}



