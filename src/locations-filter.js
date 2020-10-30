import React, { useState, useContext } from 'react';
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant';
import SafeAreaView from 'react-native-safe-area-view';
import { useColorScheme } from 'react-native-appearance';
import { StyleSheet, View, FlatList } from 'react-native';

import {
  Header,
  ListItem,
  Left,
  Body,
  Title,
  Right,
  Spinner,
  Item,
  Text,
  Input,
  Icon,
  Button,
} from 'native-base';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import instance from './utils/axios';
import config from './config/config.json';
import toasts from './utils/toasts';
import { AppContext } from './context/app-context';

const styles = StyleSheet.create({
  containerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    fontFamily: 'VarelaRound_400Regular',
  },
  searchInputItem: {
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 15,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'center',
    height: 40,
    alignItems: 'center',
    flex: 1,
  },
});

const LocationFilter = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { location, setLocation } = useContext(AppContext);

  const [query, setQuery] = useState(location !== null ? location.title : '');

  const fetchData = (queryParam) => {
    if (queryParam) {
      return instance.request({
        url: `${config.apiUrl}/search/`,
        method: 'GET',
        params: {
          query: queryParam,
        },
      });
    }
    return undefined;
  };

  // Debounce the original search async function
  const debouncedSearchLocation = useConstant(() =>
    AwesomeDebouncePromise(fetchData, 300)
  );

  const search = useAsync(debouncedSearchLocation, [query]);

  const clearSearch = () => {
    setQuery('');
  };

  const onPressLocation = (item) => {
    setLocation(item);
    navigation.navigate('Main');
  };

  const renderItem = ({ item }) => (
    <ListItem onPress={() => onPressLocation(item)} style={{ marginLeft: 0 }}>
      <Left>
        <Body>
          <Text style={{ color: colors.text }}>{item.title}</Text>
          <Text
            note
            style={{ color: colorScheme === 'dark' ? '#505050' : '#a0a0a0' }}
          >
            {item.location_type}
          </Text>
        </Body>
      </Left>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );

  return (
    <SafeAreaView
      forceInset={{ bottom: 'never' }}
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
      }}
    >
      <View
        style={{
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
        }}
      >
        <Header transparent>
          <StatusBar style="auto" />
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon style={{ color: '#68CCEA' }} name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title style={{ color: colors.text }}>Location Finder</Title>
          </Body>
          <Right />
        </Header>

        <FlatList
          ListHeaderComponent={
            <Item
              rounded
              style={[
                { borderColor: colorScheme === 'dark' ? '#303030' : '#f0f0f0' },
                styles.searchInputItem,
              ]}
            >
              <Icon style={{ color: '#68CCEA' }} type="Feather" name="search" />
              <Input
                autoFocus={false}
                style={[{ color: colors.text }, styles.searchInput]}
                placeholder="Type to search"
                onChangeText={setQuery}
                value={query}
              />
              {query !== '' && (
                <Icon
                  type="AntDesign"
                  style={{
                    color: colors.text,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  name="close"
                  onPress={clearSearch}
                />
              )}
            </Item>
          }
          keyboardShouldPersistTaps="never"
          keyExtractor={(item) => String(item.woeid)}
          data={search.result ? search.result.data : []}
          style={{ marginLeft: 10 }}
          renderItem={renderItem}
        />
        {search.error && toasts.danger('Ups! Error fetching data')}
        <View style={styles.containerText}>
          {!search.loading &&
            search.result &&
            search.result.data.length === 0 && (
              <Text style={{ color: colors.text }}>No Results</Text>
            )}
          {!search.loading && !search.result && (
            <Text
              style={{
                color: colors.text,
              }}
            >
              Find and Select a Location
            </Text>
          )}
          {search.loading && <Spinner color="#C4E1E8" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LocationFilter;
