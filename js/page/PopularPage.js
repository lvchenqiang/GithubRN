import React, { Component } from 'react'
import {FlatList,StyleSheet,Text, View, RefreshControl,ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast'
import {
  createMaterialTopTabNavigator,
} from 'react-navigation';

import actions from '../action';

import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from "../util/FavoriteUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";

import {FLAG_STORAGE} from "../expand/dao/DataStore";
import PopularItem from '../common/PopularItem';


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {

     
  constructor(props){
      super(props);
      this.tabNames = ["Java","Android","iOS","React","React Native","PHP"];

  }

  _genTab(){
      const tabs = {};
      this.tabNames.forEach((item,index) => {
        tabs[`tab${index}`] = {
            screen: props => <PopularTabPage {...props} tabLabel={item}/>,
            navigationOptions:{
                title:item
            }
        }
      });
      return tabs;
  }
  render() {
  const TabNavigator = createMaterialTopTabNavigator(
      this._genTab(),
      {
          tabBarOptions:{
              tabStyle:styles.tabStyle,
              upperCaseLabel:false, // 标签是否大写
              scrollEnabled:true,// 是否可以滚动
              style:{
                  backgroundColor: '#678', //tabbar的背景色
              },
              indicatorStyle:styles.indicatorStyle,
              labelStyle:styles.labelStyle
          }
      }
  );
   
  return <View style={{flex:1,marginTop: 30}}>
    <TabNavigator/>
  </View>
  }
}

const pageSize = 10;//设为常量，防止修改

class PopularTab extends Component {

  constructor(props){
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount(){
    this.loadData();
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();
    const url = this._genFetchUrl(this.storeName);
    if (loadMore) {
        onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
            this.refs.toast.show('没有更多了');
        })
    } else if (refreshFavorite) {
        onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
        onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }
}

  _genFetchUrl(key){
    return URL + key + QUERY_STR;
  }

    /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
    _store() {
      const {popular} = this.props;
      let store = popular[this.storeName];
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
  _renderItem(data){
    const item = data.item;
    const {theme} = this.props;
    return <PopularItem 
    projectModel={item}
    theme={theme}
    onSelect={(callback) => {
        NavigationUtil.goPage({
            theme,
            projectModel: item,
            flag: FLAG_STORAGE.flag_popular,
            callback,
        }, 'DetailPage')
    }}
    // onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}

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
    const {popular} = this.props;
    let store = popular[this.storeName];
    if(!store){
        store = {
          items:[],
          isLoading :false,
        }
    }


    return (
      <View style={styles.container}>
      <FlatList 
       data={store.projectModels}
       renderItem = {data => this._renderItem(data)}
       keyExtractor = {item => ""+item.id}
       refreshControl = {
         <RefreshControl 
          title = {"loading"}
          titleColor={THEME_COLOR}
          tintColor={THEME_COLOR}
          colors = {[THEME_COLOR]}
          refreshing = {store.isLoading}
          onRefresh = {()=>this.loadData()}
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
     popular:state.popular
});

const mapDispatchToProps = dispatch => ({
  //将 dispatch(onRefreshPopular(storeName, url))绑定到props
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    minWidth:50,
  },
  indicatorStyle:{
      height:2,
      backgroundColor:'white'
  },
  labelStyle:{
      fontSize:13,
      marginBottom: 1,
      marginTop:5,
  },
  indicatorContainer: {
    alignItems: "center"
},
indicator: {
    color: 'red',
    margin: 10
}


});
