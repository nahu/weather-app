import React, { useState, useContext, useEffect } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { useColorScheme } from 'react-native-appearance';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';

import {
  Header,
  Left,
  Body,
  Title,
  Right,
  Spinner,
  Item,
  Text,
  Icon,
  Thumbnail,
} from 'native-base';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import instance from './utils/axios';
import config from './config/config.json';
import toasts from './utils/toasts';
import { AppContext } from './context/app-context';
import {
  formatDate,
  formatApiDate,
  formatToApiDate,
  formatNumber,
} from './utils/converters';

const styles = StyleSheet.create({
  containerText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  containerCard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 0.5,
  },
  activityIndicator: {
    position: 'absolute',
    left: -10,
    right: 0,
    top: -10,
    bottom: 0,
  },
  contentCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  styleText: {
    color: '#a2a2a2',
    fontSize: 12,
    fontFamily: 'VarelaRound_400Regular',
  },
  centerCard: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  partStart: {
    flexGrow: 0.2,
    alignItems: 'flex-start',
  },
  partMiddle: {
    flexGrow: 0.3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  partEnd: {
    flexGrow: 0.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

const today = new Date();

const Main = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();
  const { location, date, setDate } = useContext(AppContext);

  const [fetching, setFetching] = useState(false);
  const [loadingImageMap, setLoadingImageMap] = useState({});
  const [data, setData] = useState(location !== null ? [location] : null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    setDate(selectedDate);
  };

  const onPressLocationFilter = () => {
    navigation.navigate('LocationFilter');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${config.apiUrl}/${location.woeid}/`;

        if (date.toDateString() !== today.toDateString()) {
          url = `${config.apiUrl}/${location.woeid}/${date.getFullYear()}/${
            date.getMonth() + 1
          }/${date.getDate()}/`;
        }

        const response = await instance.request({
          url,
          method: 'GET',
        });

        if (response.data && response.data.consolidated_weather) {
          if (
            response.data.consolidated_weather[0].applicable_date !==
            formatToApiDate(date)
          ) {
            url = `${config.apiUrl}/${location.woeid}/${date.getFullYear()}/${
              date.getMonth() + 1
            }/${date.getDate()}/`;

            const responseSecondCall = await instance.request({
              url,
              method: 'GET',
            });

            const newData = [];
            if (
              responseSecondCall.data &&
              Array.isArray(responseSecondCall.data)
            ) {
              newData.push(responseSecondCall.data[0]);
            }

            setData(newData.concat(response.data.consolidated_weather));
          } else {
            setData(response.data.consolidated_weather);
          }
        } else if (response.data && Array.isArray(response.data)) {
          setData(response.data);
        }

        setFetching(false);
      } catch (err) {
        toasts.warning('Ups! Error fetching data');
        setFetching(false);
      }
    };

    if (date && location) {
      setFetching(true);
      setData(null);
      fetchData();
    }
  }, [location, date]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.centerCard}>
      <View
        style={[
          styles.containerCard,
          {
            backgroundColor: colorScheme === 'dark' ? '#111111' : '#f8f8f8',
            borderColor: colorScheme === 'dark' ? '#303030' : '#f0f0f0',
          },
        ]}
      >
        <View style={[styles.contentCard]}>
          <View style={styles.partStart}>
            <Thumbnail
              square
              source={{
                uri: `${config.serverUrl}/static/img/weather/png/${item.weather_state_abbr}.png`,
              }}
              onLoadStart={() => {
                loadingImageMap[item.id] = true;
                setLoadingImageMap(loadingImageMap);
              }}
              onLoadEnd={() => {
                loadingImageMap[item.id] = false;
                setLoadingImageMap(loadingImageMap);
              }}
            />
            {loadingImageMap[item.id] && (
              <Spinner
                style={styles.activityIndicator}
                size="small"
                color="#C4E1E8"
              />
            )}
          </View>

          <View style={styles.partMiddle}>
            <Text style={{ color: colors.text, fontSize: 20 }}>
              {formatApiDate(item.applicable_date)}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.weather_state_name}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text
                style={{
                  color: colorScheme === 'dark' ? '#707070' : '#505050',
                  fontSize: 14,
                }}
              >
                {formatNumber(item.min_temp)}
              </Text>
              <Icon
                style={{
                  color: colorScheme === 'dark' ? '#707070' : '#505050',
                  fontSize: 13,
                }}
                type="MaterialCommunityIcons"
                name="temperature-celsius"
              />
              <Text
                style={{
                  color: colorScheme === 'dark' ? '#707070' : '#505050',
                  fontSize: 18,
                }}
              >
                /{formatNumber(item.max_temp)}
              </Text>
              <Icon
                style={{
                  color: colorScheme === 'dark' ? '#707070' : '#505050',
                  fontSize: 17,
                }}
                type="MaterialCommunityIcons"
                name="temperature-celsius"
              />
            </View>
          </View>
          <View style={styles.partEnd}>
            <Text
              note
              style={{
                color: colorScheme === 'dark' ? '#505050' : '#a0a0a0',
              }}
            >
              Humidity: {formatNumber(item.humidity)}
            </Text>
            <Text
              note
              style={{
                color: colorScheme === 'dark' ? '#505050' : '#a0a0a0',
              }}
            >
              Predictability: {formatNumber(item.predictability)}
            </Text>
            <Text
              note
              style={{
                color: colorScheme === 'dark' ? '#505050' : '#a0a0a0',
              }}
            >
              Wind Speed: {formatNumber(item.wind_speed)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
          <Left />
          <Body>
            <Title style={{ color: colors.text }}>Weather App</Title>
          </Body>
          <Right />
        </Header>

        <FlatList
          ListHeaderComponent={
            <View style={styles.containerText}>
              <Item
                onPress={onPressLocationFilter}
                style={{
                  width: '100%',
                  height: 40,
                  justifyContent: 'flex-start',
                  flex: 1,
                  marginBottom: 10,
                  borderColor: colorScheme === 'dark' ? '#303030' : '#f0f0f0',
                }}
                rounded
                bordered={false}
              >
                <Icon
                  style={{ color: '#68CCEA' }}
                  type="Entypo"
                  name="location-pin"
                />
                {location ? (
                  <Text
                    style={{
                      color: colors.text,
                      marginLeft: 10,
                      width: '100%',
                    }}
                  >
                    {location.title}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: colorScheme === 'dark' ? '#505050' : '#a0a0a0',
                      marginLeft: 10,
                      width: '100%',
                    }}
                  >
                    Select a Location
                  </Text>
                )}
              </Item>
              <Item
                style={{
                  width: '100%',
                  height: 40,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flex: 1,
                  borderColor: colorScheme === 'dark' ? '#303030' : '#f0f0f0',
                }}
                rounded
                bordered={false}
                onPress={showDatePicker}
              >
                <Icon
                  style={{
                    color: '#68CCEA',
                  }}
                  type="MaterialCommunityIcons"
                  name="calendar"
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  locale="en_US"
                  headerTextIOS={'Select a Date'}
                  date={date}
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />

                {date ? (
                  <Text
                    style={{
                      color: colors.text,
                      marginLeft: 10,
                      width: '100%',
                    }}
                  >
                    {formatDate(date)}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: colorScheme === 'dark' ? '#505050' : '#a0a0a0',
                      marginLeft: 10,
                      width: '100%',
                    }}
                  >
                    Select a Date
                  </Text>
                )}
              </Item>
            </View>
          }
          keyExtractor={(item) => String(item.id)}
          data={data}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={renderItem}
        />
        <View style={styles.containerText}>
          {!fetching && data && data.length === 0 && (
            <Text style={{ color: colors.text }}>No Results</Text>
          )}
          {!fetching && (location === null || date === null) && (
            <Text
              style={{
                color: colors.text,
              }}
            >
              Select a Location to display the forecast
            </Text>
          )}
          {fetching && <Spinner color="#C4E1E8" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Main;
