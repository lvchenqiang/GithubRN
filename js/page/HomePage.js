import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    createBottomTabNavigator,
  } from 'react-navigation';
  
  import PopularPage from './PopularPage';
  import TrendingPage from './TrendingPage';
  import FavoritePage from './FavoritePage';
  import MinePage from './MinePage';
  
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Entypo from 'react-native-vector-icons/Entypo';
  
  import NavigationUtil from '../navigator/NavigationUtil';

  import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
  import {NavigationActions} from "react-navigation";
  import {BackHandler} from 'react-native';
  import {connect} from 'react-redux';
 class HomePage extends Component {

componentDidMount(){
BackHandler.addEventListener('hardwareBackPress',this.onBackPress);
}

componentWillUnmount(){
BackHandler.removeEventListener('hardwareBackPress',this.onBackPress);
}

 /**
     * 处理 Android 中的物理返回键
     * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
     * @returns {boolean}
     */
    onBackPress = () => {
      const {dispatch, nav} = this.props;
      //if (nav.index === 0) {
      if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
          return false;
      }
      dispatch(NavigationActions.back());

      return true;
  };

comdid

  render() {
    NavigationUtil.navigation = this.props.navigation
    return <DynamicTabNavigator/>
  }
}


const mapStateToProps = state => ({
  nav: state.nav,
});



export default connect(mapStateToProps)(HomePage);