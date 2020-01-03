import React, {PureComponent} from 'react';
import {TouchableOpacity, View, Text, NativeModules, Platform} from 'react-native';
import Barcode, {BarCodeReadEvent, BarCodeTypes, decodeQR} from '@yz1311/react-native-smart-barcode';
import {NavigationBar} from '@yz1311/teaset';
import SyanImagePicker from 'react-native-syan-image-picker';


interface IProps {

}

interface IState {
  viewAppear: boolean
}

export default class Scanner extends PureComponent<IProps,IState>{

  static navigationOptions = ()=>{
    return {
      header: null
    };
  }

  readonly state:IState = {
    viewAppear: true
  };

  componentDidMount(): void {
    setTimeout( () => {
      this.setState({
        viewAppear: true,
      })
    }, 255)
  }

  _onBarCodeRead = (e:BarCodeReadEvent)=>{
    console.log(e.nativeEvent.data.code)
  }

  decode = ()=>{
    const options = {

    };
    SyanImagePicker.showImagePicker({}, (err, selectedPhotos)=>{
      // if(err) {
      //   return;
      // }
      // let response = selectedPhotos[0];
      // try {
      //   let result = await decodeQR(response.uri.replace('file://', ''));
      //   console.log(result);
      // } catch (e) {
      //   console.log(e)
      // }
    });

  }

  render () {
    return (
      <View style={{flex:1}}>
        {this.state.viewAppear ?
          <Barcode style={{flex:1}} barCodeTypes={[BarCodeTypes.qr]} onBarCodeRead={this._onBarCodeRead}/>
          :
          null
        }
        <NavigationBar style={{backgroundColor:'transparent'}}
                       title={'扫码'}
                       rightView={
                         <TouchableOpacity
                            onPress={this.decode}
                           >
                           <Text style={{color:gColors.bgColorF,fontSize:gFont.size16}}>查看</Text>
                         </TouchableOpacity>
                       }
                       titleStyle={{color:'white'}} />
      </View>
    );
  }
}
