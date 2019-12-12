import React, {FC, PureComponent} from "react";
import {
    View,
    Text, StyleSheet, TouchableOpacity, TextInput
} from 'react-native';
import {Overlay} from "@yz1311/teaset";
import ToastUtils from "../../utils/toastUtils";
import {Api} from "../../api";
import {connect} from "react-redux";

interface IProps {
    onSuccess: ()=>void,
    closeModal: ()=>void,
}

interface IState {
    appName: string
    os: string,
    platform: string
}

export default class AddApp extends PureComponent<IProps,IState>{

    readonly state:IState = {
        appName: '',
        os: 'Android',
        platform: 'React-Native'
    };

    addApp = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.home.addProduct({
                request: {
                    name: this.state.appName,
                    os: this.state.os,
                    platform: this.state.platform,
                }
            });
            ToastUtils.showToast('添加成功');
            this.props.closeModal&&this.props.closeModal();
            //刷新列表
            this.props.onSuccess&&this.props.onSuccess();
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        const {closeModal} = this.props;
        return (
            <View>
                <Text style={{fontSize:gFont.size18,color:gColors.color0,alignSelf:'center'}}>新增</Text>
                <View style={{backgroundColor:gColors.color999,height:gScreen.onePix,marginVertical:15}}/>
                <View style={{paddingHorizontal:10,paddingBottom:15}}>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle]}>名称：</Text>
                        <TextInput
                            style={{borderRadius:6,borderColor:gColors.themeColor,
                                height: gScreen.isAndroid?40:35,paddingHorizontal:4,
                                borderWidth:gScreen.onePix,flex:1}}
                            textAlignVertical={'top'}
                            value={this.state.appName}
                            onChangeText={value=>{
                                this.setState({
                                    appName: value
                                });
                            }}
                        />
                    </View>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle]}>OS：</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        {['iOS','Android','Windows'].map((item,index)=>{
                            return (
                                <TagIcon key={index} title={item}
                                         onPress={()=>{
                                             this.setState({
                                                 os: item
                                             });
                                         }}
                                         selected={this.state.os==item}/>
                            );
                        })}
                        </View>
                    </View>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle]}>平台：</Text>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        {['React-Native','Cordova'].map((item,index)=>{
                            return (
                                <TagIcon key={index} title={item}
                                         onPress={()=>{
                                             this.setState({
                                                 platform: item
                                             });
                                         }}
                                         selected={this.state.platform==item}/>
                            );
                        })}
                        </View>
                    </View>
                </View>
                <View style={{backgroundColor:gColors.borderColorE5,height:gScreen.onePix,marginTop:15}}/>
                <View style={{flexDirection:'row',height:45,marginHorizontal:-10}}>
                    <TouchableOpacity
                        style={{flex:1,justifyContent:'center',alignItems:'center',borderBottomLeftRadius:6}}
                        onPress={()=>{
                            closeModal&&closeModal();
                        }}
                    >
                        <Text style={{color:gColors.color999,fontSize:gFont.size15}}>取消</Text>
                    </TouchableOpacity>
                    <View style={{backgroundColor:gColors.borderColorE5,width:gScreen.onePix}}/>
                    <TouchableOpacity
                        style={{flex:1,justifyContent:'center',alignItems:'center',borderBottomRightRadius:6}}
                        onPress={()=>{
                            if(this.state.appName=='' || this.state.appName&&this.state.appName.trim()=='') {
                                ToastUtils.showToast('请填写名称');
                                return;
                            }
                            this.addApp();
                        }}
                    >
                        <Text style={{color:gColors.themeColor,fontSize:gFont.size15}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const TagIcon:FC<{title:string,selected:boolean,onPress}> = ({title,selected,onPress})=>{
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{height:40,width:90,justifyContent:'center',alignItems:"center",
            borderColor:selected?gColors.themeColor:gColors.color999,borderWidth:gScreen.onePix,marginRight:7,
            backgroundColor:selected?gColors.themeColor:gColors.bgColorF,
            borderRadius:6}}
        >
            <Text style={{color:selected?gColors.bgColorF:gColors.color0}}>{title}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    itemContainer: {
        flexDirection:'row',
        alignItems:'center',
        marginTop:15
    },
    itemTitle: {
        fontSize:gFont.size15,
        color:gColors.color0,
        width:50
    }
})
