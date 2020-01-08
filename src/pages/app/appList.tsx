import React, {PureComponent} from 'react';
import {
  Clipboard,
  DeviceEventEmitter,
  EmitterSubscription,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {Styles} from '../../common/styles';
import {Alert, NavigationBar, Overlay} from '@yz1311/teaset';
import {Api} from '../../api';
import YZStateCommonView from '../../components/YZStateCommonView';
import RequestUtils, {
  dataToReducerResult,
  ReducerResult,
} from '../../utils/requestUtils';
import {productModel} from '../../api/home';
import MemorizedAppListItem from './appListItem';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import AddApp from './addApp';
import YZFlatList from '../../components/YZFlatList';

export interface IProps {
  tabLabel: string;
  dataList: Array<productModel>;
  loadDataResult: ReducerResult;
  onRefresh: () => void;
}

export interface IState {}

export default class AppList extends PureComponent<IProps, IState> {
  static navigationOptions = () => {
    return {
      headerShown: false
    };
  };

  private updateNameListener: EmitterSubscription;

  readonly state: IState = {};

  showAddModal = async () => {
    let overlayView = (
      <Overlay.PopView
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={false}
        animated
        autoKeyboardInsets={true}
        overlayOpacity={0.3}>
        <View
          style={{
            backgroundColor: 'white',
            width: gScreen.width * 0.9,
            paddingHorizontal: 10,
            paddingTop: 15,
            borderRadius: 6,
          }}>
          <AddApp
            onSuccess={() => {
              //刷新列表
              this.props.onRefresh && this.props.onRefresh();
            }}
            closeModal={() => {
              Overlay.hide(overlayKey);
            }}
          />
        </View>
      </Overlay.PopView>
    );
    let overlayKey = Overlay.show(overlayView);
  };

  render() {
    let {loadDataResult, dataList, tabLabel} = this.props;
    if (tabLabel == '收藏') {
      dataList = dataList.filter(x => x.collect);
      loadDataResult = dataToReducerResult(dataList);
    }
    return (
      <View style={[Styles.container]}>
        <YZStateCommonView
          loadDataResult={loadDataResult}
          errorButtonAction={() => this.props.onRefresh()}>
          <View style={[Styles.container]}>
            <YZFlatList
              renderItem={data => <MemorizedAppListItem {...data} />}
              data={dataList}
              loadData={() => {
                //刷新列表
                this.props.onRefresh && this.props.onRefresh();
              }}
              loadDataResult={loadDataResult}
              noMore={true}
              ListHeaderComponent={<View style={{height: 10}} />}
              ListFooterComponent={() => <View style={{height: 20}} />}
              ItemSeparatorComponent={() => (
                <View style={{height: 10, backgroundColor: 'transparent'}} />
              )}
            />
          </View>
        </YZStateCommonView>
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            key={0}
            buttonColor={gColors.colorGreen1}
            title="添加"
            onPress={() => {
              this.showAddModal();
            }}>
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
