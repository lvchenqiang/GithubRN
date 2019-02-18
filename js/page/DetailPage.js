import React, { Component } from 'react'
import {StyleSheet, TouchableOpacity, View, DeviceInfo} from 'react-native';
import {WebView}from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome'


import NavigationBar from '../common/NavigationBar'
import FavoriteDao from "../expand/dao/FavoriteDao";
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import SafeAreaViewPlus from "../common/SafeAreaViewPlus";
import BackPressComponent from "../common/BackPressComponent";

const THEME_COLOR = '#678';
const TRENDING_URL = 'https://github.com/';

export default class DetailPage extends Component {

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel,flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
        title: title,
        url: this.url,
        canGoBack: false,
        isFavorite:projectModel.isFavorite
    };
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
}

componentDidMount() {
  this.backPress.componentDidMount();
}

componentWillUnmount() {
  this.backPress.componentWillUnmount();
}

onBackPress() {
  this.onBack();
  return true;
}


onBack() {
  if (this.state.canGoBack) {
      this.webView.goBack();
  } else {
      NavigationUtil.goBack(this.props.navigation);
  }
}

_onFavoriteButtonClick(){
  const {projectModel,callback}=this.params;
  const isFavorite=projectModel.isFavorite=!projectModel.isFavorite;
  callback(isFavorite);//更新Item的收藏状态
  this.setState({
      isFavorite:isFavorite,
  });
  let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
  if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
  } else {
      this.favoriteDao.removeFavoriteItem(key);
  }
}

_renderRightButton() {
  return (<View style={{flexDirection: 'row'}}>
          <TouchableOpacity
              onPress={() => this._onFavoriteButtonClick()}>
              <FontAwesome
                  name={this.state.isFavorite ? 'star' : 'star-o'}
                  size={20}
                  style={{color: 'white', marginRight: 10}}
              />
          </TouchableOpacity>
          {ViewUtil.getShareButton(() => {
              // let shareApp = share.share_app;
              // ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
              //     console.log("result:" + code + message);
              // });
          })}
      </View>
  )
}

_onNavigationStateChange(navState) {
  this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
  })
}

  render() {

    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
    let navigationBar = <NavigationBar
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        titleLayoutStyle={titleLayoutStyle}
        title={this.state.title}
        style={{backgroundColor:THEME_COLOR}}
        rightButton={this._renderRightButton()}
    />;

    return (
      <SafeAreaViewPlus topColor={THEME_COLOR}>
      
      {navigationBar}
      <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this._onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
       </SafeAreaViewPlus>
      
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
});