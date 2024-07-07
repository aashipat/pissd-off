import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

interface Washroom {
  washroomName: string;
  latitude: string;
  longitude: string;
}

interface MapScreenProps {
  timerSeconds: number;
  location: Location.LocationObject | null;
}

const MapScreen: React.FC<MapScreenProps> = ({timerSeconds, location}) => {
  const [washrooms, setWashrooms] = useState<Washroom[]>([]);
  useEffect(() => {
    const fetchWashrooms = async () => {
      try {
        const response = await axios.get('http://172.20.10.3:8000/test.php/coordinates');
        console.log('API response data:', response.data);
        setWashrooms(response.data);
      } catch (error) {
        console.error('Error fetching washrooms data: ', error);
      }
    };

    fetchWashrooms();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {washrooms.map((washroom, index) => {
            const latitude = parseFloat(washroom.latitude);
            const longitude = parseFloat(washroom.longitude);

            if (isNaN(latitude) || isNaN(longitude)) {
              console.warn(`Invalid coordinates for washroom ${washroom.washroomName}: ${washroom.latitude}, ${washroom.longitude}`);
              return null;
            }

            return (
              <Marker
                key={index}
                coordinate={{ latitude, longitude }}
                title={washroom.washroomName}
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
