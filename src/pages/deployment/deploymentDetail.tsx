import React, {PureComponent} from "react";
import {Clipboard, ScrollView, View} from "react-native";
import {Styles} from "../../common/styles";
import {packageModel} from "../../api/home";
import {Alert, Button, ListRow} from '@yz1311/teaset';
import moment from "moment";
import YZPicker from "../../components/YZPicker";
import {Api} from "../../api";
import {modifyPackageModel} from "../../api/release";
import ToastUtils from "../../utils/toastUtils";

export interface IProps {
    item: packageModel,
    appName: string,
    deploymentName: string,
}

export interface IState {
    appVersion: string,
    description: string,
    isMandatory: '1' | '0',
    isDisabled: '1' | '0',
}

export default class DeploymentDetail extends PureComponent<IProps,IState>{
    static navigationOptions = ()=>{
        return {
            headerTitle: '下发详情'
        };
    }

    constructor(props:IProps) {
        super(props);
        this.state = {
            appVersion: props.item.appVersion,
            description: props.item.description,
            isMandatory: props.item.isMandatory?'1':'0',
            isDisabled: props.item.isMandatory?'1':'0',
        };
    }

    private isMandatoryModal:YZPicker;
    private isDisabledModal:YZPicker;


    submit= async (params:Partial<IState>)=>{
        ToastUtils.showLoading();
        //都是单一属性更新
        let packageInfo = {} as any;
        for(let key in params) {
            if(key=='isMandatory' || key=='isDisabled') {
                packageInfo[key] = params[key]=='1';
            } else {
                packageInfo[key] = params[key];
            }
        }
        try {
            let response = await Api.release.modifyRelease({
                request: {
                    appName: this.props.appName,
                    deploymentName: this.props.deploymentName,
                    packageInfo: {
                        label: this.props.item.label,
                        ...packageInfo
                    }
                }
            });
            //更新本地数据
            this.setState(params as any);
            if(params.appVersion!=undefined) {
                NavigationHelper.goBack();
            }
            //Todo:更新列表中的数据
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    rollback = async ()=>{
        ToastUtils.showLoading();
        try {
            let response = await Api.release.rollbackRelease({
                request: {
                    appName: this.props.appName,
                    deploymentName: this.props.deploymentName,
                    label: this.props.item.label
                }
            });
            ToastUtils.showToast('回滚成功!');
        } catch (e) {

        } finally {
            ToastUtils.hideLoading();
        }
    }

    render () {
        const {item} = this.props;
        return (
            <View style={[Styles.container]}>
                <ScrollView style={[Styles.container]}>
                    <ListRow
                        title={'App版本号'}
                        detail={this.state.appVersion}
                        onPress={()=>{
                            NavigationHelper.navigate('ModifyName', {
                                title: 'App版本号',
                                value: this.state.appVersion,
                                onSubmit: (value) => {
                                    this.submit({appVersion: value as any})
                                }
                            });
                        }}
                        />
                    <ListRow
                        title={'版本号'}
                        detail={item.label}
                        />
                    <ListRow
                        title={'bundle下载地址'}
                        detailMultiLine={true}
                        detail={item.blobUrl}
                        onPress={()=>{
                            Clipboard.setString(item.blobUrl);
                            ToastUtils.showToast('已复制');
                        }}
                    />
                    <ListRow
                        title={'描述'}
                        detailMultiLine={true}
                        detail={this.state.description}
                    />
                    <ListRow
                        title={'是否禁用'}
                        detail={this.state.isDisabled=='1'?'是':'否'}
                        onPress={()=>{
                            this.isDisabledModal.open();
                        }}
                    />
                    <ListRow
                        title={'是否强制更新'}
                        detail={this.state.isMandatory=='1'?'是':'否'}
                        onPress={()=>{
                            this.isMandatoryModal.open();
                        }}
                    />
                    <ListRow
                        title={'Hash值'}
                        detailMultiLine={true}
                        detail={item.packageHash}
                    />
                    <ListRow
                        title={'发布方式'}
                        detail={item.releaseMethod}
                    />
                    <ListRow
                        title={'发布人'}
                        detail={item.releasedBy}
                    />
                    <ListRow
                        title={'大小'}
                        detail={item.size}
                    />
                    <ListRow
                        title={'发布时间'}
                        detail={moment(item.uploadTime).format('YYYY-MM-DD HH:mm:ss')}
                    />
                </ScrollView>
                {/*Todo:对按钮进行条件限制*/}
                <Button style={{width:gScreen.width*0.8,alignSelf:'center',marginVertical:15}}
                        type={'primary'}
                        title={'回滚'}
                        onPress={()=>{
                            Alert.alert('警告','是否回滚至该版本?',[{
                                text: '取消'
                            }, {
                                text: '回滚',
                                onPress: this.rollback
                            }])
                        }}
                >

                </Button>
                <YZPicker
                    ref={ref=>this.isDisabledModal = ref}
                    height={300}
                    pickerTitleText={'是否禁用'}
                    pickerData={[
                        {
                            id: '1',
                            title: '是'
                        },
                        {
                            id: '0',
                            title: '否'
                        }
                    ]}
                    selectedValue={this.state.isDisabled}
                    onPickerConfirm={(data)=>{
                        this.submit({isDisabled: data as any})
                    }}
                />
                <YZPicker
                    ref={ref=>this.isMandatoryModal = ref}
                    height={300}
                    pickerTitleText={'是否强制更新'}
                    pickerData={[
                        {
                            id: '1',
                            title: '是'
                        },
                        {
                            id: '0',
                            title: '否'
                        }
                    ]}
                    selectedValue={this.state.isMandatory}
                    onPickerConfirm={(data)=>{
                        this.submit({isMandatory: data as any})
                    }}
                />
            </View>
        );
    }
}
