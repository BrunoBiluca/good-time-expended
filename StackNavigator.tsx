import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';
import Graphics from './Graphics';
import TimeLog from './TimeLog';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'Good Time Expended'}}
        />
        <Stack.Screen name="TimeLog" component={TimeLog}  options={{title: 'Log de tempo'}} />
        <Stack.Screen name="Graphics" component={Graphics}  options={{title: 'Gráficos'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}