import React, { Component } from 'react';
import {StyleSheet,Text, View} from 'react-native';

import NavigationUtil from '../navigator/NavigationUtil';


export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({
          navigation: this.props.navigation
      })
    }, 1000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to WelcomePage</Text>
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
