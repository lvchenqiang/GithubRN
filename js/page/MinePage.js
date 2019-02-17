import React, { Component } from 'react'
import {StyleSheet,Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'


import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';

const THEME_COLOR = '#076';

export default class MinePage extends Component {
  render() {

    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
  };
  let navigationBar =
      <NavigationBar
          title={'我的'}
          statusBar={statusBar}
          style={{backgroundColor:THEME_COLOR}}
      />;

    return (
      <View style={styles.container}>
      {navigationBar}
      <Text style={styles.welcome}>MinePage</Text>
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