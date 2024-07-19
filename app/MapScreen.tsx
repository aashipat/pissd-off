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

interface MapScreenProps {
  location: Location.LocationObject | null;
  goToFormPage: (id: number) => void;
  goToReviewsPage: (id: number) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ location, goToFormPage, goToReviewsPage }) => {
  const [washrooms, setWashrooms] = useState<Washroom[]>([]);
  const [mapType, setMapType] = useState<boolean>(false);
  const [expandedWashroomId, setExpandedWashroomId] = useState<number | null>(null);
  const [waitTimes, setWaitTimes] = useState<any>(null);

  useEffect(() => {
    const fetchWashrooms = async () => {
      try {
        const response = await axios.get('http://172.20.10.3:8000/test.php/washroomData');
        setWashrooms(response.data);
      } catch (error) {
        console.error('Error fetching washrooms data: ', error);
      }
    };

    fetchWashrooms();
  }, []);

  const fetchWaitTimes = async (id: number) => {
    try {
      const response = await axios.get(`http://172.20.10.3:8000/test.php/avgWaitTime?washroomId=${id}`);
      if (Array.isArray(response.data)) {
        const waitTimesData = response.data.reduce((acc: any, item: any) => {
          const roundedWaitTime = Math.round(parseFloat(item.avgWaitTime));
          acc[item.gender.toLowerCase()] = roundedWaitTime.toString();
          return acc;
        }, { female: 'N/A', male: 'N/A', other: 'N/A' });
        setWaitTimes(waitTimesData);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching wait times: ', error);
    }
  };

  const toggleMoreInfo = (id: number) => {
    if (expandedWashroomId === id) {
      setExpandedWashroomId(null); // Close if already expanded
      setWaitTimes(null); // Clear wait times when closing
    } else {
      setExpandedWashroomId(id);
      fetchWaitTimes(id); // Fetch and display new wait times
    }
  };

  const getMarkerImage = (
    category: string,
    openHour: number | null,
    closeHour: number | null,
    score: number | null
  ): any => {
    const currentHour = new Date().getHours();

    if (mapType) { // Score map
      if (score !== null) {
        if (category === 'Comfort Station') {
          if (score >= 4) return require('./comfortGreen.png');
          if (score > 2.5) return require('./comfortYellow.png');
          return require('./comfortRed.png');
        } else {
          if (score >= 4) return require('./portaGreen.png');
          if (score > 2.5) return require('./portaYellow.png');
          return require('./portaRed.png');
        }
      }
      return category === 'Comfort Station' ? require('./comfortGray.png') : require('./portaGray.png');
    } else { // Open/Close map
      const isOpen = openHour !== null && closeHour !== null && currentHour > openHour && currentHour < closeHour;
      return category === 'Comfort Station' ? (isOpen ? require('./comfortBlue.png') : require('./comfortGray.png')) :
        (isOpen ? require('./portaBlue.png') : require('./portaGray.png'));
    }
  };

  const renderCallout = (washroom: Washroom) => {
    const isExpanded = expandedWashroomId === washroom.washroomId;
    return (
      <View style={styles.calloutContainer}>
        <Text style={styles.calloutText}>{washroom.washroomName}</Text>
        {washroom.openHour && washroom.closeHour ? (
          <Text>Hours: {washroom.openHour} - {washroom.closeHour}</Text>
        ) : null}
        {washroom.score ? (
          <Text>Overall Score: {washroom.score}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={() => goToFormPage(washroom.washroomId)}>
          <Text style={styles.buttonText}>Tap In / Rate Washroom</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => goToReviewsPage(washroom.washroomId)}>
          <Text style={styles.buttonText}>See / Write Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => toggleMoreInfo(washroom.washroomId)}>
          <Text style={styles.buttonText}>{isExpanded ? 'Hide More Info' : 'More Info'}</Text>
        </TouchableOpacity>
        {isExpanded && waitTimes && (
          <View style={styles.moreInfoContainer}>
            <Text style={styles.moreInfoText}>Female Wait Time: {waitTimes.female} sec</Text>
            <Text style={styles.moreInfoText}>Male Wait Time: {waitTimes.male} sec</Text>
            <Text style={styles.moreInfoText}>Other Wait Time: {waitTimes.other} sec</Text>
          </View>
        )}
      </View>
    );
  };

  const toggleMapType = () => setMapType(prevType => !prevType);

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
                <Image
                  source={getMarkerImage(washroom.category, washroom.openHour, washroom.closeHour, washroom.score)}
                  style={styles.markerImage}
                />
                <Callout tooltip>
                  {renderCallout(washroom)}
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      )}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMapType}>
        <Text style={styles.toggleButtonText}>
          {mapType ? 'Go to open/close map' : 'Go to score map'}
        </Text>
      </TouchableOpacity>
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
    minWidth: 250, // Increased minimum width
    maxWidth: 300,
    padding: 15, // Added padding for more space
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4, // Adding shadow for elevation on Android
    shadowColor: '#000', // Adding shadow for elevation on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  calloutText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#87CEFA', // Light sky blue
    marginTop: 5,
    paddingVertical: 7, // Increased padding
    paddingHorizontal: 12, // Increased padding
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  moreInfoContainer: {
    marginTop: 10,
    padding: 10, // Added padding for better spacing
    borderTopWidth: 1,
    borderTopColor: '#ddd', // Light border for separation
  },
  moreInfoText: {
    fontSize: 14,
    color: '#333', // Darker text color for better readability
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffb6c1', // Light pastel color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  markerImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
});


export default MapScreen;
