import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProjectNew from './ProjectNew';
import SelectProjects from './SelectProjects';
import Home from './Home';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Good Time Expended' }}
      />
      <Stack.Screen name="ProjectNew" component={ProjectNew} options={{ title: 'Novo Projeto' }} />
      <Stack.Screen name="SelectProjects" component={SelectProjects} options={{ title: 'Selecione o projeto' }} />
    </Stack.Navigator>
  );
}