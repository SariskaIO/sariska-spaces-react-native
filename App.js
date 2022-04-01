import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {MenuProvider} from 'react-native-popup-menu';
import {Home} from './src/Screens/Home';
import { Leave } from './src/Screens/Leave';
import {Space} from './src/Screens/Space';
import {Start} from './src/Screens/Start';
import Summary from './src/Screens/Summary';
import {Terms} from './src/Screens/Terms';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <MenuProvider style={{flexDirection: 'column'}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Terms"
            component={Terms}
            options={{title: 'Terms'}}
          />
          <Stack.Screen
            name="Start"
            component={Start}
            options={{title: 'Start'}}
          />
          <Stack.Screen
            name="Space"
            component={Space}
            options={{title: 'Stage'}}
          />
          <Stack.Screen
            name="Summary"
            component={Summary}
            options={{title: 'Stage Summary'}}
          />
          <Stack.Screen
            name="Leave"
            component={Leave}
            options={{title: 'Leave Space'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
