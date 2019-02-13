import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    createBottomTabNavigator,
  } from 'react-navigation';
  
  import PopularPage from '../page/PopularPage';
  import TrendingPage from '../page/TrendingPage';
  import FavoritePage from '../page/FavoritePage';
  import MinePage from '../page/MinePage';
  
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Entypo from 'react-native-vector-icons/Entypo';
  
  import NavigationUtil from './NavigationUtil';


  const TABS = {/// 配置路由的页面
    PopularPage:{
      screen:PopularPage,
      navigationOptions:{
        tabBarLabel:'最热',
        tabBarIcon: ({tintColor, focused}) => (
          <MaterialIcons
              name={'whatshot'}
              size={26}
              style={{color: tintColor}}
          />
      ),
      }
    },
    TrendingPage:{
      screen:TrendingPage,
      navigationOptions:{
        tabBarLabel:'趋势',
        tabBarIcon: ({tintColor, focused}) => (
          <Ionicons
              name={'md-trending-up'}
              size={26}
              style={{color: tintColor}}
          />
      ),
      }
    },
    FavoritePage:{
      screen:FavoritePage,
      navigationOptions:{
        tabBarLabel:'收藏',
        tabBarIcon: ({tintColor, focused}) => (
          <MaterialIcons
              name={'favorite'}
              size={26}
              style={{color: tintColor}}
          />
      ),
      }
    },
    MinePage:{
      screen:MinePage,
      navigationOptions:{
        tabBarLabel:'我的',
        tabBarIcon: ({tintColor, focused}) => (
          <Entypo
              name={'user'}
              size={26}
              style={{color: tintColor}}
          />
      ),
      }
    }
  };

export default class HomePage extends Component {
 
    constructor(props){
        super(props);
        console.disableYellowBox = true;

    }

  _tabNavigator(){
      const {PopularPage,TrendingPage, FavoritePage, MinePage} = TABS;
      const tabs = {PopularPage, TrendingPage, FavoritePage};

    return createBottomTabNavigator(tabs,);
  }


  render() {
    const Tabs = this._tabNavigator();
    return <Tabs></Tabs>
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