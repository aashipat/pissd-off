import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapScreen from './MapScreen';
import * as Location from 'expo-location';

import DetailsScreen from './DetailsScreen';

const App = () => {
  // const [currentScreen, setCurrentScreen] = useState<'Map' | 'Details'>('Details');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Error fetching location: ', error);
      }
    };

    fetchData();
  }, []);


  // const handleTapIn = () => {
  //   if (!timerRunning) {
  //     setTimerRunning(true);
  //     let seconds = 0;
  //     const interval = setInterval(() => {
  //       seconds++;
  //       setTimerSeconds(seconds);
  //     }, 1000);
  //     setTimerInterval(interval);
  //   }
  // };

  // const handleTapOut = () => {
  //   if (timerRunning && timerInterval) {
  //     clearInterval(timerInterval);
  //     setTimerRunning(false);
  //     setTimerSeconds(0); // Reset timer seconds
  //   }
  // };

  const renderScreen = () => {
    return <MapScreen timerSeconds={timerSeconds} location={location}/>;
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
