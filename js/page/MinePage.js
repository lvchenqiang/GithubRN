import React, {Component} from 'react';
import {connect} from 'react-redux'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';


import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar';


import Ionicons from 'react-native-vector-icons/Ionicons'
import {MORE_MENU} from "../common/MORE_MENU";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import actions from "../action";

const THEME_COLOR = '#076';

 class MinePage extends Component {

  onClick(menu) {
    const {theme} = this.props;
    let RouteName, params = {theme};
    switch (menu) {
        case MORE_MENU.Tutorial:
            RouteName = 'WebViewPage';
            params.title = '教程';
            params.url = 'https://lvchenqiang.github.io/';
            break;
        case MORE_MENU.About:
            RouteName = 'AboutPage';
            break;
        case MORE_MENU.Custom_Theme:
            const {onShowCustomThemeView} = this.props;
            onShowCustomThemeView(true);
            break;
        case MORE_MENU.CodePush:
            RouteName = 'CodePushPage';
            break;
        case MORE_MENU.Sort_Key:
            RouteName = 'SortKeyPage';
            params.flag = FLAG_LANGUAGE.flag_key;
            break;
        case MORE_MENU.Sort_Language:
            RouteName = 'SortKeyPage';
            params.flag = FLAG_LANGUAGE.flag_language;
            break;
        case MORE_MENU.Custom_Key:
        case MORE_MENU.Custom_Language:
        case MORE_MENU.Remove_Key:
            RouteName = 'CustomKeyPage';
            RouteName = 'CustomKeyPage';
            params.isRemoveKey = menu === MORE_MENU.Remove_Key;
            params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
            break;
        case MORE_MENU.About_Author:
            RouteName = 'AboutMePage';
            break;
    }
    if (RouteName) {
        NavigationUtil.goPage(params, RouteName);
    }
}

getItem(menu) {
  const {theme} = this.props;
  return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
}



render() {
  const {theme} = this.props;
  let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
  };
  let navigationBar =
      <NavigationBar
          title={'我的'}
          statusBar={statusBar}
          style={{backgroundColor:THEME_COLOR}}
      />;
  return (
      <View style={GlobalStyles.root_container}>
          {navigationBar}
          <ScrollView>
              <TouchableOpacity
                  style={styles.item}
                  onPress={() => this.onClick(MORE_MENU.About)}
              >
                  <View style={styles.about_left}>
                      <Ionicons
                          name={MORE_MENU.About.icon}
                          size={40}
                          style={{
                              marginRight: 10,
                              color: theme.themeColor,
                          }}
                      />
                      <Text>GitHub Popular</Text>
                  </View>
                  <Ionicons
                      name={'ios-arrow-forward'}
                      size={16}
                      style={{
                          marginRight: 10,
                          alignSelf: 'center',
                          color: theme.themeColor,
                      }}/>
              </TouchableOpacity>
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Tutorial)}
              {/*趋势管理*/}
              <Text style={styles.groupTitle}>趋势管理</Text>
              {/*自定义语言*/}
              {this.getItem(MORE_MENU.Custom_Language)}
              {/*语言排序*/}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Sort_Language)}

              {/*最热管理*/}
              <Text style={styles.groupTitle}>最热管理</Text>
              {/*自定义标签*/}
              {this.getItem(MORE_MENU.Custom_Key)}
              {/*标签排序*/}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Sort_Key)}
              {/*标签移除*/}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Remove_Key)}

              {/*设置*/}
              <Text style={styles.groupTitle}>设置</Text>
              {/*自定义主题*/}
              {this.getItem(MORE_MENU.Custom_Theme)}
              {/*关于作者*/}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.About_Author)}
              <View style={GlobalStyles.line}/>
              {/*反馈*/}
              {this.getItem(MORE_MENU.Feedback)}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.CodePush)}
          </ScrollView>
      </View>
  );
}
}


const mapStateToProps = state => ({
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapStateToProps, mapDispatchToProps)(MinePage);
const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: 30
  },
  about_left: {
      alignItems: 'center',
      flexDirection: 'row'
  },
  item: {
      backgroundColor: 'white',
      padding: 10,
      height: 90,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row'
  },
  groupTitle: {
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 5,
      fontSize: 12,
      color: 'gray'
  }
});
