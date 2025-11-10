import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import App from './App';

enableScreens(true);

AppRegistry.registerComponent('ollierider', () => App);
