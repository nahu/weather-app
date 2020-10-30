import * as React from 'react';
import { useColorScheme } from 'react-native-appearance';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import MainScreen from './main';
import LocationScreen from './locations-filter';
import AboutScreen from './about';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator initialRouteName="Home" headerMode="none">
          <Stack.Screen name="Home">
            {() => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'About') {
                      iconName = focused
                        ? 'information'
                        : 'information-outline';
                    } else if (route.name === 'Main') {
                      iconName = focused
                        ? 'weather-partly-snowy-rainy'
                        : 'weather-partly-snowy-rainy';
                    }

                    // You can return any component that you like here!
                    return (
                      <MaterialCommunityIcons
                        name={iconName}
                        size={focused ? size + 2 : size}
                        color={color}
                      />
                    );
                  },
                })}
                tabBarOptions={{
                  activeTintColor: '#68CCEA',
                  inactiveTintColor: '#C4E1E8',
                }}
                initialRouteName="Main"
              >
                <Tab.Screen name="Main" component={MainScreen} />
                <Tab.Screen name="About" component={AboutScreen} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="LocationFilter" component={LocationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
