import React, {FC, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Styles} from '../../common/styles';
import {ListRow, PullPicker, Overlay, Label, Alert} from '@yz1311/teaset';
import * as CacheManager from '@yz1311/react-native-http-cache';
import ToastUtils from '../../utils/toastUtils';


interface IProps {

}

const bytesToDesc = (bytesCount)=>{
  if(bytesCount>0) {
    return (bytesCount/1024/1024/8).toFixed(1)+'M';
  }
  return (bytesCount||0).toFixed(1)+'M';
}

const ClearCacheDemo:FC<IProps> = ()=>{

  const [cacheSize,setCacheSize] = useState(0);

  const getCacheSize = async ()=>{
    let cacheSize
    try {
      cacheSize = await CacheManager.getCacheSize();
      setCacheSize(cacheSize);
    } catch (e) {

    }
  }

  const clearCache = async ()=>{
    try {
      await CacheManager.clearCache();
      ToastUtils.showToast('清除成功!');
      //重新加载缓存
      await getCacheSize();
    } catch (e) {
      ToastUtils.showToast('清除失败!');
    }
  }


  useEffect(()=>{
    (async ()=>await getCacheSize())();
  },[]);

  return (
    <View style={[Styles.container]}>
      <ListRow
        title={'清除缓存'}
        detail={bytesToDesc(cacheSize)}
        onPress={()=>{
          clearCache();
        }}
        />
    </View>
  );
}

//@ts-ignore
ClearCacheDemo.navigationOptions = ({navigation})=>{
  return {
    headerTitle: '缓存'
  };
}

export default ClearCacheDemo;
