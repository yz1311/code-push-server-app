/**
 * cascade级联日期选择器(前一个选择后，后面一个会被清除掉)
 */
/**
 * startMinDate默认为当前用户的创建时间
 * endMinDate默认为startDate
 */
import React, {Component,PureComponent} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Animated,
    AppState,
    Text,
    View,
    Image,
    Alert,
    Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import {DatePickerView as DatePicker} from '@yz1311/teaset';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ToastUtils from '../utils/toastUtils';

interface IProps {
    validate?: any,
    onNavigateBack?: any,
    onValueChange?: any,
    onlyFinishTrigger?: any,
    pickerProps?: any,
    errorMessage?: any,
    startDate?: any,
    endDate?: any,
    topErrorMessage?: any,
    startMinDate?: any,
    startMaxDate?: any,
    endMinDate?: any,
    endMaxDate?: any,
    isShowtextView?: boolean,
    style?: any
}

export default class YZStartEndDateView extends PureComponent<IProps,any>{

    static propTypes = {
        //验证选择的时间段是否合法，返回包含结果和信息的对象
        validate:PropTypes.func,
        //将加过返回到上一级,必须
        onNavigateBack:PropTypes.func,
        //数据发生变化
        onValueChange:PropTypes.func.isRequired,
        //是否只在startTime和endTime都选中的情况下才触发onValueChange
        onlyFinishTrigger:PropTypes.bool.isRequired,
        pickerProps:PropTypes.object,
        errorMessage:PropTypes.string,
        startDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        endDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        //在删除按钮左边显示错误信息，主要用于modal显示
        topErrorMessage:PropTypes.bool,
        startMinDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        startMaxDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        endMinDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
        endMaxDate:PropTypes.oneOfType([PropTypes.instanceOf(Date),PropTypes.string]),
    };

    static defaultProps = {
        ////不能这样，初始化时,gUserData.create_datetime为空
        // startMinDate:moment(gUserData.create_datetime).toDate(),
        startMaxDate:moment().add(-1,'days').toDate(),
        ////不能这样，初始化时,gUserData.create_datetime为空
        // endMinDate:moment(gUserData.create_datetime).toDate(),
        endMaxDate:moment().add(-1,'days').toDate(),
        onlyFinishTrigger:true
    };


    constructor(props)
    {
        super(props);
        this.state={
            //0表示都没选中，1表示开始时间选中，2表示结束时间选中
            activeIndex:1,
            //都是索引号为0，代表值'0'
            startDate:props.startDate||null,
            endDate:props.endDate||null,
            selectedYear2:'',
            selectedMonth2:'',
            status:true
        };
    }

    componentDidMount()
    {
        //用户还原初始数据后，刷新'保存'按钮的状态
        this.onValueChange();
    }

