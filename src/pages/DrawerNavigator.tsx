import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Graphics from '../graphics/GraphicsHoursByDay';
import TimeLog from './TimeLog';
import ProjectNew from './ProjectNew';
import SelectProjects from './SelectProjects';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{title: 'Good Time Expended'}}
        />
        <Drawer.Screen name="TimeLog" component={TimeLog}  options={{title: 'Log de tempo'}} />
        <Drawer.Screen name="Graphics" component={Graphics}  options={{title: 'Gráficos'}} />
        <Drawer.Screen name="ProjectNew" component={ProjectNew}  options={{title: 'Novo Projeto'}} />
        <Drawer.Screen name="SelectProjects" component={SelectProjects}  options={{title: 'Selecione o projeto'}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}