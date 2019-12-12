import {Toast, ModalIndicator, ModalIndicatorView} from '@yz1311/teaset';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';
//全局唯一的toast对象
let singleToast;

interface ToastOptions {
  duration?: number,
  position?: string,
  type?: string
}


export default class ToastUtils
{
    static overlayKey;
    static loadingOverlayKey;
    static indicatorView:ModalIndicatorView;
    static isLoading:boolean;

    //显示toast
    static showToast = (message,options: ToastOptions={})=>{
        let duration = ToastUtils.durations.SHORT;
        if(options.duration!==undefined)
        {
            duration = options.duration;
        }
        let position = ToastUtils.positions.BOTTOM;
        if (options.position !== undefined) {
          position = options.position;
        }
        let icon = null;
        switch (options.type) {
          case ToastUtils.types.success:
            icon = <FontAwesome name="check-circle" color={gColors.bgColorF} size={70}/>;
            break;
          case ToastUtils.types.error:
            icon = <FontAwesome name="times-circle" color={gColors.bgColorF} size={70}/>;
            break;
        }
        if (ToastUtils.overlayKey) {
          ToastUtils.hideToast();
        }
        ToastUtils.overlayKey = Toast.show({
          text: message,
          icon: icon,
          position: position
        });
    }

    //隐藏toast
    static hideToast = ()=>{
        if (ToastUtils.overlayKey) {
          Toast.hide(ToastUtils.overlayKey);
        }
    }


    static showLoading = (message = '正在加载中…')=>{
        if(ToastUtils.isLoading) {
            ToastUtils.hideLoading();
        }
        ModalIndicator.show(message);
        ToastUtils.isLoading = true;
    }

    static hideLoading = ()=>{
        ModalIndicator.hide();
        ToastUtils.isLoading = false;
    }

    //枚举
    //toast显示的时间
    static durations = {
      SHORTER:1000,  //1000ms
      SHORT:1500,  //1500ms
      MEDIUM:2000,  //2000ms
      LONG:2500     //2500ms
    };

    //toast显示的位置
    static positions = {
      TOP: 'top',         //20
      CENTER: 'center',   //-20
      BOTTOM: 'bottom'   //0
    };


    static types = {
        //Show a toast, similar to Android native toasts
        text:'TEXT',
        //Show a success image with a message
        success:'SUCCESS',
        //Show an error image with a message
        error:'ERROR',
    };


    static maskTypes = {
        none:1,
        Clear : 2,
        Black : 3
    }
}
