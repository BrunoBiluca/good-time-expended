import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Graphics from '../graphics/GraphicsHoursByDay';
import TimeLog from './TimeLog';
import GraphicsHoursByProject from '../graphics/GraphicsHoursByProject';
import GraphicsHoursByGoal from '../graphics/GraphicsHoursByGoal';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigator from './StackNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Root">
        <Drawer.Screen name="Root" component={StackNavigator} options={{ title: 'Home' }}/>
        <Drawer.Screen name="TimeLog" component={TimeLog} options={{ title: 'Log de tempo' }} />
        <Drawer.Screen name="GraphicsHoursByDay" component={Graphics} options={{ title: 'Horas por dia' }} />
        <Drawer.Screen name="GraphicsHoursByProject" component={GraphicsHoursByProject} options={{ title: 'Horas por projeto' }} />
        <Drawer.Screen  name="GraphicsHoursByGoal" component={GraphicsHoursByGoal} options={{ title: 'Horas por meta' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}