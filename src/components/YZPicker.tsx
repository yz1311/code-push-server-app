import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Animated,
    AppState, BackHandler, View
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import YZPickerHeader from "./YZPickerHeader";
import Picker from "@yz1311/react-native-wheel-picker";
const PickerItem = Picker.Item;

const styles = StyleSheet.create({
    animatedView: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }
});

export interface IProps {
    height: number,
    pickerTitleText: string,
    pickerConfirmBtnText?:string,
    pickerCancelBtnText?:string,
    pickerData: Array<{id:string|number,title:string}>
    closeWhenBackgroundClicked: boolean
}

export interface IState {
    isShow: boolean,
    selectedValue: any,
    pickerData: any,
    opacityAnimatedValue: any,
    onPickerSelect: any,
    onPickerConfirm: any,
    onPickerCancel: any,
    pickerTitleText: string,
    pickerConfirmBtnText: string,
    pickerCancelBtnText: string,
    pickerBg: Array<number>,
    pickerToolBarBg: Array<number>,
    pickerTitleColor: Array<number>,
    pickerToolBarFontSize: number,
    pickerConfirmBtnColor: Array<number>,
    pickerCancelBtnColor: Array<number>,
    tempValue: string
}

export default class YZPicker extends Component<IProps,IState> {

    static defaultProps = {
        height: 400,
        pickerTitleColor: [3, 3, 3, 1],
        pickerConfirmBtnColor: [57, 203, 24, 1],
        pickerCancelBtnColor: [100, 100, 100, 1],
        pickerToolBarBg: [255, 255, 255, 1],
        pickerBg: [255, 255, 255, 1],
        pickerCancelBtnText: "取消",
        pickerConfirmBtnText: "确定",
        pickerToolBarFontSize:parseInt(gFont.size15),
        closeWhenBackgroundClicked:true
    }

    static propTypes = {
        pickerData: PropTypes.array,
        selectedValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        pickerTitleText: PropTypes.string,
        pickerConfirmBtnText: PropTypes.string,
        pickerCancelBtnText: PropTypes.string,
        pickerBg: PropTypes.array,
        pickerToolBarBg: PropTypes.array,
        pickerTitleColor: PropTypes.array,
        pickerToolBarFontSize: PropTypes.number,
        onPickerConfirm: PropTypes.func,
        onPickerCancel: PropTypes.func,
        onPickerSelect: PropTypes.func,
        pickerConfirmBtnColor: PropTypes.array,
        pickerCancelBtnColor: PropTypes.array,
        //是否点击阴影部分关闭modal,默认是true
        closeWhenBackgroundClicked:PropTypes.bool
    }

    private pickerWrapper: any;
    private pickerModal:Modal;

    constructor(props) {
        super(props);

        let initialState = this._checkOutInitialState(props);
        this.state = {
            isShow: false,
            opacityAnimatedValue: new Animated.Value(0),
            tempValue: '',
            ...initialState
        };
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        BackHandler.addEventListener('hardwareBackPress', this._handleHwBackEvent);
    }

    componentWillReceiveProps(nextProps) {
        const {selectedValue, pickerData} = nextProps;
        this.setState({selectedValue, pickerData});
    }

    componentWillUnmount()
    {
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this._handleHwBackEvent);
    }

    _handleHwBackEvent=()=>{
        //默认就是关闭当前modal
        if(this.state.isShow)
        {
            this._onPickerCancel();
            return true;
        }
        return false;
    }

    _handleAppStateChange = appState => {
        // Android下APP从后台重新进入前台时，Picker会自动隐藏，此时将后面遮盖层去掉
        if (appState === 'active' && gScreen.isAndroid) {
            this.state.opacityAnimatedValue.setValue(0);
            this.pickerWrapper && this.setState({isShow: false});
        }
    }

    _checkOutInitialState = props => {
        const {
            pickerData, pickerTitleText, selectedValue,
            pickerConfirmBtnText, pickerCancelBtnText,
            pickerBg, pickerToolBarBg, pickerTitleColor, pickerToolBarFontSize,
            onPickerSelect, onPickerConfirm, onPickerCancel,
            pickerConfirmBtnColor,pickerCancelBtnColor
        } = props;
        return {
            pickerData, pickerTitleText, selectedValue,
            pickerConfirmBtnText, pickerCancelBtnText,
            pickerBg, pickerToolBarBg, pickerTitleColor, pickerToolBarFontSize,
            onPickerSelect, onPickerConfirm, onPickerCancel,
            pickerConfirmBtnColor,pickerCancelBtnColor
        };
    }

    _onPickerSelect = data => {
        this.state.onPickerSelect && this.state.onPickerSelect(data);
    }

    _onPickerConfirm = data => {
        this.hide();
        this.state.onPickerConfirm && this.state.onPickerConfirm(data);
    }

    _onPickerCancel = (data:any = undefined) => {
        this.hide();
        this.state.onPickerCancel && this.state.onPickerCancel(data);
    }

    show = () => {
        this.setState({
            isShow: true
        });
        this.pickerModal.open();
    }

    open = () => {
        this.show();
    }

    close = () => {
        this.hide();
    }

    hide = () => {
        this.setState({
            isShow: true
        });
        this.pickerModal.close();
    }

    render() {
        const {height} = this.props;

        return (
            <Modal
                style={[{height: height}]}
                ref={ref=>this.pickerModal = ref}
                backButtonClose
                swipeToClose={false}
                position="bottom"
                coverScreen={true}
                onClosed={()=>{
                    this.setState({
                        tempValue: this.state.selectedValue
                    });
                }}
                onOpened={()=>{
                    //由于必须要滚动时才能触发选中，所以默认选择第一个
                    if((this.state.selectedValue==undefined || this.state.selectedValue == '')
                        && Array.isArray(this.state.pickerData)
                        && this.state.pickerData.length > 0) {
                        this.setState({
                            tempValue: this.state.pickerData[0].id+''
                        });
                    } else {
                        this.setState({
                            tempValue: this.state.selectedValue
                        });
                    }
                }}>
                <View style={{flex:1}}>
                    <YZPickerHeader
                        title={this.props.pickerTitleText}
                        onPickerCancel={()=>{
                            this._onPickerCancel();
                        }}
                        pickerCancelBtnText={this.props.pickerCancelBtnText}
                        pickerConfirmBtnText={this.props.pickerConfirmBtnText}
                        onPickerConfirm={()=>{
                            this._onPickerConfirm(this.state.tempValue);
                        }}
                    />
                    <Picker
                        style={{height:height-45}}
                        selectedValue={this.state.tempValue}
                        onValueChange={value => this.setState({ tempValue: value+'' })}
                    >
                        {
                            this.props.pickerData.map((value,i)=>(
                                <PickerItem label={value.title} value={value.id} key={value.id+''}/>
                            ))
                        }
                    </Picker>
                </View>
            </Modal>
        );
    }

    isShow=()=>{
        return this.state.isShow;
    }
}
