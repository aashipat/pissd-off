import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapScreen from './MapScreen';
import Form from './Form';
import Review from './Review'; // Import the Review component
import * as Location from 'expo-location';

const App = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'Map' | 'Form' | 'Review'>('Map');
  const [washroomId, setWashroomId] = useState<number>(-1);

  const goToFormPage = (id: number) => {
    console.log('Button pressed in child component with data:', id);
    setWashroomId(id);
    setCurrentScreen('Form');
  };

  const goToMapsPage = () => {
    console.log('Button pressed in child component with data:');
    setCurrentScreen('Map');
  };

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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Map':
        return <MapScreen location={location} goToFormPage={goToFormPage}/>;
      case 'Form':
        return <Form washroomId={washroomId} submitForm={goToMapsPage}/>;
      case 'Review':
        return <Review />;
      default:
        return null;
    }
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