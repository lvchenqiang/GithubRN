/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AppNavigator from './js/navigator/AppNavigator';

AppRegistry.registerComponent(appName, () => AppNavigator);
