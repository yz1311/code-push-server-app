import React, {PureComponent} from "react";
import {
    View,
    Text, StyleSheet, TouchableOpacity, TextInput
} from 'react-native';
import {Overlay} from "@yz1311/teaset";
import ToastUtils from "../../utils/toastUtils";
import {Api} from "../../api";
import {connect} from "react-redux";
import {ReduxState} from "../../models";
import {userInfoModel} from "../../api/login";
import {accessKeyModel} from "../../api/accessKey";

interface IProps {
    onSuccess: (item:accessKeyModel)=>void,
    closeModal: ()=>void,
    userInfo: userInfoModel
}

interface IState {
    friendlyName: string
    description: string,
    validateMinute: string
}

export default class AddAccessKey extends PureComponent<IProps,IState>{

    readonly state:IState = {
        friendlyName: 'Login-'+(new Date()).getTime(),
        description: '',
        validateMinute: 30+''
    };

    addAccessKey = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.accessKey.addAccessKey({
                request: {
                    friendlyName: this.state.friendlyName,
                    description: this.state.description,
                    ttl: parseInt(this.state.validateMinute)*24*60*60*1000,
                    createdBy: this.props.userInfo.email,
                    isSession: true
                }
            });
            ToastUtils.showToast('添加成功');
            this.props.closeModal&&this.props.closeModal();
            //刷新列表
            this.props.onSuccess&&this.props.onSuccess(response.data.accessKey);
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        const {userInfo, closeModal} = this.props;
        return (
            <View>
                <Text style={{fontSize:gFont.size18,color:gColors.color0,alignSelf:'center'}}>新增</Text>
                <View style={{backgroundColor:gColors.color999,height:gScreen.onePix,marginVertical:15}}/>
                <View style={{paddingHorizontal:10}}>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle]}>名称：</Text>
                        <TextInput
                            style={{borderRadius:6,borderColor:gColors.themeColor,
                                height: gScreen.isAndroid?40:35,paddingHorizontal:4,
                                borderWidth:gScreen.onePix,flex:1}}
                            textAlignVertical={'top'}
                            value={this.state.friendlyName}
                            onChangeText={value=>{
                                this.setState({
                                    friendlyName: value
                                });
                            }}
                        />
                    </View>
                    <Text style={{color:gColors.color7,fontSize:gFont.size12,marginTop:7}}>必须为唯一值，默认值为'Login-'+(new Date()).getTime()</Text>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle]}>有效期：</Text>
                        <TextInput
                            style={{borderRadius:6,borderColor:gColors.themeColor,
                                height: gScreen.isAndroid?40:35,paddingHorizontal:4,
                                borderWidth:gScreen.onePix,flex:1}}
                            value={this.state.validateMinute}
                            keyboardType={'numeric'}
                            onChangeText={value=>{
                                this.setState({
                                    validateMinute: value
                                });
                            }}
                        />
                        <Text style={[styles.itemTitle,{marginLeft:10}]}>天</Text>
                    </View>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle,{alignSelf:'flex-start'}]}>描述：</Text>
                        <TextInput
                            style={{borderRadius:6,borderColor:gColors.themeColor,
                                height: 80,paddingHorizontal:4,
                                borderWidth:gScreen.onePix,flex:1}}
                            multiline={true}
                            textAlignVertical={'top'}
                            numberOfLines={6}
                            value={this.state.description}
                            onChangeText={value=>{
                                this.setState({
                                    description: value
                                });
                            }}
                            />
                    </View>
                    <View style={[styles.itemContainer]}>
                        <Text style={[styles.itemTitle]}>创建人：</Text>
                        <Text style={[styles.itemTitle,{width: null}]}>{userInfo.email}</Text>
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
                            this.addAccessKey();
                        }}
                    >
                        <Text style={{color:gColors.themeColor,fontSize:gFont.size15}}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
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
        width:80
    }
})
