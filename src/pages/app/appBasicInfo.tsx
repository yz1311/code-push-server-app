import React,{PureComponent} from "react";
import {DeviceEventEmitter, EmitterSubscription, StyleSheet, View, Text} from "react-native";
import {Styles} from "../../common/styles";
import {Alert, ListRow} from '@yz1311/teaset';
import {productModel} from "../../api/home";
import {Api} from "../../api";
import ToastUtils from "../../utils/toastUtils";
import {deploymentModel} from "../../api/deployment";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import ForwardAddInputContainer from "../common/addInputContainer";

export interface IProps {
    appName: string,
    item: productModel,
    tabLabel: string
}

export interface IState {
    item: productModel,
    deployments: Array<string>
}

export default class AppBasicInfo extends PureComponent<IProps,IState>{

    private updateNameListener:EmitterSubscription;
    private updateDeploymentListener:EmitterSubscription;
    private addInputContainerRef:any;

    constructor(props:IProps) {
        super(props);
        this.state = {
            item: props.item,
            deployments: props.item.deployments
        };
    }

    componentDidMount(): void {
        this.updateNameListener = DeviceEventEmitter.addListener('update_app_name',({appName, name})=>{
            if(this.state.item.name == appName) {
                this.setState({
                    item: {
                        ...this.state.item,
                        name: name
                    }
                });
            }
        });
        this.updateDeploymentListener = DeviceEventEmitter.addListener('update_deployment_type_list',({dataList, appName}:{dataList:Array<deploymentModel>,appName:string})=>{
            this.setState({
                deployments: dataList.map(x=>x.name)
            });
        });
    }

    componentWillUnmount(): void {
        this.updateNameListener&&this.updateNameListener.remove();
        this.updateDeploymentListener&&this.updateDeploymentListener.remove();
    }


    modifyName = async (value)=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.home.modifyApp({
                request: {
                    appName: this.state.item.name,
                    name: value
                }
            });
            ToastUtils.showToast('修改成功!');
            DeviceEventEmitter.emit('update_app_name',{appName:this.state.item.name, name: value})
            NavigationHelper.goBack();
        } catch (e) {
            ToastUtils.showToast(e.message || '修改失败!');
        } finally {
            ToastUtils.hideLoading();
        }
    }

    deleteApp = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.home.deleteApp({
                request: {
                    appName: this.props.appName
                }
            });
            ToastUtils.showToast('删除成功!');
            //刷新列表
            DeviceEventEmitter.emit('reload_app_list');
            //返回上一级
            NavigationHelper.goBack();
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    transferApp = async (email)=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.home.transferApp({
                request: {
                    appName: this.props.appName,
                    email: email
                }
            });
            ToastUtils.showToast('转移成功!');
            //刷新列表
            DeviceEventEmitter.emit('reload_app_list');
            //返回上一级
            NavigationHelper.goBack();
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        const {item} = this.props;
        return (
            <View style={[Styles.container]}>
                <ListRow
                    title={'ID'}
                    detail={item.id}
                />
                <ListRow
                    title={'名称'}
                    detail={this.state.item.name}
                    onPress={()=>{
                        NavigationHelper.navigate('ModifyName', {
                            title: 'app名称',
                            value: item.name,
                            maxLength: 30,
                            onSubmit: (value)=>{
                                this.modifyName(value);
                            }
                        });
                    }}
                    />
                <ListRow
                    title={'平台'}
                    detail={item.platform}
                />
                <ListRow
                    title={'系统'}
                    detail={item.os}
                />
                <ListRow
                    title={'部署类型'}
                    detailMultiLine={true}
                    detail={(this.state.deployments||[]).map(x=>x).join('\n')}
                    onPress={()=>{
                        NavigationHelper.push('DeploymentTypeList', {
                            appName: this.props.appName
                        });
                    }}
                />
                <ListRow
                    title={'参与者'}
                    detailMultiLine={true}
                    detail={Object.keys(item.collaborators||{}).map(x=>x).join('\n')}
                    onPress={()=>{
                        NavigationHelper.navigate('CollaboratorList', {
                            appName: item.name
                        });
                    }}
                />
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item key={0} buttonColor={gColors.colorGreen1} title="转移" onPress={() => {
                        Alert.alert('转移App',(
                            <View>
                                <ForwardAddInputContainer ref={ref=>this.addInputContainerRef=ref} placeholder={'请输入邮箱'}/>
                                <Text style={{marginTop:10,fontSize:gFont.size13,color:gColors.colorRed,marginHorizontal:15}}>注意:转移App后，当前用户不在该App的参与者中，需要联系新的管理器进行添加</Text>
                            </View>
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
                                this.transferApp(email);
                                Alert.hide();
                            }
                        }],{
                            cancelable: true,
                            autoClose: false
                        });
                    }}>
                        <Icon name="ios-swap" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item key={0} buttonColor={gColors.colorRed} title="删除" onPress={() => {
                        Alert.alert('提示','是否删除该项?(注意:删除后，该App所关联的所有热更新将会失效，请一定一定谨慎操作)',[{
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
                                            this.deleteApp();
                                        }
                                    }
                                ]);
                            }
                        }])
                    }}>
                        <Icon name="md-trash" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
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
