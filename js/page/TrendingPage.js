import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast'
import {
  createMaterialTopTabNavigator,
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


import actions from '../action';

import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from "../util/FavoriteUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import NavigationBar from '../common/NavigationBar';


import { FLAG_STORAGE } from "../expand/dao/DataStore";
import TrendingItem from '../common/TrendingItem';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";



const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#076';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

export default class TrendingPage extends Component {


  constructor(props) {
    super(props);
    console.log(NavigationUtil.navigation);
    this.state = {
      timeSpan: TimeSpans[0],
    };
    this.tabNames = ["All", "c#", "iOS", "c++"];

  }

  _genTab() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item} timeSpan={this.state.timeSpan} />,
        navigationOptions: {
          title: item
        }
      }
    });
    return tabs;
  }
  _renderTitleView() {
    return <View>
        <TouchableOpacity
            underlayColor='transparent'
            onPress={() => this.dialog.show()}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{
                    fontSize: 18,
                    color: '#FFFFFF',
                    fontWeight: '400'
                }}>趋势 {this.state.timeSpan.showText}</Text>
                <MaterialIcons
                    name={'arrow-drop-down'}
                    size={22}
                    style={{color: 'white'}}
                />
            </View>
        </TouchableOpacity>
    </View>
}
_onSelectTimeSpan(tab) {
  this.dialog.dismiss();
  this.setState({
      timeSpan: tab
  });
  DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
}

_renderTrendingDialog() {
  return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this._onSelectTimeSpan(tab)}
  />
}

_genTabNav(){
  if(this.tabNav){
    return this.tabNav;
  }
  this.tabNav = createMaterialTopTabNavigator(//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
    this._genTab(),
    {
      tabBarOptions: {
        tabStyle: styles.tabStyle,
        upperCaseLabel: false, // 标签是否大写
        scrollEnabled: true,// 是否可以滚动
        style: {
          backgroundColor: '#678', //tabbar的背景色
          height: 30//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle
      },
      lazy: true
    }
  );
  return this.tabNav;
}
  render() {

    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      titleView={this._renderTitleView()}
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    // rightButton={this.renderRightButton()}
    />;

    const TabNavigator = this._genTabNav();

    return <View style={styles.container}>
      {navigationBar}
      <TabNavigator/>
      {/* {TabNavigator && <TabNavigator/>} */}
      {this._renderTrendingDialog()}
    </View>
  }
}

const pageSize = 10;//设为常量，防止修改

class TrendingTab extends Component {

  constructor(props) {
    super(props);
    const { tabLabel, timeSpan } = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
  }

  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
  });
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
        this.timeSpanChangeListener.remove();
    }
    
}

  loadData(loadMore, refreshFavorite) {
    const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props;
    const store = this._store();
    const url = this._genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }
  }

  _genFetchUrl(key) {
    return URL + key + '?' + this.timeSpan.searchText;
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store;
  }
  _renderItem(data) {
    const item = data.item;
    const { theme } = this.props;
    return <TrendingItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback,
        }, 'DetailPage')
      }}
    onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}

    />
  }

  _genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }

  render() {
    const { trending } = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
      }
    }


    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this._renderItem(data)}
          keyExtractor={item => "" + (item.id || item.fullName)}
          refreshControl={
            <RefreshControl
              title={"loading"}
              titleColor={THEME_COLOR}
              tintColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
            />

          }

          ListFooterComponent={() => this._genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----')
          }}
        />
        <Toast ref={'toast'}
          position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  trending: state.trending
});
const mapDispatchToProps = dispatch => ({
  //将 dispatch(onRefreshPopular(storeName, url))绑定到props
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }

});
