import React, {Component, PureComponent} from "react";
import {DeviceEventEmitter, EmitterSubscription, StyleSheet, View} from "react-native";
import {Styles} from "../../common/styles";
import ScrollableTabView,{DefaultTabBar, ScrollableTabBar} from '@yz1311/react-native-scrollable-tab-view';
import {NavigationBar, Theme} from "@yz1311/teaset";
import DeploymentList from "./deploymentList";
import {productModel} from "../../api/home";
import deploymentList from "./deploymentList";
import index from "../../models";
import AppBasicInfo from "../app/appBasicInfo";
import {deploymentModel} from "../../api/deployment";

export interface IProps {
    appName: string,
    item: productModel
}

export interface IState {
    item: productModel,
    deployments: Array<string>
}

export default class DeploymentIndex extends Component<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            header: null
        };
    }

    constructor(props:IProps) {
        super(props);
        this.state = {
            item: props.item,
            deployments: props.item.deployments
        };
    }

    private updateNameListener:EmitterSubscription;
    private updateDeploymentListener:EmitterSubscription;

    componentDidMount(): void {
        this.updateNameListener = DeviceEventEmitter.addListener('update_app_name',({appName, name})=>{
            if(this.props.appName == appName) {
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

    render () {
        const {item} = this.props;
        return (
            <View style={[Styles.container]}>
                <NavigationBar style={{position:'relative'}} title={this.state.item.name}/>
                <ScrollableTabView
                    style={{}}
                    renderTabBar={() =>
                        <ScrollableTabBar
                            textStyle={{marginLeft: 5,fontSize:18}}
                            style={{backgroundColor:'white',marginBottom:10}}
                            activeTextColor={Theme.primaryColor}
                            inactiveTextColor={'#999'}
                            underlineStyle={{backgroundColor:gColors.themeColor,width:50,alignSelf:'center',borderRadius:2}}
                           />}
                    tabBarBackgroundColor="#FFFFFF"
                    tabBarTextStyle={{fontSize: 18}}>
                    <AppBasicInfo key={-1} tabLabel={'基础信息'} appName={this.props.appName} item={this.props.item}/>
                    {
                        this.state.deployments.map((deployment,index)=>{
                            return (
                                <DeploymentList key={index} tabLabel={deployment} appName={this.props.appName} deploymentName={deployment}/>
                            );
                        })
                    }
                </ScrollableTabView>
            </View>
        );
    }
}
