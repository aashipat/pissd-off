// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import MapView, { Marker, Callout} from 'react-native-maps';
// import axios from 'axios';
// import * as Location from 'expo-location';

// interface Washroom {
//   washroomId: number;
//   washroomName: string;
//   latitude: string;
//   longitude: string;
// }

// interface MapScreenProps {
//   location: Location.LocationObject | null;
//   submitForm: (id: number) => void; // Define the type of submitForm function here
// }

// const MapScreen: React.FC<MapScreenProps> = ({location, submitForm}) => {
//   const [washrooms, setWashrooms] = useState<Washroom[]>([]);
//   useEffect(() => {
//     const fetchWashrooms = async () => {
//       try {
//         const response = await axios.get('http://172.20.10.3:8000/test.php/coordinates');
//         console.log('API response data:', response.data);
//         setWashrooms(response.data);
//       } catch (error) {
//         console.error('Error fetching washrooms data: ', error);
//       }
//     };

//     fetchWashrooms();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {location && (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           }}
//         >
//           {washrooms.map((washroom, index) => {
//             const latitude = parseFloat(washroom.latitude);
//             const longitude = parseFloat(washroom.longitude);

//             if (isNaN(latitude) || isNaN(longitude)) {
//               console.warn(`Invalid coordinates for washroom ${washroom.washroomId}: ${washroom.latitude}, ${washroom.longitude}`);
//               return null;
//             }

//             return (
//               <Marker
//                 key={index}
//                 coordinate={{ latitude, longitude }}
//                 title={washroom.washroomName}
//               >

//               <Callout>
//                 <Text>{washroom.washroomName}</Text>
//                 <TouchableOpacity style={styles.button} onPress={() => submitForm(washroom.washroomId)}>
//                 <Text style={styles.buttonText}>Tap In / Rate Washroom</Text>
//                 </TouchableOpacity>
//               </Callout>

//               </Marker>
//             );
//           })}
//         </MapView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },


//   button: {
//     backgroundColor: 'lightblue',
//     marginTop: 5,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default MapScreen;

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

interface Washroom {
  washroomId: number;
  washroomName: string;
  latitude: string;
  longitude: string;
}

interface MapScreenProps {
  location: Location.LocationObject | null;
  submitForm: (id: number) => void;
  goToReviews: (id: number) => void; // Define the type of goToReviews function here
}

const MapScreen: React.FC<MapScreenProps> = ({ location, submitForm, goToReviews }) => {
  const [washrooms, setWashrooms] = useState<Washroom[]>([]);

  useEffect(() => {
    const fetchWashrooms = async () => {
      try {
        const response = await axios.get('http://172.20.10.2:8000/test.php/coordinates');
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
              console.warn(`Invalid coordinates for washroom ${washroom.washroomId}: ${washroom.latitude}, ${washroom.longitude}`);
              return null;
            }

            return (
              <Marker
                key={index}
                coordinate={{ latitude, longitude }}
                title={washroom.washroomName}
              >
                <Callout>
                  <Text>{washroom.washroomName}</Text>
                  <TouchableOpacity style={styles.button} onPress={() => submitForm(washroom.washroomId)}>
                    <Text style={styles.buttonText}>Tap In / Rate Washroom</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => goToReviews(washroom.washroomId)}>
                    <Text style={styles.buttonText}>Reviews</Text>
                  </TouchableOpacity>
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
  button: {
    backgroundColor: 'lightblue',
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MapScreen;
