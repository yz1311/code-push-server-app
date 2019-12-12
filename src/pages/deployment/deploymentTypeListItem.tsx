import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, DeviceEventEmitter, Clipboard} from "react-native";
import CardView from 'react-native-cardview';
import {productModel} from "../../api/home";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {deploymentModel} from "../../api/deployment";
import StringUtils from "../../utils/stringUtils";
import moment from "moment";
import ToastUtils from "../../utils/toastUtils";
import {Alert, Menu, Theme} from "@yz1311/teaset";
import {Api} from "../../api";
import ForwardAddInputContainer from "../common/addInputContainer";


export interface IProps {
    item: deploymentModel,
    appName: string
}


function DeploymentTypeListItem (props:IProps) {
    const {item} = props;
    const fromView = useRef();
    const addInputContainerRef = useRef();

    const deleteConfirm = ()=>{
        Alert.alert('提示','是否删除该项?(注意:删除后，该key所关联的所有热更新将会失效，请一定一定谨慎操作)',[{
            text: '取消'
        }, {
            text: '删除',
            onPress:()=>{
                Alert.alert('提示','确定真的删除，删了就还原不了了',[
                    {
                        text: '取消'
                    }, {
                        text: '继续删除',
                        onPress:()=>{
                            deleteDeployment();
                        }
                    }
                ]);
            }
        }])
    };

    const deleteDeployment = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.deployment.deleteDeployment({
                request: {
                    appName: props.appName,
                    deploymentName: item.name
                }
            });
            ToastUtils.showToast('删除成功!');
            //刷新列表
            DeviceEventEmitter.emit('reload_deployment_type_list');
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    const showModifyModal = async ()=>{
        Alert.alert('修改名称',(
            <ForwardAddInputContainer ref={addInputContainerRef} defaultValue={item.name} placeholder={'请输入'}/>
        ),[{
            text: '取消',
            onPress:()=>{
                Alert.hide();
            }
        }, {
            text: '修改',
            onPress: ()=>{
                let value = (addInputContainerRef.current as any).getValue();
                //校验email
                if(value=='') {
                    ToastUtils.showToast('请输入Deployment名称!');
                    return;
                }
                modifyDeploymentName(value);
                Alert.hide();
            }
        }],{
            cancelable: true,
            autoClose: false
        });
    }

    const modifyDeploymentName = async (value)=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.deployment.modifyDeployment({
                request: {
                    appName: props.appName,
                    deploymentName: item.name,
                    name: value
                }
            });
            ToastUtils.showToast('修改成功!');
            //刷新列表
            DeviceEventEmitter.emit('reload_deployment_type_list');
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    return (
        <CardView
            style={{marginHorizontal:gScreen.width*0.02}}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TouchableOpacity
                onPress={()=>{

                }}
                style={{minHeight:100,backgroundColor:'white',borderRadius:6,paddingBottom:10,paddingLeft:10}}>
                <Text style={{fontSize:gFont.size18,color:gColors.themeColor,fontWeight:'bold',marginTop:10}}>{item.name}</Text>
                <Text style={{fontSize:gFont.size16,color:gColors.color333,marginTop:10}}>{'key: '+item.key}</Text>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                    <AntDesign name={'clockcircleo'} size={13} color={gColors.color333}/>
                    <Text style={{color:gColors.color333,fontSize:gFont.size13,marginLeft:5}}>{StringUtils.formatDate(moment(item.createdTime).format('YYYY-MM-DD HH:mm'))}</Text>
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
                                {title: <Text style={titleStyle} numberOfLines={1}>{'复制key'}</Text>, icon: <Feather style={{marginRight:8}} name={'clipboard'} size={22} color={gColors.color333}/>, onPress: () => {
                                        Clipboard.setString(item.key);
                                        ToastUtils.showToast('已复制到剪切板');
                                    }},
                                {title: <Text style={[titleStyle,{color:gColors.colorRed}]} numberOfLines={1}>{'删除'}</Text>, icon: <Feather style={{marginRight:8}} name={'trash-2'} size={22} color={gColors.colorRed}/>, onPress: () => {
                                        deleteConfirm();
                                    }},
                                {title: <Text style={titleStyle} numberOfLines={1}>{'修改名称'}</Text>, icon: <Feather style={{marginRight:8}} name={'edit'} size={22} color={gColors.color333}/>, onPress: () => {
                                        showModifyModal();
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

const MemorizedDeploymentTypeListItem = React.memo(DeploymentTypeListItem);

export default MemorizedDeploymentTypeListItem
