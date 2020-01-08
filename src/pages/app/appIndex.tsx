import React,{PureComponent} from "react";
import {
    DeviceEventEmitter,
    EmitterSubscription,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import {Styles} from "../../common/styles";
import {NavigationBar, Theme} from "@yz1311/teaset";
import {Api} from "../../api";
import ScrollableTabView,{DefaultTabBar} from '@yz1311/react-native-scrollable-tab-view';
import create = StyleSheet.create;
import RequestUtils, {createReducerResult, dataToReducerResult, ReducerResult} from "../../utils/requestUtils";
import {productModel} from "../../api/home";
import produce from "immer";
import AppList from "../app/appList";
import ToastUtils from "../../utils/toastUtils";
import {deploymentModel} from "../../api/deployment";

export interface IProps {

}

export interface IState {
    dataList: Array<productModel>,
    loadDataResult: ReducerResult,
}

export default class AppIndex extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            headerShown: false
        };
    }

    private updateListener:EmitterSubscription;
    private updateNameListener:EmitterSubscription;
    private updateDeploymentListener:EmitterSubscription;
    private reloadListener:EmitterSubscription;

    readonly state:IState = {
        dataList: [],
        loadDataResult: createReducerResult()
    };

    componentDidMount(): void {
        this.loadData();
        this.updateListener = DeviceEventEmitter.addListener('update_add_collect',this.updateAppCollect);
        this.reloadListener = DeviceEventEmitter.addListener('reload_app_list',this.loadData);
        this.updateNameListener = DeviceEventEmitter.addListener('update_app_name',({appName, name})=>{
            let nextDataList = produce(this.state.dataList,draftState=>{
                for (let app of draftState) {
                    if(app.name==appName) {
                        app.name = name;
                        break;
                    }
                }
            });
            this.setState({
                dataList: nextDataList
            });
        });
        this.updateDeploymentListener = DeviceEventEmitter.addListener('update_deployment_type_list',({dataList, appName}:{dataList:Array<deploymentModel>,appName:string})=>{
            this.setState({
                dataList: this.state.dataList.map(x=>{
                    if(x.name == appName) {
                        return {
                            ...x,
                            deployments: dataList.map(y=>y.name)
                        };
                    }
                    return x;
                })
            });
        });
    }

    componentWillUnmount(): void {
        this.updateListener&&this.updateListener.remove();
        this.reloadListener&&this.reloadListener.remove();
        this.updateNameListener&&this.updateNameListener.remove();
        this.updateDeploymentListener&&this.updateDeploymentListener.remove();
    }

    loadData = async ()=> {
        try {
            let response = await Api.home.getProducts({
                request: {

                }
            });
            let collectList = await gStorage.load('app_collect_list') || [];
            let dataList = (response.data.apps || []).reverse();
            dataList.forEach(x=>{
                if(collectList.indexOf(x.id)>=0) {
                    x.collect = true;
                }
            });
            console.log(dataList)
            this.setState({
                loadDataResult: dataToReducerResult(dataList),
                dataList: dataList,
            });
        } catch (e) {
            this.setState({
                loadDataResult: dataToReducerResult(e)
            });
        } finally {

        }
    }

    updateAppCollect = async (item:productModel)=>{
        let nextDataList = produce(this.state.dataList,draftState=>{
            for (let app of draftState) {
                if(app.id == item.id) {
                    app.collect = !(app.collect || false);
                    break;
                }
            }
        });
        this.setState({
            dataList: nextDataList
        });
        //更新列表
        let collectList = await gStorage.load('app_collect_list') || [];
        if(item.collect) {
            //取消
            collectList = collectList.filter(x=>x!==item.id);
            ToastUtils.showToast('取消成功');
        } else {
            //添加
            collectList.push(item.id);
            ToastUtils.showToast('添加成功');
        }
        gStorage.save('app_collect_list',collectList);
    }

    render () {
        const {loadDataResult, dataList} = this.state;
        return (
            <View style={[Styles.container]}>
                <NavigationBar style={{position:'relative'}} title={'App列表'} leftView={null} rightView={
                    <TouchableOpacity
                        onPress={()=>{
                            NavigationHelper.push('Scanner');
                        }}
                        >
                        <Text style={{color:gColors.bgColorF,fontSize:gFont.size16}}>扫描</Text>
                    </TouchableOpacity>
                }/>
                <ScrollableTabView
                    style={{}}
                    renderTabBar={() =>
                        <DefaultTabBar
                            textStyle={{marginLeft: 5,fontSize:18}}
                            style={{backgroundColor:'white',paddingTop:8}}
                            activeTextColor={Theme.primaryColor}
                            inactiveTextColor={'#999'}
                            underlineStyle={{backgroundColor:gColors.themeColor,width:60,borderRadius:2,alignSelf:'center'}}
                        />}
                    tabBarBackgroundColor="#FFFFFF"
                    tabBarTextStyle={{fontSize: 18}}>
                    <AppList tabLabel={'全部'} dataList={this.state.dataList}
                             onRefresh={this.loadData}
                             loadDataResult={this.state.loadDataResult}/>
                    <AppList tabLabel={'收藏'} dataList={this.state.dataList}
                             onRefresh={this.loadData}
                             loadDataResult={this.state.loadDataResult}/>
                </ScrollableTabView>
            </View>
        );
    }
}
