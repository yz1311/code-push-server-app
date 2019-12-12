



import React, {PureComponent} from "react";
import {FlatList, RefreshControl, StyleSheet, View, Clipboard} from "react-native";
import {Styles} from "../../common/styles";
import {Alert, ListRow, NavigationBar, Overlay} from "@yz1311/teaset";
import YZStateCommonView from "../../components/YZStateCommonView";
import YZFlatList from "../../components/YZFlatList";
import MemorizedAccessKeyListItem from "./accessKeyListItem";
import {parsedCollaboratorsModel} from "../../api/home";
import {Api} from "../../api";
import RequestUtils, {createReducerResult, dataToReducerResult, ReducerResult} from "../../utils/requestUtils";
import {accessKeyModel} from "../../api/accessKey";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ToastUtils from "../../utils/toastUtils";
import AddAccessKey from "./addAccessKey";
import {connect} from "react-redux";
import {ReduxState} from "../../models";
import {userInfoModel} from "../../api/login";




export interface IProps {
    userInfo?: userInfoModel
}

export interface IState {
    dataList: Array<accessKeyModel>,
    loadDataResult: ReducerResult,
}

@(connect((state:ReduxState)=>({
    userInfo: state.loginIndex.userInfo
})) as any)
export default class AccessKeyIndex extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            headerTitle: 'Access Keys'
        };
    }

    readonly state:IState = {
        dataList: [],
        loadDataResult: createReducerResult(),
    };

    componentDidMount(): void {
        this.loadData();
    }

    loadData = async ()=> {
        try {
            let response = await Api.accessKey.getAccessKeys({
                request: {

                }
            });
            let dataList = response.data.accessKeys || [];
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

    showAddModal = async ()=>{
        let overlayView = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center'}}
                modal={false}
                animated
                autoKeyboardInsets={true}
                overlayOpacity={0.3}
            >
                <View style={{backgroundColor:'white',width:gScreen.width*0.9,paddingHorizontal:10,paddingTop:15,borderRadius:6}}>
                    <AddAccessKey onSuccess={(item)=>{
                        //刷新列表
                        this.loadData();
                        Clipboard.setString(item.name);
                        //弹出新的对话框
                        Alert.alert('','添加成功!\nAccess Key:\n'+item.name+'\n已复制到剪切板',[{
                            text: '知道了'
                        }]);
                    }} closeModal={()=>{
                        Overlay.hide(overlayKey);
                    }} userInfo={this.props.userInfo}/>
                </View>
            </Overlay.PopView>
        );
        let overlayKey = Overlay.show(overlayView);
    }

    render () {
        const {loadDataResult, dataList} = this.state;
        return (
            <View style={[Styles.container]}>
                <YZStateCommonView loadDataResult={loadDataResult} errorButtonAction={()=>this.loadData()}>
                    <View style={[Styles.container]}>
                        <YZFlatList
                            renderItem={(data)=>(<MemorizedAccessKeyListItem
                                {...data}
                                onDeleteSuccess={()=>{
                                    this.loadData();
                                }}
                            />)}
                            data={dataList}
                            loadData={this.loadData}
                            loadDataResult={loadDataResult}
                            noMore={true}
                            ListHeaderComponent={<View style={{height:10}}/>}
                            ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: 'transparent' }}/>}
                        />
                    </View>
                </YZStateCommonView>
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#9b59b6' title="新增" onPress={() => this.showAddModal()}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
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
