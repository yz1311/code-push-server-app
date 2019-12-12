/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import Root from './src/root';
import {name as appName} from './app.json';

if(Platform.OS ==='android')
{
    global.__ANDROID__ = true;
    global.__IOS__ = false;
}
else
{
    global.__ANDROID__ = false;
    global.__IOS__ = true;
}
console.ignoredYellowBox = [
    'Warning: componentWillReceiveProps'
];
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => Root);
