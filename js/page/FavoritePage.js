import React, { Component } from 'react'
import {StyleSheet,Text, View} from 'react-native';
import NavigationBar from '../common/NavigationBar';

const THEME_COLOR = '#076';
export default class FavoritePage extends Component {
  render() {

    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
  };
  let navigationBar =
      <NavigationBar
          title={'收藏'}
          statusBar={statusBar}
          style={{backgroundColor:THEME_COLOR}}
      />;

    return (
      <View style={styles.container}>
      {navigationBar}
      <Text style={styles.welcome}>FavoritePage</Text>
    </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});