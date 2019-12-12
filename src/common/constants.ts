import {Dimensions, PixelRatio, Platform,NativeModules} from 'react-native';
import {gColors, gFont} from "./styles";
import {Theme} from "@yz1311/teaset";

global.gUserData = {
    session_id:'',
    uid:'',
    roleId:'',
    token:'',
    custType:'',
    telNo: '',
    userId: ''
};

global.gBaseConfig = {
    PushToken: '',
    UniqueId: '',
    BuildVersion: '1.0.0',
    iOSCameraPermissionPrompt: '',
    clientId: '26b72b8b-ecaf-4053-91c4-8e87848fdc56',
    clientSecret: '2BfV6Jq0dN5sxL2gEfXgblgVFq8stp4M5dOWK3i5GNqlZgVg6rYpzIMZHJ0IHBv_ga7Wca1L1O5o8UIW',
    amapKey: '074abc56240bdfd01e613727f4aea250'
};

global.appTypes = {
    huozhu: 1,
    huozhu_vip: 2 ,
    jianzhuang: 3,
    chuandong: 4,
    all: 5
};

global.appName = '热更新';

global.gColors = gColors;
global.gFont = gFont;

enum ServerPathTypes {
    dev = 'dev',
    test = 'test',
    online = 'online',
}

//开发服务地址
export const serverPath_dev = ``;
//测试服务地址
export const serverPath_test = ``;
//正式服务地址
export const serverPath_online = ``;

//dev  test  online
const Server_Env: string = ServerPathTypes.dev;
switch (Server_Env) {
//开发环境配置
    case 'dev':
        //老接口
        global.gServerPath = serverPath_dev;
        break;

    //测试环境配置
    case 'test':
        global.gServerPath = serverPath_test;
        break;

    //生产环境配置
    default:
    case 'online':
        global.gServerPath = serverPath_online;
        break;
}


global.gScreen = {
    designWidth: 750,	//设计宽度 1X
    designHeight: 1334,	//设计高度 1X
    onePix: 1 / PixelRatio.get(),
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    isAndroid: Platform.OS === 'android',
    //状态栏+导航栏的高度(不准确)
    headerHeight: Platform.OS === 'android' ? 50 : 64,
    //导航栏的高度(建议高度，如果使用teaset的NavigationBar的话，不准确)
    navigationBarHeight: Platform.OS === 'android' ? 50 : 44,
    //状态栏的高度
    statusBarHeight: Theme.statusBarHeight,
    isTranslucent:true,
    isIphoneX: Theme.isIPhoneX,
    px2dp: (w:number) => {
        return gScreen.width / gScreen.designWidth * w;
    }
};

(()=>{
    //API19版本以上才支持沉浸式状态栏
    if(Platform.OS==='android'&&Platform.Version>=19) {

    } else {
        gScreen.isTranslucent = false;
    }
})()

global.fontSizeScaler = PixelRatio.get()/PixelRatio.getFontScale();

global.gMargin = 10,
global.activeOpacity=0.75;


global.gStorageKeys = {
    CurrentUser: 'CurrentUser',
    HistoryUsers: 'HistoryUsers',
    LocationHistoryList: 'LocationHistoryList',
    ServerPath: `ServerPath`
};

global.Constant = {
    getDateDiff: function(timeStr) {
        let timeStamp = Date.parse(timeStr.replace(/-/gi, "/"));
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let month = day * 30;
        let now = new Date().getTime();
        let diffValue = now - timeStamp;
        if (diffValue < 0) {
            return;
        }
        let monthC = diffValue / month;
        let weekC = diffValue / (7 * day);
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;
        let result = "";

        if (monthC >= 1) {
            result = parseInt(monthC+'') + "月前";
        } else if (weekC >= 1) {
            result = parseInt(weekC+'') + "周前";
        } else if (dayC >= 1) {
            result = parseInt(dayC+'') + "天前";
        } else if (hourC >= 1) {
            result = parseInt(hourC+'') + "小时前";
        } else if (minC >= 1) {
            result = parseInt(minC+'') + "分钟前";
        } else {
            result = "刚刚";
        }

        return result;
    },
    differDates: function (startDate, endDate) {
        let d1 = Date.parse(startDate.replace(/-/gi, "/"));
        let d2 = Date.parse(endDate.replace(/-/gi, "/"));
        let date = (d2 - d1) / (1000 * 60 * 60 * 24);
        return date;
    }
};
