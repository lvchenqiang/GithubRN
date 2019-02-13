import React, { Component } from 'react'
import {StyleSheet,Text, View} from 'react-native';

import {
  createMaterialTopTabNavigator,
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';


export default class PopularPage extends Component {
  render() {

  const TabNavigator = createMaterialTopTabNavigator({
        PopularTab1:{
          screen:PopularTab,
          navigationOptions:{
            title:"tab1"
          }
        },
        PopularTab2:{
          screen:PopularTab,
          navigationOptions:{
            title:"tab2"
          }
        } 
  });
   
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
