import React, {FC} from "react";
import {DeviceEventEmitter, Text, TouchableOpacity, View} from "react-native";


interface IProps {
    title: string,
    pickerCancelBtnText?: string,
    pickerConfirmBtnText?: string,
    onPickerCancel?: any,
    onPickerConfirm?: any
}

const YZPickerHeader: FC<IProps> = ({title,pickerCancelBtnText = '取消',pickerConfirmBtnText = '确定',onPickerCancel,onPickerConfirm})=>{
    return (
        <View style={{flexDirection:'row',justifyContent:'space-between',height:45,borderBottomColor:gColors.borderColorE5,borderBottomWidth:0.7,backgroundColor:gColors.bgColorF}}>
            <TouchableOpacity
                activeOpacity={activeOpacity}
                style={{paddingLeft:8,paddingRight:8,justifyContent:'center'}}
                onPress={()=>{
                    onPickerCancel&&onPickerCancel();
                }}
            >
                <Text style={{color:gColors.color666,fontSize:gFont.size15}}>{pickerCancelBtnText}</Text>
            </TouchableOpacity>
            <Text style={{alignSelf:'center',color:gColors.color0,fontSize:gFont.size16}}>{title}</Text>
            <TouchableOpacity
                activeOpacity={activeOpacity}
                style={{paddingLeft:8,paddingRight:8,justifyContent:'center'}}
                onPress={()=>{
                    onPickerConfirm&&onPickerConfirm();
                }}
            >
                <Text style={{color:gColors.themeColor,fontSize:gFont.size15}}>{pickerConfirmBtnText}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default YZPickerHeader;