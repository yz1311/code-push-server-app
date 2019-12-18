import React, {FC, forwardRef, useImperativeHandle, useState} from "react";
import {TextInput, View} from "react-native";


export interface IProps {
    placeholder: string,
    defaultValue?: string
}

const AddInputContainer:FC<IProps> = ({placeholder,defaultValue},ref)=>{
    const [email,setEmail] = useState(defaultValue || '');
    useImperativeHandle(ref, () => ({
        getValue: () => {
            return email
        }
    }));
    return (
        <View style={{marginVertical:15,alignSelf:'stretch',marginHorizontal:15,
            paddingHorizontal:6,
            borderWidth:gScreen.onePix,borderColor:gColors.themeColor,borderRadius:5}}>
            <TextInput style={{alignSelf:'stretch',height:40}} keyboardType='numeric'
                       value={email}
                       placeholder={placeholder} onChangeText={(value) => {
                setEmail(value);
            }} />
        </View>
    );
}

const ForwardAddInputContainer = forwardRef(AddInputContainer);

ForwardAddInputContainer.defaultProps = {
  placeholder: '请输入'
};

export default ForwardAddInputContainer;
