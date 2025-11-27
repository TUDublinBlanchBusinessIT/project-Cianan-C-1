// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import PrayerListScreen from './screens/PrayerListScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import ReflectionScreen from './screens/ReflectionScreen';
import InspirationScreen from './screens/InspirationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PrayerList" component={PrayerListScreen} />
        <Stack.Screen name="Checklist" component={ChecklistScreen} />
        <Stack.Screen name="Reflection" component={ReflectionScreen} />
        <Stack.Screen name="Inspiration" component={InspirationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
