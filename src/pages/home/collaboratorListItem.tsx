import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, Clipboard} from "react-native";
import CardView from 'react-native-cardview';
import {parsedCollaboratorsModel, productModel} from "../../api/home";
import {Alert, Menu, Theme} from "@yz1311/teaset";
import Feather from "react-native-vector-icons/Feather";
import ToastUtils from "../../utils/toastUtils";
import Entypo from "react-native-vector-icons/Entypo";
import {Api} from "../../api";
import {useSelector} from "react-redux";
import {ReduxState} from "../../models";


export interface IProps {
    item: parsedCollaboratorsModel,
    appName: string,
    canModify: boolean,
    onRefresh: ()=>void
}


function CollaboratorListItem (props:IProps) {
    const {item} = props;
    const fromView = useRef();
    const {userInfo} = useSelector((state:ReduxState)=>({
        userInfo: state.loginIndex.userInfo
    }));
    const deleteConfirm = ()=>{
        if(item.name == userInfo.email) {
            Alert.alert('提示','App拥有者无法删除自己，您可以先转移App后，您会完全退出该App',[
                {
                    text: '知道了'
                }
            ]);
            return;
        }
        Alert.alert('提示','是否删除该参与者?',[{
            text: '取消'
        }, {
            text: '删除',
            style: 'destructive',
            onPress: async ()=> {
                deleteCollaborator();
            }
        }])
    };
    const deleteCollaborator = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.home.deleteCollaborator({
                request: {
                    appName: props.appName,
                    email: props.item.name
                }
            });
            ToastUtils.showToast('删除成功!');
            props.onRefresh&&props.onRefresh();
        }
        catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }
    let canModify = props.canModify;
    return (
        <CardView
            style={{marginHorizontal:gScreen.width*0.02}}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TouchableOpacity
                onPress={()=>{

                }}
                style={{minHeight:50,backgroundColor:'white',borderRadius:6,paddingVertical:10,paddingHorizontal:10}}>
                <Text style={{fontSize:gFont.size18,color:gColors.themeColor,fontWeight:'bold'}}>{item.name}</Text>
                <Text style={{fontSize:gFont.size14,color:gColors.color666,marginTop:10}}>{item.permission}</Text>
                {canModify ?
                    <TouchableOpacity
                        ref={fromView}
                        onPress={() => {
                            (fromView.current as any).measureInWindow((x, y, width, height) => {
                                let titleStyle: any = {
                                    color: gColors.color333,
                                    fontSize: Theme.menuItemFontSize,
                                    overflow: 'hidden',
                                    flexGrow: 1,
                                    flexShrink: 1,
                                };
                                let items = [
                                    {
                                        title: <Text style={[titleStyle, {color: gColors.colorRed}]}
                                                     numberOfLines={1}>{'删除'}</Text>,
                                        icon: <Feather style={{marginRight: 8}} name={'trash-2'} size={22}
                                                       color={gColors.colorRed}/>,
                                        onPress: () => {
                                            deleteConfirm();
                                        }
                                    },
                                ];
                                Menu.show({x, y, width, height}, items, {
                                    direction: 'left',
                                    showArrow: true,
                                    popoverStyle: {backgroundColor: 'white'}
                                });
                            });
                        }}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: 50,
                            height: 50,
                            paddingTop: 10,
                            paddingLeft: 10
                        }}
                    >
                        <Entypo name={'chevron-thin-down'} size={22} color={gColors.color999}/>
                    </TouchableOpacity>
                    :
                    null
                }
            </TouchableOpacity>
        </CardView>
    );
}

const MemorizedCollaboratorListItem = React.memo(CollaboratorListItem);

export default MemorizedCollaboratorListItem
