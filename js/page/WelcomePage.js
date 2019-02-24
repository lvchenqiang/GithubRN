import React, { Component } from 'react';
import {StyleSheet,Text, View} from 'react-native';
import {connect} from 'react-redux';
import NavigationUtil from '../navigator/NavigationUtil';
import actions from "../action";
import SplashScreen from 'react-native-splash-screen'

 class WelcomePage extends Component {
  componentDidMount() {
    this.props.onThemeInit();

    this.timer = setTimeout(() => {
      SplashScreen.hide();
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

const mapDispatchToProps = dispatch => ({
  onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);

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
