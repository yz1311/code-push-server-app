/**
 * 热更新列表
 */
import React,{PureComponent} from "react";
import {
    Clipboard, DeviceEventEmitter,
    EmitterSubscription,
    FlatList,
    InteractionManager,
    RefreshControl,
    StyleSheet,
    View
} from "react-native";
import {Styles} from "../../common/styles";
import {Alert, ListRow, NavigationBar, Overlay} from "@yz1311/teaset";
import {Api} from "../../api";
import YZStateCommonView from "../../components/YZStateCommonView";
import create = StyleSheet.create;
import RequestUtils, {createReducerResult, dataToReducerResult, ReducerResult} from "../../utils/requestUtils";
import {
    packageModel,
    productModel
} from "../../api/home";
import MemorizedDeploymentListItem from "./deploymentListItem";
import {deploymentModel, getDeploymentsMetricsModel} from "../../api/deployment";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import ToastUtils from "../../utils/toastUtils";
import AddAccessKey from "../accessKey/addAccessKey";
import ForwardAddInputContainer from "../common/addInputContainer";
import MemorizedDeploymentTypeListItem from './deploymentTypeListItem';

export interface IProps {
    appName: string,
    deploymentName: string,
    tabLabel: string
}

export interface IState {
    dataList: Array<deploymentModel>,
    loadDataResult: ReducerResult
}

export default class DeploymentTypeList extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            headerShown: false
        };
    }

    static defaultProps = {
        deploymentName: 'Production'
    };

    private addInputContainerRef:any;
    private reloadListener:EmitterSubscription;

    readonly state:IState = {
        dataList: [],
        loadDataResult: createReducerResult()
    };

    componentDidMount(): void {
        InteractionManager.runAfterInteractions(()=>{
            this.loadData();
        });
        this.reloadListener = DeviceEventEmitter.addListener('reload_deployment_type_list',this.loadData);
    }

    componentWillUnmount(): void {
        this.reloadListener&&this.reloadListener.remove();
    }

    loadData = async ()=> {
        try {
            let response = await Api.deployment.getDeployments({
                request: {
                    appName: this.props.appName,
                }
            });
            let dataList = response.data.deployments || [];
            this.setState({
                loadDataResult: dataToReducerResult(dataList),
                dataList: dataList
            });
            //更新app列表和详情中的数据
            DeviceEventEmitter.emit('update_deployment_type_list',{
                dataList,
                appName: this.props.appName
            });
        } catch (e) {
            this.setState({
                loadDataResult: dataToReducerResult(e)
            });
        } finally {

        }
    }

    showAddModal = async ()=>{
        Alert.alert('添加Deployment',(
            <ForwardAddInputContainer ref={ref=>this.addInputContainerRef=ref} placeholder={'请输入'}/>
        ),[{
            text: '取消',
            onPress:()=>{
                Alert.hide();
            }
        }, {
            text: '添加',
            onPress: ()=>{
                let value = this.addInputContainerRef.getValue();
                //校验email
                if(value=='') {
                    ToastUtils.showToast('请输入Deployment名称!');
                    return;
                }
                if(this.state.dataList.some(x=>x.name==value)) {
                    ToastUtils.showToast('名称不能跟现有名称一致，必须唯一!');
                    return;
                }
                this.addDeploymentType(value);
                Alert.hide();
            }
        }],{
            cancelable: true,
            autoClose: false
        });
    }

    addDeploymentType = async (name)=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.deployment.addDeployment({
                request: {
                    appName: this.props.appName,
                    name: name
                }
            });
            ToastUtils.showToast('添加成功');
            //刷新列表
            this.loadData();
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        const {loadDataResult, dataList} = this.state;
        return (
            <View style={[Styles.container]}>
                <NavigationBar style={{position:'relative'}} title={'部署类型'} />
                <YZStateCommonView loadDataResult={loadDataResult} errorButtonAction={()=>this.loadData()}>
                    <View style={[Styles.container]}>
                        <FlatList
                            renderItem={(data)=>(
                                <MemorizedDeploymentTypeListItem item={data.item} appName={this.props.appName}/>
                                )}
                            data={dataList}
                            keyExtractor={(item,index)=>index+''}
                            ListHeaderComponent={<View style={{height:10}}/>}
                            ListFooterComponent={()=><View style={{height:20}}/>}
                            refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadData}/>}
                            ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: 'transparent' }}/>}
                        />
                    </View>
                </YZStateCommonView>
                <ActionButton buttonColor="rgba(231,76,60,1)" onPress={()=>{this.showAddModal();}}>
                </ActionButton>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
