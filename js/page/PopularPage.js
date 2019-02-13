import React, { Component } from 'react'
import {StyleSheet,Text, View} from 'react-native';

import {
  createMaterialTopTabNavigator,
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';


export default class PopularPage extends Component {

     
  constructor(props){
      super(props);
      this.tabNames = ["Java","Android","iOS","React","React Native","PHP"];

  }

  _genTab(){
      const tabs = {};
      this.tabNames.forEach((item,index) => {
        tabs[`tab${index}`] = {
            screen: props => <PopularTab {...props} tabLabel={item}/>,
            navigationOptions:{
                title:item
            }
        }
      });
      return tabs;
  }
  render() {
  const TabNavigator = createMaterialTopTabNavigator(
      this._genTab(),
      {
          tabBarOptions:{
              tabStyle:styles.tabStyle,
              upperCaseLabel:false, // 标签是否大写
              scrollEnabled:true,// 是否可以滚动
              style:{
                  backgroundColor: '#678', //tabbar的背景色
              },
              indicatorStyle:styles.indicatorStyle,
              labelStyle:styles.labelStyle
          }
      }
  );
   
  return <View style={{flex:1,marginTop: 30}}>
    <TabNavigator/>
  </View>
  }
}


class PopularTab extends Component {
  render() {
    const {tabLabel} = this.props;

    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>{tabLabel}</Text>
      <Text onPress={()=>{
        NavigationUtil.goPage({
          navigation:this.props.navigation
        },"DetailPage")
      }}>跳转到详情页</Text>
      
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    minWidth:50,
  },
  indicatorStyle:{
      height:2,
      backgroundColor:'white'
  },
  labelStyle:{
      fontSize:13,
      marginBottom: 1,
      marginTop:5,
  }


});