    render(){
        const {startMinDate,startMaxDate,endMinDate,endMaxDate} = this.props;

        return(
            <View style={[{},this.props.style]}>
                <View style={{flexDirection:'row',paddingHorizontal:8,alignItems:'center',marginTop:18}}>
                    <TimeBaseView style={{flex:1}} index={1} activeIndex={this.state.activeIndex} onPress={this.timeClick} date={this.state.startDate}/>
                    <Text style={{marginHorizontal:6,color:gColors.color666}}>至</Text>
                    <TimeBaseView style={{flex:1}} index={2} activeIndex={this.state.activeIndex} onPress={this.timeClick} date={this.state.endDate}/>
                </View>
                <View style={{height:40,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    {this.props.topErrorMessage&&
                    <Text style={{alignSelf:'center',color:gColors.colorRed,fontSize:gFont.size14,marginLeft:10}}>{this.props.errorMessage}</Text>}
                    <TouchableOpacity
                        activeOpacity={activeOpacity}
                        onPress={()=>this.timeClick(0)}
                    >
                        <EvilIcons name="trash" color={gColors.color666} size={28} />
                    </TouchableOpacity>
                </View>
                <View style={{minHeight:220}}>
                    {this.state.activeIndex!=0?
                        <View
                            style={{height:gScreen.onePix,backgroundColor:gColors.bgcolord9,marginVertical:10}}
                        />:null}
                    {this.state.activeIndex==1?
                        <View style={{flexDirection:'row',paddingHorizontal:8}}>
                            <DatePicker
                                style={[localStyles.picker]}
                                pickerStyle={[localStyles.picker,{marginLeft:20}]}
                                minDate={startMinDate||moment(gUserData.create_datetime).toDate()}
                                maxDate={startMaxDate}
                                date={this.state.startDate||new Date()}
                                onDateChange={(date)=>{
                                    this.setState({
                                        startDate:date
                                    },this.onValueChange);
                                }}
                                {...this.props.pickerProps}
                            />
                        </View>:null}
                    {this.state.activeIndex==2?
                        <View style={{flexDirection:'row',paddingHorizontal:8}}>
                            <DatePicker
                                style={[localStyles.picker]}
                                pickerStyle={[localStyles.picker,{marginLeft:20}]}
                                minDate={this.state.startDate||endMinDate}
                                maxDate={endMaxDate}
                                date={this.state.endDate||new Date()}
                                onDateChange={(date)=>{
                                    this.setState({
                                        endDate:date
                                    },this.onValueChange);
                                }}
                                {...this.props.pickerProps}
                            />
                        </View>:null}
                </View>
                <View
                    style={{height:gScreen.onePix,backgroundColor:gColors.bgcolord9,marginTop:40}}
                />
                <Text style={{alignSelf:'center',color:gColors.colorRed,fontSize:gFont.size14,marginTop:8}}>{this.props.errorMessage}</Text>
                {
                    this.props.isShowtextView?
                        <View style={{marginTop:20,flex:1,backgroundColor:gColors.backgroundColor}}>
                            <View style={{backgroundColor:gColors.backgroundColor,width:gScreen.width,height:40,flexDirection:'column',justifyContent:'center'}}>
                                <Text style={{marginLeft:10,fontSize:gFont.size12}}>功能设置</Text>
                            </View>
                            <SwitchView title={'营业时间小于套餐时间时，无法购买'}
                                        value={this.state.status}
                                        onValueChange={()=>this.setState({status:!this.state.status})}
                                        isInfo={true}
                                        onPress ={()=>{this.showInfo(
                                            `为防止营业时间结束机器自动关机导致用户消费异常，套餐消费时间需大于营业剩余时间，否则暂停购买！营业时间结束一小时后，系统重新恢复购买`
                                        );}}/>
                        </View>
                        :null
                }
            </View>
        );
    }

    timeClick=(index)=>{
        if(this.state.activeIndex==index)
        {
            return;
        }
        switch (index)
        {
            //清空
            case 0:
                this.setState({
                    activeIndex:0,
                    startDate:null,
                    endDate:null
                },()=>this.onValueChange());
                break;
            //开始时间
            case 1:
                if(!this.state.startDate)
                    this.setState({
                        activeIndex:1,
                        startDate:this.props.startDate||moment().add(-1,'days').toDate(),
                    },()=>this.onValueChange());
                else
                {
                    this.setState({
                        activeIndex:1,
                    });
                }
                break;
            //结束时间
            case 2:
                if(this.state.activeIndex === 0)
                {
                    ToastUtils.showToast('请先选择开始日期');
                    return;
                }
                //如果结束时间没选择过,则结束时间拷贝开始时间
                if(!this.state.endDate)
                {
                    this.setState({
                        activeIndex:2,
                        endDate:this.props.endDate||null
                    },()=>this.onValueChange());
                }
                else
                {
                    this.setState({
                        activeIndex:2
                    });
                }
                break;
        }
    }


    onValueChange = ()=>{
        //即使为空，也要传递过去，因为父组件可能需要验证数据
        // if(isNull(this.state.selectedYear1)||isNull(this.state.selectedMonth1)||isNull(this.state.selectedYear2)||isNull(this.state.selectedMonth2))
        // {
        //     return;
        // }
        const {onValueChange,onlyFinishTrigger} = this.props;
        if(onValueChange)
        {
            if(onlyFinishTrigger)
            {
                if(isNull(this.state.startDate)||isNull(this.state.endDate))
                {
                    //说明当前的数据是不全的
                    onValueChange('','');
                }
                else {
                    onValueChange(moment(this.state.startDate),
                        moment(this.state.endDate)
                    );
                }
            }
            else
            {
                if(isNull(this.state.startDate)&&isNull(this.state.endDate))
                {
                    onValueChange('','');
                }
                else{
                    const toStartTime = isNull(this.state.startDate)?'':moment(this.state.startDate);
                    const toEndTime = isNull(this.state.endDate)?'':moment(this.state.endDate);
                    onValueChange(toStartTime,toEndTime);
                }
            }
        }
    }
    showInfo = (text) => {
        Alert.alert(
            ``,
            text,
            [{text:'确定',onPress:()=>console.log('取消')}],
            { cancelable: false }
        );
    }


}


const isNull = (value)=>{
    if(value===null||value===undefined||value===''||isNaN(value))
    {
        return true;
    }
    return false;
};


const TimeBaseView = ({style,index,activeIndex,onPress,date})=>{
    let title ;
    switch (index)
    {
        case 1:
            title='开始时间';
            break;
        case 2:
            title='结束时间';
            break;
    }
    if(date&&date!=':')
    {
        title = moment(date).format('YYYY-MM-DD');
    }
    else
    {

    }
    let color;
    //选中
    if(activeIndex==index)
    {
        color = gColors.themeColor;
    }
    else
    {
        color = gColors.color999;
    }
    return(
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={()=>onPress(index)}
            style={[style]}
        >
            <View style={{alignItems:'center'}}>
                {/*因为汉字和数字的高度不一样，所以设置一个固定的高度*/}
                <Text style={{fontSize:gFont.size16,color:color,height:gFont.size19}}>{title}</Text>
                <View style={{height:gScreen.onePix,backgroundColor:color,marginTop:10,alignSelf:'stretch'}}/>
            </View>
        </TouchableOpacity>
    );
};

const SwitchView =({title,onValueChange,value,isInfo,onPress})=>{
    return(
        <View style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection:'row',
            height:50,
            width:gScreen.width,
            backgroundColor:gColors.bgColorF,
            borderBottomWidth: gScreen.onePix,
            borderTopWidth: gScreen.onePix,
            borderColor:gColors.borderColor,
            paddingHorizontal:gMargin}}>
            <View style={{flexDirection:'row',width:gScreen.width-50}}>
                <Text style={{color:gColors.color333,fontSize:gFont.size15}}>{title}</Text>
                {isInfo?
                    <TouchableOpacity onPress={()=>onPress()}>
                        <Text style={{
                            width:16,
                            height:16,
                            borderRadius:8,
                            borderColor:gColors.themeColor,
                            borderWidth:gScreen.onePix,
                            marginLeft:5,
                            textAlign:'center',
                            color:gColors.themeColor,
                            fontSize:gFont.size12}}>?</Text>
                    </TouchableOpacity>:null}
            </View>
            <View style={{width:50}}>
                <Switch
                    value = {value}
                    onValueChange = {()=>onValueChange()}
                />
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    picker:{
        flex:1,
        // width: 150,
        height: 180,
    },
});
