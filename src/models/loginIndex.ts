import {DrawerActions} from "react-navigation";
import ToastUtils from "../utils/toastUtils";

import {put} from "redux-saga/effects";
import {Action} from "redux-actions";
import _buffer from 'buffer';
import {Api} from "../api";
import {userInfoModel, userLoginRequest} from "../api/login";
import Model from 'dva-core';

export interface IState {
    isLogin: boolean,
    loginCode: string,
    token: string,
    expiresIn: number,
    tokenType: string,
    refreshToken: string,
    userInfo: Partial<userInfoModel>,
    companyInfo: any,
}

const initialState:IState = {
    isLogin: false,
    loginCode: '',
    token: '',
    expiresIn: 0,
    tokenType: '',
    refreshToken: '',
    userInfo: {},
    companyInfo: {},
};

export default {
    namespace: 'loginIndex',
    state: initialState,
    reducers: {
        setUserLogin: (state:IState, action:Action<any>) => {
            const {token} = action.payload;
            //加密token
            let enToken = 'Basic '+new _buffer.Buffer('auth:'+token).toString('base64');
            state.isLogin = true;
            state.token = enToken;
            gUserData.token = enToken;
            gStorage.save('token',token);
            state.userInfo = action.payload;
        },
        setLogout: (state:IState, action) => {
            state = initialState;
        },
        setUserInfo: (state:IState, action) => {
            const {account} = action.payload;
            state.userInfo = account;
        },
    },
    effects: {
        * userLogin(action, effects) {
            ToastUtils.showLoading();
            try {
                let response = yield Api.login.userLogin(action.payload);
                const parData:userLoginRequest = action.payload;
                gStorage.save(gStorageKeys.ServerPath,parData.request.serverPath);
                yield effects.put({
                    type: 'setUserLogin',
                    payload: {
                        token: response.data.results.tokens
                    }
                });
                yield effects.put({
                    type: 'getUserInfo',
                    payload: {

                    }
                });
                NavigationHelper.replace('HomeIndex');
            } catch (e) {

            } finally {
                ToastUtils.hideLoading();
            }
        },
        * getUserInfo(action, effects) {
            try {
                let response = yield Api.login.getUserInfo(action.payload);
                yield effects.put({
                    type: 'setUserInfo',
                    payload: {
                        account: response.data.account
                    }
                });
                gStorage.save(gStorageKeys.CurrentUser,response.data.account);
            } catch (e) {

            } finally {
            }
        },
        * logout(action, effects) {
            yield effects.put({
                type: 'setLogout',
                payload: {

                }
            });
            yield gStorage.remove('token');
            ToastUtils.showToast('退出成功!');
            NavigationHelper.resetTo('LoginIndex');
        },
    }
} as Model;
