import React,{FC} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Styles} from '../../common/styles';
import {ListRow, PullPicker, Overlay, Label, Alert} from '@yz1311/teaset';
import {CommonPicker, DatePicker, RegionPicker} from '@yz1311/react-native-wheel-picker';
import DemoIndex from './demoIndex';
import moment from 'moment';

interface IProps {

}

const SINGLE_WHEEL_DATA_1 = ['刘备','关羽','张飞','赵云','黄忠'];

const SIGNLE_WHEEL_DATA_2 = '甲、乙、丙、丁、戊、己、庚、辛、壬、癸'.split('、');

const SIGNLE_WHEEL_DATA_3 = '子、丑、寅、卯、辰、巳、午、未、申、酋、戊、亥'.split('、');

const CASCADE_WHEEL_DATA = {
  '刘备': ['皇叔', '蜀国', '皇帝'],
  '关羽': ['关公', '长髯', '红脸'],
  '张飞': ['黑脸', '翼德', '燕人'],
  '赵云': ['常山', '子龙']
};

const WheelPickerDemo:FC<IProps> = ()=>{

  const picker1 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <CommonPicker
            pickerTitle={'单选'}
            pickerData={SINGLE_WHEEL_DATA_1}
            selectedValue={['']}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker2 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <CommonPicker
            pickerTitle={'单选(带默认值)'}
            pickerData={SINGLE_WHEEL_DATA_1}
            selectedValue={['张飞']}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker3 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <CommonPicker
            pickerTitle={'多选-无关联'}
            pickerData={[SINGLE_WHEEL_DATA_1,SIGNLE_WHEEL_DATA_2,SIGNLE_WHEEL_DATA_3]}
            selectedValue={['赵云']}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker4 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <CommonPicker
            pickerTitle={'多选-无关联(带默认值)'}
            pickerData={[SINGLE_WHEEL_DATA_1,SIGNLE_WHEEL_DATA_2,SIGNLE_WHEEL_DATA_3]}
            selectedValue={['张飞','丙','丑']}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }


  const picker5 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <DatePicker
            date={moment('2020-02-02').toDate()}
            onDateChange={()=>{

            }}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(date)=>{
              Overlay.hide(overlayKey);
              Alert.alert('',moment(date).format('YYYY-MM-DD HH:mm:ss'),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker6 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <DatePicker
            mode={'time'}
            date={moment('2020-02-02 18:26:00').toDate()}
            onDateChange={()=>{

            }}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(date)=>{
              Overlay.hide(overlayKey);
              Alert.alert('',moment(date).format('YYYY-MM-DD HH:mm:ss'),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker7 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <DatePicker
            mode={'datetime'}
            date={moment('2020-02-02 18:26:00').toDate()}
            onDateChange={()=>{

            }}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(date)=>{
              Overlay.hide(overlayKey);
              Alert.alert('',moment(date).format('YYYY-MM-DD HH:mm:ss'),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker8 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <RegionPicker
            selectedValue={[]}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value,ids)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(',')+'\n'+ids.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker9 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <RegionPicker
            selectedValue={['上海市','市辖区','浦东新区']}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value,ids)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(',')+'\n'+ids.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker10 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <CommonPicker
            pickerTitle={'多选-级联'}
            pickerData={CASCADE_WHEEL_DATA}
            selectedValue={[]}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  const picker11 = ()=>{
    let overlayView = (
      <Overlay.PullView side='bottom' modal={false}>
        <View style={{backgroundColor: '#fff', height: 300}}>
          <CommonPicker
            pickerTitle={'多选-级联'}
            pickerData={CASCADE_WHEEL_DATA}
            selectedValue={['赵云','子龙']}
            onPickerCancel={()=>{
              Overlay.hide(overlayKey);
            }}
            onPickerConfirm={(value)=>{
              Overlay.hide(overlayKey);
              Alert.alert('','已选择:\n'+value.join(','),[{text: '知道了'}])
            }}
          />
        </View>
      </Overlay.PullView>
    );
    let overlayKey = Overlay.show(overlayView);
  }

  return (
    <ScrollView style={[Styles.container]}>
      <ListRow
        title={'单选'}
        onPress={()=>{
          picker1();
        }}
        />
      <ListRow
        title={'单选(带默认值)'}
        onPress={()=>{
          picker2();
        }}
      />
      <ListRow
        title={'多选-无关联'}
        onPress={()=>{
          picker3();
        }}
      />
      <ListRow
        title={'多选-无关联(带默认值)'}
        onPress={()=>{
          picker4();
        }}
      />
      <ListRow
        title={'多选-级联'}
        onPress={()=>{
          picker10();
        }}
      />
      <ListRow
        title={'多选-级联(带默认值)'}
        onPress={()=>{
          picker11();
        }}
      />
      <ListRow
        title={'日期(带默认值)'}
        onPress={()=>{
          picker5();
        }}
      />
      <ListRow
        title={'时间(带默认值)'}
        onPress={()=>{
          picker6();
        }}
      />
      <ListRow
        title={'日期+时间(带默认值)'}
        onPress={()=>{
          picker7();
        }}
      />
      <ListRow
        title={'省市区'}
        onPress={()=>{
          picker8();
        }}
      />
      <ListRow
        title={'省市区(带默认值)'}
        onPress={()=>{
          picker9();
        }}
      />
    </ScrollView>
  );
}

//@ts-ignore
WheelPickerDemo.navigationOptions = ({navigation})=>{
  return {
    headerTitle: 'Wheel组件'
  };
}

export default WheelPickerDemo;
