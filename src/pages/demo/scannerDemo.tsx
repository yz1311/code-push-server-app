import React, {PureComponent} from 'react';
import {TouchableOpacity, View, Text, NativeModules, Platform} from 'react-native';
import Barcode, {BarCodeReadEvent, BarCodeTypes, decodeQR} from '@yz1311/react-native-smart-barcode';
import {Alert, NavigationBar} from '@yz1311/teaset';
import SyanImagePicker, {ImagePickerOption} from 'react-native-syan-image-picker';
import Permissions from 'react-native-permissions';


interface IProps {

}

interface IState {

}

export default class ScannerDemo extends PureComponent<IProps,IState>{

  static navigationOptions = ()=>{
    return {
      header: null
    };
  }

  readonly state:IState = {

  };

  componentDidMount(): void {

  }

  _onBarCodeRead = (e:BarCodeReadEvent)=>{
    console.log(e.nativeEvent.data.code)
  }

  decode = async ()=>{
    try {
      let granted = await Permissions.check(gScreen.isAndroid?Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        :Permissions.PERMISSIONS.IOS.PHOTO_LIBRARY);
      if(granted == Permissions.RESULTS.BLOCKED) {
        Alert.alert(
          '',
          `${appName}尚未开启${gScreen.isAndroid?'读写':'相册'}权限，是否前往设置？`,
          [
            {text: '取消'},
            {
              text: '确定',
              onPress:()=>{
                Permissions.openSettings();
              }
            }
          ]
        );
        return;
      }
    } catch (e) {

      return;
    }
    const options = {
      imageCount: 1
    } as Partial<ImagePickerOption>;
    SyanImagePicker.showImagePicker(options, async (err, selectedPhotos)=>{
      if(err) {
        return;
      }
      let response = selectedPhotos[0];
      try {
        let result = await decodeQR(response.uri.replace('file://', ''));
        console.log(result);
        Alert.alert('',`二维码值:\n${result}`,[{text:'知道了'}]);
      } catch (e) {
        console.log(e)
      }
    });

  }

  render () {
    return (
      <View style={{flex:1}}>
        <Barcode style={{flex:1}} barCodeTypes={[BarCodeTypes.qr]} onBarCodeRead={this._onBarCodeRead}/>
        <NavigationBar style={{backgroundColor:'transparent'}}
                       title={'扫码'}
                       rightView={
                         <TouchableOpacity
                           style={{flex:1,justifyContent:'center',paddingHorizontal:10}}
                            onPress={this.decode}
                           >
                           <Text style={{color:gColors.bgColorF,fontSize:gFont.size16}}>相册</Text>
                         </TouchableOpacity>
                       }
                       titleStyle={{color:'white'}} />
      </View>
    );
  }
}
