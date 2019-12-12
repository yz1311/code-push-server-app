import React from 'react';
import {View, Text, TouchableOpacity, DeviceEventEmitter, StyleSheet} from "react-native";
import CardView from 'react-native-cardview';
import {productModel} from "../../api/home";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Styles} from "../../common/styles";


export interface IProps {
    item: productModel
}


function AppListItem (props:IProps) {
    const {item} = props;
    const addCollect = ()=>{
        DeviceEventEmitter.emit('update_add_collect',item);
    }
    return (
        <CardView
            style={{marginHorizontal:gScreen.width*0.02}}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TouchableOpacity
                onPress={()=>{
                    NavigationHelper.navigate('DeploymentIndex', {
                        appName: item.name,
                        item: item
                    });
                }}
                style={{minHeight:100,backgroundColor:'white',borderRadius:6,paddingBottom:10,paddingLeft:10}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={[Styles.flexRow,Styles.flexCrossAxisCenter,{marginTop:10}]}>
                        <Text style={{fontSize:gFont.size18,color:gColors.themeColor,fontWeight:'bold',marginRight:10}}>{item.name}</Text>
                        {
                            {
                                'android': <Ionicons name='logo-android' color={gColors.colorGreen1} size={25}/>,
                                'ios': <Ionicons name='logo-apple' color={gColors.color0} size={25}/>,
                                'windows': <Ionicons name='logo-windows' color={'#0082D0'} size={25}/>,
                            }[item.os.toLowerCase()+'']
                        }
                    </View>
                    <TouchableOpacity
                        style={{paddingVertical:10,paddingHorizontal:10}}
                        onPress={addCollect}
                        >
                        <AntDesign name={item.collect?'heart':'hearto'} color={item.collect?gColors.colorRed:gColors.color999} size={25}/>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:10}}>
                    <Text style={{marginTop:10}}>{item.platform}</Text>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}>
                        {
                            (item.deployments||[]).map((deployment,index)=>{
                                return (
                                    <View key={index} style={{backgroundColor:gColors.borderColorE5,height:26,
                                        paddingHorizontal:13,borderRadius:13,marginTop:10,
                                        justifyContent:'center',alignItems:'center',marginLeft:15,}}>
                                        <Text style={{color:gColors.color333}}>{deployment}</Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
            </TouchableOpacity>
        </CardView>
    );
}

const MemorizedAppListItem = React.memo(AppListItem);

export default MemorizedAppListItem
