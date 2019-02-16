import React, { Component } from 'react'
import {StyleSheet, Button,Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action'

 class TrendingPage extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>TrendingPage</Text>
      <Button title="改变主题色"
              onPress = { ()=>{
               this.props.onThemeChange("#096");
              }}
       /> 
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

const mapStateToProps = state =>({});
const mapDispatchToProps = dispatch => ({
   onThemeChange:theme=>dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(TrendingPage);