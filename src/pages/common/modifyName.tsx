import React, {useState} from 'react';
import {
    View,
    TextInput,
    Text, TouchableOpacity
} from 'react-native';
import {Styles} from "../../common/styles";
import {NavigationBar} from "@yz1311/teaset";

export interface IProps {
    maxLength: number,
    title: string,
    value: string,
    onSubmit:(value:string)=>void
}

function ModifyName(props:IProps) {
    const [value,setValue] = useState(props.value||'');
    return (
        <View style={[Styles.container,{backgroundColor: gColors.bgColorF}]}>
            <NavigationBar style={{position:'relative'}}
                           rightView={
                               <TouchableOpacity
                                   onPress={()=>{
                                       props.onSubmit&&props.onSubmit(value);
                                   }}
                                    style={{alignSelf:'stretch',flex:1,marginRight:-4,justifyContent:'center',paddingHorizontal:10}}
                                   >
                                   <Text style={{fontSize:gFont.size16,color:gColors.bgColorF}}>完成</Text>
                               </TouchableOpacity>
                           }
                           title={props.title || '编辑'} />
            <View style={{paddingHorizontal:10}}>
                <TextInput
                    style={{height:45,borderBottomColor:gColors.themeColor,
                        fontSize:gFont.size18,marginTop:15,
                        borderBottomWidth:gScreen.onePix}}
                    value={value}
                    placeholder={'请输入'}
                    onChangeText={value=>setValue(value)}
                    />
                <Text style={{marginTop:10,alignSelf:'flex-end',fontSize:gFont.size13,color:gColors.color666}}>{`${value.length}/${props.maxLength}`}</Text>
            </View>
        </View>
    );
}

ModifyName.navigationOptions = ({navigation})=>{
    return {
        header: null
    }
}

ModifyName.defaultProps = {
    maxLength: 200
};

export default ModifyName;
