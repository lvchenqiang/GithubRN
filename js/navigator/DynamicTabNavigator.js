import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
    createBottomTabNavigator,
    createAppContainer
  } from 'react-navigation';
  import {connect} from 'react-redux';


  import PopularPage from '../page/PopularPage';
  import TrendingPage from '../page/TrendingPage';
  import FavoritePage from '../page/FavoritePage';
  import MinePage from '../page/MinePage';
  
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Entypo from 'react-native-vector-icons/Entypo';
  import {BottomTabBar} from 'react-navigation-tabs';
  import EventBus from 'react-native-event-bus'
  import EventTypes from '../util/EventTypes';

  const TABS = {/// 配置路由的页面
    PopularPage:{
      screen:PopularPage,
      navigationOptions:{
        tabBarLabel:'最新',
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

 class DynamicTabNavigator extends Component {
 
    constructor(props){
        super(props);
        console.disableYellowBox = true;

    }

  _tabNavigator(){
    if(this.Tabs){
      return this.Tabs;
    }
      const {PopularPage,TrendingPage, FavoritePage, MinePage} = TABS;
      const tabs = {PopularPage, TrendingPage, FavoritePage,MinePage};
      PopularPage.navigationOptions.tabBarLabel = "最热";
      // 动态配置tab
    return this.Tabs = createAppContainer(createBottomTabNavigator(tabs,{
        tabBarComponent:props => {
            return <TabBarComponent theme={this.props.theme} {...props}/>
        }
    }));
  }


  render() {
    const Tabs = this._tabNavigator();
    return <Tabs onNavigationStateChange={(prevState, newState, action) => {
      EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {//发送底部tab切换的事件
          from: prevState.index,
          to: newState.index
      })
  }}></Tabs>
  }
}


class TabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime(),
        }
    }

    render() {
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.theme.themeColor}
        />
    }
}


const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);
