import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { useColorScheme } from 'react-native-appearance';
import { StyleSheet, Linking } from 'react-native';

import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Title,
  Right,
  Subtitle,
  Text,
} from 'native-base';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const styles = StyleSheet.create({
  containerText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const About = () => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      forceInset={{ bottom: 'never' }}
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
      }}
    >
      <Container
        style={{
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
        }}
      >
        <Header transparent>
          <StatusBar style="auto" />
          <Left />
          <Body>
            <Title style={{ color: colors.text }}>Weather APP</Title>
            <Subtitle style={{ color: colors.text }}>Code Challenge</Subtitle>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={styles.containerText}>
          <Text style={{ color: colors.text }}>React Native</Text>
          <Text style={{ color: colors.text }}>Expo</Text>
          <Text style={{ color: colors.text }}>
            Native Base + Custom ejected Theme
          </Text>
          <Text style={{ color: colors.text }}>
            React Native Appearance for Dark Mode support
          </Text>
          <Text style={{ color: colors.text, marginTop: 10 }}>API:</Text>
          <Text
            style={{ color: 'blue' }}
            onPress={() => Linking.openURL('https://www.metaweather.com/api/')}
          >
            https://www.metaweather.com/api/
          </Text>
        </Content>
      </Container>
    </SafeAreaView>
  );
};

export default About;
