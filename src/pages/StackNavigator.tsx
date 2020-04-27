import * as React from 'react';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';
import Graphics from './GraphicsHoursByDay';
import TimeLog from './TimeLog';
import ProjectNew from './ProjectNew';
import SelectProjects from './SelectProjects';
import GraphicsHoursByProject from './GraphicsHoursByProject';
import GraphicsHoursByGoal from './GraphicsHoursByGoal';

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
        <Stack.Screen name="GraphicsHoursByDay" component={Graphics}  options={{title: 'Gráficos de horas por dia'}} />
        <Stack.Screen name="GraphicsHoursByProject" component={GraphicsHoursByProject}  options={{title: 'Gráficos de horas por projeto'}} />
        <Stack.Screen name="GraphicsHoursByGoal" component={GraphicsHoursByGoal}  options={{title: 'Gráficos de horas por meta'}} />
        <Stack.Screen name="ProjectNew" component={ProjectNew}  options={{title: 'Novo Projeto'}} />
        <Stack.Screen name="SelectProjects" component={SelectProjects}  options={{title: 'Selecione o projeto'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}