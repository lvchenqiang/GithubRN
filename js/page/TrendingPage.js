import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";

import actions from '../action';

import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from "../util/FavoriteUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";



import { FLAG_STORAGE } from "../expand/dao/DataStore";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

import TrendingItem from '../common/TrendingItem';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import NavigationBar from '../common/NavigationBar';
import ArrayUtil from "../util/ArrayUtil";


const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const URL = 'https://github.com/trending/';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);


class TrendingPage extends Component {


  constructor(props) {
    super(props);
    console.log(NavigationUtil.navigation);
    this.state = {
      timeSpan: TimeSpans[0],
    };
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
  }

  _genTab() {
    const tabs = {};
    const { keys, theme } = this.props;
    this.preKeys = keys;

    keys.forEach((item, index) => {
      if (item.checked) {
          tabs[`tab${index}`] = {
              screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name}
                                                theme={theme}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
              navigationOptions: {
                  title: item.name
              }
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '400'
          }}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{ color: 'white' }}
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

  _genTabNav() {

    const { theme } = this.props;

    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys))  {
      this.theme = theme;
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
        this._genTab(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, // 标签是否大写
            scrollEnabled: true,// 是否可以滚动
            style: {
              backgroundColor: theme.themeColor, //tabbar的背景色
              height: 30//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle
          },
          lazy: true
        }
      ));
    }


    return this.tabNav;
  }
  render() {
    const { keys,theme } = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };

    let navigationBar = <NavigationBar
      titleView={this._renderTitleView()}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />;

    const TabNavigator = keys.length ? this._genTabNav() : null;
    return <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
        {this._renderTrendingDialog()}
    </View>
  }
}

const mapTrendingStateToProps = state => ({
  keys: state.language.languages,
  theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);


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

    EventBus.getInstance().addListener(EventTypes.favoriteChanged_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);

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
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}

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
    const { trending, theme } = this.props;
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
              titleColor={theme.themeColor}
              tintColor={theme.themeColor}
              colors={[theme.themeColor]}
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
    // minWidth: 50,
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
