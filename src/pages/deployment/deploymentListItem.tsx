import React, {FC, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CardView from 'react-native-cardview';
import {packageModel} from "../../api/home";
import moment from "moment";
import AntDesign from 'react-native-vector-icons/AntDesign';
import StringUtils from "../../utils/stringUtils";
import {getDeploymentsMetricsModel} from "../../api/deployment";
import {Styles} from "../../common/styles";
import {ReleaseMethods} from "../../api/release";


export interface IProps {
    item: packageModel,
    appName: string,
    deploymentName: string
    metrics: Partial<getDeploymentsMetricsModel>,
}


function DeploymentListItem (props:IProps) {
    const {item} = props;
    const [jsonDescModel,setJsonDescModel] = useState(false);
    //package可能为空的，因为可能是patch操作
    let metric = props.metrics[item.label];

    let parsedDesc = null;
    //尝试将desc转换为json对象
    try {
        parsedDesc = JSON.parse(item.description);
    } catch (e) {

    }

    const onPress=()=>{
        NavigationHelper.navigate('DeploymentDetail', {
            appName: props.appName,
            deploymentName: props.deploymentName,
            item: props.item
        });
    }
    let releaseSource = '';
    if(item.releaseMethod == ReleaseMethods.RELEAS_EMETHOD_PROMOTE) {
        releaseSource = `Promoted ${item.originalLabel} from "${item.originalDeployment}"`;
    } else if(item.releaseMethod == ReleaseMethods.RELEAS_EMETHOD_ROLLBACK) {
        let labelNumber: number = parseInt(item.label.substring(1));
        let lastLabel: string = "v" + (labelNumber - 1);
        releaseSource = `回滚: ${lastLabel} -> ${item.originalLabel}`;
    }
    let numPending:number = 0;
    if(metric) {
        numPending = metric.downloaded - metric.installed - metric.failed;
    }
    return (
        <CardView
            style={{marginHorizontal:gScreen.width*0.02,backgroundColor:'white'}}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TouchableOpacity
                onPress={onPress}
                style={{minHeight:100,flexDirection:'row',backgroundColor:'white',borderRadius:6,paddingVertical:10,paddingHorizontal:10}}>
                <View style={{flex:1}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                            <Text style={{fontSize:gFont.size18,color:gColors.themeColor,fontWeight:'bold'}}>{item?.label}</Text>
                            {item.releaseMethod == ReleaseMethods.RELEAS_EMETHOD_ROLLBACK ?
                                <Text style={{fontSize: gFont.size15, color: gColors.colorRed,marginLeft:6}}>{`(${releaseSource})`}</Text>
                                :
                                null
                            }
                            <Text style={{fontSize:gFont.size16,color:gColors.color666,marginLeft:8}}>{'v'+item?.appVersion}</Text>
                        </View>
                        <Text style={{color:gColors.colorRed,fontSize:gFont.size14}}>{item.isMandatory?'强制更新':''}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity
                            onPress={()=>{
                                if(jsonDescModel) {
                                    setJsonDescModel(false);
                                } else {
                                    if (parsedDesc != null) {
                                        setJsonDescModel(true);
                                    } else {
                                        onPress();
                                    }
                                }
                            }}
                            style={{flexDirection:'column',flex:1,paddingVertical:20,
                            borderColor:gColors.borderColorE5}}>
                            {jsonDescModel ?
                                <View
                                    style={{}}
                                    >
                                    {
                                        Object.keys(parsedDesc).map((x, index) => {
                                            return (
                                                <View key={index} style={{flexDirection: 'row'}}>
                                                    <Text style={{fontSize:gFont.size14, color: gColors.color0}}>{x+': '}</Text>
                                                    <Text style={{flex:1,fontSize:gFont.size14, color: gColors.color7}}>{parsedDesc[x]+''}</Text>
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                                :
                                <Text style={{fontSize: gFont.size14, color: gColors.color7}} >{item?.description}</Text>
                            }
                        </TouchableOpacity>
                        {/*{metric ?*/}
                        {/*    <View style={{alignItems:'center',marginLeft:8,justifyContent:'center'}}>*/}
                        {/*        /!*<AnimatedCircularProgress*!/*/}
                        {/*        /!*    size={80}*!/*/}
                        {/*        /!*    width={10}*!/*/}
                        {/*        /!*    fill={metric.active/metric.downloaded}*!/*/}
                        {/*        /!*    tintColor="#00e0ff"*!/*/}
                        {/*        /!*    onAnimationComplete={() => console.log('onAnimationComplete')}*!/*/}
                        {/*        /!*    backgroundColor="#3d5875"/>*!/*/}
                        {/*        <Text style={[styles.progressItem,{color:gColors.colorGreen1}]}><Text style={[styles.progressItemTitle]}>已激活:</Text>  {metric.active}</Text>*/}
                        {/*        <Text style={[styles.progressItem]}><Text style={[styles.progressItemTitle]}>已下载:</Text>  {metric.downloaded}</Text>*/}
                        {/*        <Text style={[styles.progressItem]}><Text style={[styles.progressItemTitle]}>已安装:</Text>  {metric.installed}</Text>*/}
                        {/*        <Text style={[styles.progressItem]}><Text style={[styles.progressItemTitle]}>正展开:</Text>  {numPending}</Text>*/}
                        {/*        {metric.failed>0?*/}
                        {/*            <Text style={[styles.progressItem,{color:gColors.colorRed}]}><Text style={[styles.progressItemTitle]}>回滚:</Text>  {metric.failed}</Text>:null}*/}
                        {/*    </View>*/}
                        {/*    :*/}
                        {/*    null*/}
                        {/*}*/}
                    </View>
                    {metric ?
                        <View style={{flexDirection: "row"}}>
                            <DotItem title={'已下载'} leftLine={false} desc={metric.downloaded}/>
                            <DotItem title={'已安装'}  desc={metric.installed}/>
                            <DotItem title={'正在展开'} desc={numPending as any}/>
                            <DotItem title={'已激活'} rightLine={false} dotColor={gColors.colorGreen1} desc={metric.active+(metric.failed>0?('(回滚:'+metric.failed+')'):'')}/>
                        </View>
                        :
                        null
                    }
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <AntDesign name={'clockcircleo'} size={13} color={gColors.color333}/>
                            <Text style={{color:gColors.color333,fontSize:gFont.size13,marginLeft:5}}>{StringUtils.formatDate(moment(item.uploadTime).format('YYYY-MM-DD HH:mm'))}</Text>
                        </View>
                        <Text style={{color:gColors.color333,fontSize:gFont.size13}}>包大小:&nbsp;&nbsp;
                            <Text>{(item.size / 1024 / 1024).toFixed(1) + 'MB'}</Text>
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        </CardView>
    );
}


const DotItem:FC<{leftLine?:boolean,rightLine?:boolean,title:string,dotColor?:string,desc: string}> = ({leftLine=true,rightLine=true,
                                                                                                          title,dotColor,desc})=>{
    return (
        <View style={{alignItems:'center'}}>
            <Text style={{marginBottom:15,color:dotColor}}>{desc}</Text>
            <View style={{width: gScreen.width*0.9/4,alignItems:"center",flexDirection:"row"}}>
                <View style={{flex:1,backgroundColor:gColors.borderColor,height:leftLine?1:0}}></View>
                <View
                    style={{backgroundColor:dotColor || gColors.color999,width:8,height:8,borderRadius:4}}
                />
                <View style={{flex:1,backgroundColor:gColors.borderColor,height:rightLine?1:0}}></View>
            </View>
            <Text style={{fontSize:gFont.size13,color:dotColor,marginTop:15}}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    progressItem: {
        fontSize:gFont.size14,
        color:gColors.color333,
        marginTop:5
    },
    progressItemTitle: {
        width:40,
        textAlign:'right',
    }
})

const MemorizedDeploymentListItem = React.memo(DeploymentListItem);

export default MemorizedDeploymentListItem
