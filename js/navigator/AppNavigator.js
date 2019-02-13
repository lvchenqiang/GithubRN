import {
    createStackNavigator,
    createSwitchNavigator,
} from 'react-navigation';

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';

const InitNavigator = createStackNavigator({
    WelcomePage:{
        screen:WelcomePage,
        navigationOptions:{
          header:null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    }
});


const MainNavigator = createStackNavigator({
    HomePage:{
        screen:HomePage,
        navigationOptions:{
          header:null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    },
    DetailPage:{
        screen:DetailPage,
        navigationOptions:{
        //   header:null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        }
    }
});



export default RootNavigator = createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,
}, {
    navigationOptions: {
        header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
    }
});