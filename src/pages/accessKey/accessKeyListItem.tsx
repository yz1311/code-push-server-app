import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, Clipboard} from "react-native";
import CardView from 'react-native-cardview';
import {accessKeyModel} from "../../api/accessKey";
import moment from "moment";
import {Alert, Menu, Theme} from "@yz1311/teaset";
import ToastUtils from "../../utils/toastUtils";
import {Api} from "../../api";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";


export interface IProps {
    item: accessKeyModel,
    onDeleteSuccess:()=>void
}


function AccessKeyListItem (props:IProps) {
    const {item} = props;
    const fromView = useRef();
    const deleteAccessKey = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.accessKey.removeAccessKey({
                request: {
                    name: props.item.friendlyName
                }
            });
            props.onDeleteSuccess&&props.onDeleteSuccess();
            ToastUtils.showToast('删除成功!');
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }
    return (
        <CardView
            style={{marginHorizontal:gScreen.width*0.02,backgroundColor:'white'}}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TouchableOpacity
                onPress={()=>{

                }}
                style={{minHeight:50,backgroundColor:'white',borderRadius:6,paddingVertical:10,paddingHorizontal:10}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-between"}}>
                    <Text style={{fontSize:gFont.size18,color:gColors.themeColor,fontWeight:'bold'}}>{item.friendlyName}</Text>
                </View>
                <Text style={{fontSize:gFont.size14,color:gColors.color666,marginTop:10}}>{item.description}</Text>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                    <Text style={{fontSize:gFont.size12,color:gColors.color333}}>{'创建: '+moment(item.createdTime).format('YYYY-MM-DD HH:mm')}</Text>
                    <Text style={{fontSize:gFont.size12,color:gColors.color333,marginLeft:20}}>{item.createdBy}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                    <Text style={{fontSize:gFont.size12,color:gColors.colorRed}}>{'过期: '+moment(item.expires).format('YYYY-MM-DD HH:mm')}</Text>
                </View>
                <TouchableOpacity
                    ref={fromView}
                    onPress={()=>{
                        (fromView.current as any).measureInWindow((x, y, width, height) => {
                            let titleStyle:any = {
                                color: gColors.color333,
                                fontSize: Theme.menuItemFontSize,
                                overflow: 'hidden',
                                flexGrow: 1,
                                flexShrink: 1,
                            };
                            let items = [
                                {title: <Text style={[titleStyle,{color:gColors.colorRed}]} numberOfLines={1}>{'删除'}</Text>, icon: <Feather style={{marginRight:8}} name={'trash-2'} size={22} color={gColors.colorRed}/>, onPress: () => {
                                        Alert.alert('提示','是否删除该项?',[{
                                            text: '取消'
                                        }, {
                                            text: '确定',
                                            onPress:()=>{
                                                deleteAccessKey();
                                            }
                                        }])
                                    }},
                            ];
                            Menu.show({x, y, width, height}, items, {direction:'left',showArrow:true,popoverStyle:{backgroundColor:'white'}});
                        });
                    }}
                    style={{position:'absolute',right:0,top:0,width:50,height:50,paddingTop:10,paddingLeft:10}}
                >
                    <Entypo name={'chevron-thin-down'} size={22} color={gColors.color999}/>
                </TouchableOpacity>
            </TouchableOpacity>
        </CardView>
    );
}

const MemorizedAccessKeyListItem = React.memo(AccessKeyListItem);

export default MemorizedAccessKeyListItem
