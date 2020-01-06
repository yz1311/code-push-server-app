import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Styles} from '../../common/styles';
import {Alert, ListRow} from '@yz1311/teaset';
import Permissions from 'react-native-permissions';
import {displayName} from '../../../app.json';

interface IProps {

}

const DemoIndex:FC<IProps> = ()=>{

  const checkCameraPermission = async ()=>{
    try {
      let granted = await Permissions.check(gScreen.isAndroid?Permissions.PERMISSIONS.ANDROID.CAMERA
        :Permissions.PERMISSIONS.IOS.CAMERA);
      if(granted == Permissions.RESULTS.BLOCKED) {
        Alert.alert(
          '',
          `${appName}尚未开启相机权限，是否前往设置？`,
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
      NavigationHelper.push('ScannerDemo');
    } catch (e) {

    }

  }

  return (
    <View style={[Styles.container,{paddingTop:gScreen.px2dp(20)}]}>
      <Text style={[styles.sectionTitle]}>UI组件</Text>
      <ListRow
        title={'Wheel Picker'}
        onPress={()=>{
          NavigationHelper.push('WheelPickerDemo');
        }}
      />
      <Text style={[styles.sectionTitle,{}]}>功能组件</Text>
      <ListRow
        title={'缓存'}
        onPress={()=>{
          NavigationHelper.push('ClearCacheDemo');
        }}
      />
      <ListRow
        title={'扫二维码'}
        onPress={checkCameraPermission}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize:gFont.size14,
    color:gColors.color5,
    marginLeft:gScreen.px2dp(20),
    marginVertical:gScreen.px2dp(15),
    marginTop:gScreen.px2dp(30)
  }
});

//@ts-ignore
DemoIndex.navigationOptions = ({navigation})=>{
  return {
    headerTitle: '演示'
  };
}

export default DemoIndex;
