/**
 * @format
 */

import {AppRegistry, Platform, YellowBox} from 'react-native';
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
YellowBox.ignoreWarnings([
    'Remote debugger is in a background tab which may cause apps to perform slowly',
    'Warning: componentWillReceiveProps',
    'Require cycle: node_modules/rn-fetch-blob/index.js',
]);
// console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => Root);
