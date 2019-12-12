/**
 * 热更新列表
 */
import React, {FC, forwardRef, PureComponent, useImperativeHandle, useState} from "react";
import {FlatList, RefreshControl, StyleSheet, TextInput, View} from "react-native";
import {Styles} from "../../common/styles";
import {Button, NavigationBar, Alert} from "@yz1311/teaset";
import {Api} from "../../api";
import YZStateCommonView from "../../components/YZStateCommonView";
import RequestUtils, {createReducerResult, dataToReducerResult, ReducerResult} from "../../utils/requestUtils";
import {
    collaboratorsModel,
    packageModel, parsedCollaboratorsModel,
    productModel
} from "../../api/home";
import MemorizedCollaboratorListItem from "./collaboratorListItem";
import {connect, useSelector} from "react-redux";
import ToastUtils from "../../utils/toastUtils";
import {spawn} from "redux-saga/effects";
import ForwardAddInputContainer from '../common/addInputContainer';
import YZFlatList from "../../components/YZFlatList";
import {ReduxState} from "../../models";
import {userInfoModel} from "../../api/login";

export interface IProps {
    appName: string,
    tabLabel: string,
    userInfo?: userInfoModel
}

export interface IState {
    dataList: Array<parsedCollaboratorsModel>,
    loadDataResult: ReducerResult,
    email: string
}

@(connect((state:ReduxState)=>({
    userInfo: state.loginIndex.userInfo
})) as any)
export default class CollaboratorList extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            headerTitle: '参与者'
        };
    }
    private addInputContainerRef:any;
    private _flatList:YZFlatList;

    readonly state:IState = {
        dataList: [],
        loadDataResult: createReducerResult(),
        email: ''
    };

    componentDidMount(): void {
        this.loadData();
    }

    onRefresh = ()=>{
        this._flatList&&this._flatList._onRefresh();
    }

    loadData = async ()=> {
        try {
            let response = await Api.home.listCollaborators({
                request: {
                    appName: this.props.appName,
                }
            });
            let dataList = [];
            Object.keys(response.data.collaborators || {}).map(key=>{
               dataList.push({
                   name: key,
                   ...response.data.collaborators[key]
               });
            });
            this.setState({
                loadDataResult: dataToReducerResult(dataList),
                dataList: dataList
            });
        } catch (e) {
            this.setState({
                loadDataResult: dataToReducerResult(e)
            });
        } finally {

        }
    }

    addCollaborator = async (email)=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.home.addCollaborator({
                request: {
                    appName: this.props.appName,
                    email: email
                }
            });
            ToastUtils.showToast('添加成功!');
            this.onRefresh();
        } catch (e) {
            ToastUtils.showToast(e.message || '添加失败!');
        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        const {loadDataResult, dataList} = this.state;
        const {userInfo} = this.props;
        return (
            <View style={[Styles.container]}>
                <YZStateCommonView loadDataResult={loadDataResult} errorButtonAction={()=>this.loadData()}>
                    <View style={[Styles.container]}>
                        <YZFlatList
                            ref={ref=>this._flatList=ref}
                            renderItem={(data)=>(<MemorizedCollaboratorListItem
                                {...data}
                                appName={this.props.appName}
                                //只有拥有者才能编辑
                                canModify={dataList.some(x=>x.name==userInfo.email&&x.permission=='Owner')}
                                onRefresh={this.onRefresh}
                                />)}
                            data={dataList}
                            noMore={true}
                            loadData={this.loadData}
                            loadDataResult={loadDataResult}
                            keyExtractor={(item,index)=>index+''}
                            ListHeaderComponent={<View style={{height:10}}/>}
                            ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: 'transparent' }}/>}
                        />
                    </View>
                </YZStateCommonView>
                <Button style={{marginHorizontal:gScreen.width*0.1,marginBottom:15}}
                        type={'primary'}
                        title={'添加'}
                        onPress={()=>{
                            Alert.alert('添加成员',(
                                <ForwardAddInputContainer ref={ref=>this.addInputContainerRef=ref} placeholder={'请输入邮箱'}/>
                            ),[{
                                text: '取消',
                                onPress:()=>{
                                    Alert.hide();
                                }
                            }, {
                                text: '添加',
                                onPress: ()=>{
                                    let email = this.addInputContainerRef.getValue();
                                    //校验email
                                    if(!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email)) {
                                        ToastUtils.showToast('请输入正确的邮箱!');
                                        return;
                                    }
                                    this.addCollaborator(email);
                                    Alert.hide();
                                }
                            }],{
                                cancelable: true,
                                autoClose: false
                            });
                        }}
                />
            </View>
        );
    }
}
