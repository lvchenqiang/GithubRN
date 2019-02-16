import React, { Component } from 'react'
import {StyleSheet,Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
export default class MinePage extends Component {
  render() {
    return (
      <View style={styles.container}>
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