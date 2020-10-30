/* eslint-disable camelcase */
import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { Root, StyleProvider } from 'native-base';
import { AppLoading } from 'expo';
import {
  useFonts,
  VarelaRound_400Regular,
} from '@expo-google-fonts/varela-round';
import { AppearanceProvider } from 'react-native-appearance';

import getTheme from './native-base-theme/components';

import Navigation from './src/navigation';
import AppProvider from './src/context/app-context';

export default () => {
  const [fontsLoaded] = useFonts({
    VarelaRound_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <AppearanceProvider>
      <AppProvider>
        <StyleProvider style={getTheme()}>
          <Root>
            <StatusBar style="auto" />
            <Navigation />
          </Root>
        </StyleProvider>
      </AppProvider>
    </AppearanceProvider>
  );
};
