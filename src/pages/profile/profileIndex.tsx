 import React, {PureComponent} from "react";
import {View, Text} from "react-native";
import {Styles} from "../../common/styles";
import {ListRow, NavigationBar} from "@yz1311/teaset";
import {connect} from "react-redux";
import {ReduxState} from "../../models";
import {userInfoModel} from "../../api/login";


export interface IProps {
    userInfo?: userInfoModel
}

export interface IState {

}

@(connect((state:ReduxState)=>({
    userInfo: state.loginIndex.userInfo
    })) as any)
export default class ProfileIndex extends PureComponent<IProps,IState>{
    render () {
        const {userInfo} = this.props;
        return (
            <View style={[Styles.container]}>
                <NavigationBar style={{position:'relative'}} title={'我的'} leftView={null} />
                <View style={{marginTop:20}}>
                    <View style={{alignItems:'center',marginVertical:30}}>
                        <Text style={{fontSize:gFont.size20,fontWeight:'bold',color:gColors.color0}}>{userInfo.name}</Text>
                        <Text style={{fontSize:gFont.size15,color:gColors.color0,marginTop:10}}>{userInfo.email}</Text>
                    </View>
                    <ListRow
                        title={'Access Keys'}
                        onPress={()=>{
                            NavigationHelper.navigate('AccessKeyIndex');
                        }}
                    />
                    <ListRow
                        title={'设置'}
                        onPress={()=>{
                            NavigationHelper.navigate('ProfileSetting');
                        }}
                    />
                </View>
            </View>
        );
    }
}
