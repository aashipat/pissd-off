// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
// import MapView, { Marker, Callout } from 'react-native-maps';
// import axios from 'axios';
// import * as Location from 'expo-location';

// interface Washroom {
//   washroomId: number;
//   washroomName: string;
//   category: string;
//   onCall: boolean | null;
//   openHour: number | null;
//   closeHour: number | null;
//   score: number | null;
//   latitude: string;
//   longitude: string;
// }

// interface MapScreenProps {
//   location: Location.LocationObject | null;
//   goToFormPage: (id: number) => void;
//   goToReviewsPage: (id: number) => void;
// }

// const MapScreen: React.FC<MapScreenProps> = ({ location, goToFormPage, goToReviewsPage }) => {
//   const [washrooms, setWashrooms] = useState<Washroom[]>([]); //array of washrooms
//   const [mapType, setMapType] = useState(false)

//   useEffect(() => {
//     const fetchWashrooms = async () => {
//       try {
//         const response = await axios.get('http://172.20.10.3:8000/test.php/washroomData');
//         console.log('API response data:', response.data);
//         setWashrooms(response.data);
//       } catch (error) {
//         console.error('Error fetching washrooms data: ', error);
//       }
//     };

//     fetchWashrooms();
//   }, []);


//     // Function to determine marker image based on coordinates
//     const getMarkerImage = (
//       category: string, 
//       openHour: number | null,
//       closeHour: number | null,
//       score: number | null
//     )
//     : any => {

//       if(!mapType){
//         if(category == "Comfort Station") {
//           if(openHour!=null && closeHour != null && new Date().getHours() > openHour && new Date().getHours() < closeHour) {
//             return require('./comfortBlue.png');
//           } else {
//             return require('./comfortGray.png');
//           }
//         }
//         else {
//           if(openHour!=null && closeHour != null && new Date().getHours() > openHour && new Date().getHours() < closeHour) {
//             return require('./portaBlue.png');
//           } else {
//             return require('./portaGray.png');
//           }
//         }
//       }

//       if(mapType) {
//         if(category == "Comfort Station") {
//           if(score != null) {
//             if(score>=4) {
//               return require('./comfortGreen.png')
//             }
//             else if(score > 2.5) {
//               return require('./comfortYellow.png')
//             }
//             else {
//               return require('./comfortRed.png')
//             }
//           }
//         } else {
//           if(score != null) {
//             if(score>=4) {
//               return require('./portaGreen.png')
//             }
//             else if(score > 2.5) {
//               return require('./portaYellow.png')
//             }
//             else {
//               return require('./portaRed.png')
//             }
//           }
//         }
//       }
//     };

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
//                 {/* Custom marker with image */}
//                 <Image
//                   source={getMarkerImage(washroom.category, washroom.openHour, washroom.closeHour, washroom.score)}
//                   style={{ width: 45, height: 45, resizeMode: 'contain'}}
//                 />

//                 {/* Callout with information */}
//                 <Callout tooltip>
//                   <View style={styles.calloutContainer}>
//                     <Text style={styles.calloutText}>{washroom.washroomName}</Text>

//                     {washroom.openHour && washroom.closeHour ? (
//                         <Text>Hours: {washroom.openHour} - {washroom.closeHour}</Text>
//                       ) : null
//                     }

//                     {washroom.score ? (
//                         <Text>Overall Score: {washroom.score}</Text>
//                       ) : null
//                     }

//                     <TouchableOpacity style={styles.button} onPress={() => goToFormPage(washroom.washroomId)}>
//                       <Text style={styles.buttonText}>Tap In / Rate Washroom</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.button} onPress={() => goToReviewsPage(washroom.washroomId)}>
//                       <Text style={styles.buttonText}>See / Write Review</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </Callout>
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
//   calloutContainer: {
//     minWidth: 150,
//     maxWidth: 300,
//     padding: 10,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   calloutText: {
//     fontSize: 16,
//     marginBottom: 5,
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
//     fontSize: 16,
//   },
// });

// export default MapScreen;


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
  const [mapType, setMapType] = useState(false); // Change to boolean

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

    fetchWashrooms();
  }, []);

  const getMarkerImage = (
    category: string,
    openHour: number | null,
    closeHour: number | null,
    score: number | null
  ): any => {
    const currentHour = new Date().getHours();

    if (mapType) { // Score map
      if(score != null) {
        if (category === "Comfort Station") {
            if (score >= 4) return require('./comfortGreen.png');
            else if (score > 2.5) return require('./comfortYellow.png');
            else return require('./comfortRed.png');
          }
         else {
            if (score >= 4) return require('./portaGreen.png');
            else if (score > 2.5) return require('./portaYellow.png');
            else return require('./portaRed.png');
          }
        }
      else {
        if (category === "Comfort Station") {
          return require('./comfortGray.png');
        } else {
          return require('./portaGray.png');
        }
      }
    } else { // Open/Close map
      if (category === "Comfort Station") {
        if (openHour != null && closeHour != null && currentHour > openHour && currentHour < closeHour) {
          return require('./comfortBlue.png');
        } else {
          return require('./comfortGray.png');
        }
      } else {
        if (openHour != null && closeHour != null && currentHour > openHour && currentHour < closeHour) {
          return require('./portaGray.png');
        } else {
          return require('./portaBlue.png');
        }
      }
    }
  };

  const toggleMapType = () => {
    setMapType(prevType => !prevType);
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
                  source={getMarkerImage(washroom.category, washroom.openHour, washroom.closeHour, washroom.score)}
                  style={{ width: 45, height: 45, resizeMode: 'contain' }}
                />

                {/* Callout with information */}
                <Callout tooltip>
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
                  </View>
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
});

export default MapScreen;
