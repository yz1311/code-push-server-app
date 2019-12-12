/**
 * 热更新列表
 */
import React,{PureComponent} from "react";
import {FlatList, InteractionManager, RefreshControl, StyleSheet, View} from "react-native";
import {Styles} from "../../common/styles";
import {Alert, NavigationBar} from "@yz1311/teaset";
import {Api} from "../../api";
import YZStateCommonView from "../../components/YZStateCommonView";
import create = StyleSheet.create;
import RequestUtils, {createReducerResult, dataToReducerResult, ReducerResult} from "../../utils/requestUtils";
import {
    packageModel,
    productModel
} from "../../api/home";
import MemorizedDeploymentListItem from "./deploymentListItem";
import {getDeploymentsMetricsModel} from "../../api/deployment";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import ToastUtils from "../../utils/toastUtils";
import YZFlatList from "../../components/YZFlatList";

export interface IProps {
    appName: string,
    deploymentName: string,
    tabLabel: string
}

export interface IState {
    dataList: Array<packageModel>,
    metrics: Partial<getDeploymentsMetricsModel>,
    loadDataResult: ReducerResult
}

export default class DeploymentList extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            header: null
        };
    }

    static defaultProps = {
        deploymentName: 'Production'
    };

    readonly state:IState = {
        dataList: [],
        metrics: {},
        loadDataResult: createReducerResult()
    };

    componentDidMount(): void {
        InteractionManager.runAfterInteractions(()=>{
            this.loadData();
        });
    }

    loadData = async ()=> {
        this.getDeploymentsMetrics();
        try {
            let response = await Api.deployment.getDeploymentsHistory({
                request: {
                    appName: this.props.appName,
                    deploymentName: this.props.deploymentName
                }
            });
            this.setState({
                loadDataResult: dataToReducerResult(response.data.history || []),
                dataList: response.data.history || []
            });
        } catch (e) {
            this.setState({
                loadDataResult: dataToReducerResult(e)
            });
        } finally {

        }
    }

    getDeploymentsMetrics = async ()=>{
        try {
            let response = await Api.deployment.getDeploymentsMetrics({
                request: {
                    appName: this.props.appName,
                    deploymentName: this.props.deploymentName
                }
            });
            this.setState({
                metrics: response.data.metrics||{}
            });
        } catch (e) {

        } finally {

        }
    }

    rollback = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.release.rollbackRelease({
                request: {
                    appName: this.props.appName,
                    deploymentName: this.props.deploymentName,
                }
            });
            ToastUtils.showToast('回滚成功!');
            this.loadData();
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    clearAll = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.deployment.deleteDeploymentsHistory({
                request: {
                    appName: this.props.appName,
                    deploymentName: this.props.deploymentName,
                }
            });
            ToastUtils.showToast('清空成功!');
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
                <YZStateCommonView loadDataResult={loadDataResult} errorButtonAction={()=>this.loadData()}>
                    <View style={[Styles.container]}>
                        <YZFlatList
                            renderItem={(data)=>(<MemorizedDeploymentListItem
                                {...data}
                                appName={this.props.appName}
                                deploymentName={this.props.deploymentName}
                                metrics={this.state.metrics}/>)}
                            data={dataList}
                            loadData={this.loadData}
                            loadDataResult={loadDataResult}
                            noMore={false}
                            ListHeaderComponent={<View style={{height:10}}/>}
                            ListFooterComponent={()=><View style={{height:20}}/>}
                            refreshControl={<RefreshControl refreshing={false} onRefresh={this.loadData}/>}
                            ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: 'transparent' }}/>}
                        />
                    </View>
                </YZStateCommonView>
                {dataList.length > 0 ?
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item key={0} buttonColor='#9b59b6' title="回滚" onPress={() => {
                            Alert.alert('警告', '是否回滚(将会找最近可回滚的包进行回滚操作)?', [{
                                text: '取消'
                            }, {
                                text: '回滚',
                                onPress: this.rollback
                            }])
                        }}>
                            <Icon name="md-create" style={styles.actionButtonIcon}/>
                        </ActionButton.Item>,
                        <ActionButton.Item key={1} buttonColor='#9b59b6' title="清空" onPress={() => {
                            Alert.alert('警告', '是否清空(将会清空所有的发布历史)?', [{
                                text: '取消'
                            }, {
                                text: '清空',
                                onPress: this.clearAll
                            }])
                        }}>
                            <Icon name="md-create" style={styles.actionButtonIcon}/>
                        </ActionButton.Item>
                    </ActionButton>
                    :
                    null
                }
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
