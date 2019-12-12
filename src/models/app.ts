import Model from "../../dva";
import {StatusBarStyle} from "react-native";

export interface IState {
    barStyle: StatusBarStyle,
    isConnected: boolean,
    //屏幕的方向
    isLandscape:boolean,
    //isConnected为true的,该值才有效
    isWifi: boolean,
    isFetching: boolean,
    loadingTitle: string,
}

const initialState:IState = {
    barStyle: 'light-content',
    isConnected: false,
    //屏幕的方向
    isLandscape:false,
    //isConnected为true的,该值才有效
    isWifi:false,
    isFetching:false,
    loadingTitle:'',
};

export default {
    namespace: 'app',
    state: initialState,
    reducers: {
        setBarStyle: (state:IState, action) => {
            state.barStyle = action.payload;
        },
    }
} as Model;
