import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

interface Washroom {
  washroomId: number;
  washroomName: string;
  category: string;
  onCall: boolean | null;
  openHour: number | null;
  closeHour: number | null;
  score: number | null;
  latitude: string;
  longitude: string;
}

interface WashroomWaitTimes {
  wId: number;
  femaleWait: number | null;
  maleWait: number | null;
  otherWait: number | null;
}

interface MapScreenProps {
  location: Location.LocationObject | null;
  goToFormPage: (id: number) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ location, goToFormPage }) => {
  const [washrooms, setWashrooms] = useState<Washroom[]>([]); //array of washrooms

  useEffect(() => {
    const fetchWashrooms = async () => {
      try {
        const response = await axios.get('http://172.20.10.3:8000/test.php/washroomData');
        console.log('API response data:', response.data);
        setWashrooms(response.data);
      } catch (error) {
        console.error('Error fetching washrooms data: ', error);
      }
    };

    const fetchWashroomWaitTimes = async () => {
      try {

      } catch (error) {

      }
    }

    fetchWashrooms();
    fetchWashroomWaitTimes();
  }, []);




    // Function to determine marker image based on coordinates
    const getMarkerImage = (category: string): any => {
      // Example condition: Use different images based on latitude or longitude ranges
      // Replace with your logic based on specific criteria
      if (category == "Comfort Station") {
        return require('./comfort.png'); // Example image 1
      } else {
        return require('./portapotty.png'); // Example image 2
      }
    };

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
              console.warn(`Invalid coordinates for washroom ${washroom.washroomId}: ${washroom.latitude}, ${washroom.longitude}`);
              return null;
            }

            return (
              <Marker
                key={index}
                coordinate={{ latitude, longitude }}
                title={washroom.washroomName}
              >
                {/* Custom marker with image */}
                <Image
                  source={getMarkerImage(washroom.category)}
                  style={{ width: 45, height: 45, resizeMode: 'contain'}}
                />

                {/* Callout with information */}
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{washroom.washroomName}</Text>

                    {washroom.openHour && washroom.closeHour ? (
                        <Text>Hours: {washroom.openHour} - {washroom.closeHour}</Text>
                      ) : null
                    }

                    {washroom.score ? (
                        <Text>Overall Score: {washroom.score}</Text>
                      ) : null
                    }

                    <TouchableOpacity style={styles.button} onPress={() => goToFormPage(washroom.washroomId)}>
                      <Text style={styles.buttonText}>Tap In / Rate Washroom</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
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
  calloutContainer: {
    minWidth: 150,
    maxWidth: 300,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  calloutText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: 'lightblue',
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapScreen;
