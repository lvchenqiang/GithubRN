import React, { Component } from 'react'
import {FlatList,StyleSheet,Text, View, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import {
  createMaterialTopTabNavigator,
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';
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


class PopularTab extends Component {

  constructor(props){
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount(){
    this.loadData();
  }

  loadData(){
    const {onLoadPopularData} = this.props;
    const url = this._genFetchUrl(this.storeName);

    onLoadPopularData(this.storeName, url)

  }

  _genFetchUrl(key){
    return URL + key + QUERY_STR;
  }
  _renderItem(data){
    const item = data.item;
  
    return <PopularItem 
       item = {item}
       onSelect = {()=>{

       }}

    />
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
       data = {store.items}
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
      />

      </View>
    )
  }
}

const mapStateToProps = state => ({
     popular:state.popular
});

const mapDispatchToProps = dispatch => ({
  onLoadPopularData:(storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
});
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }


});
