import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios';

const Form: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('other');
  const [bathroomRating, setBathroomRating] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerRunning]);

  useEffect(() => {
    if (bathroomRating !== null) {
      const sendRatingData = async () => {
        try {
          const response = await axios.post('http://172.20.10.3:8000/test.php/ratings', {
            reviewTimestamp: new Date(),
            gender: selectedGender,
            cleanliness: bathroomRating,
            waitTime: timerSeconds,
          });
          console.log('Rating data sent successfully:', response.data);
        } catch (error) {
          console.error('Error sending rating data:', error);
        }
      };

      sendRatingData();
    }
  }, [bathroomRating]);

  const handleStartTimer = () => {
    setTimerRunning(true);
    setTimerSeconds(0); // Reset the timer when starting
  };

  const handleRatingPress = (rating: number) => {
    setBathroomRating(rating);
  };

  const handleSubmit = () => {
    setTimerRunning(false); // Stop the timer
    setShowFeedback(true);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      {!showFeedback ? (
        <>
          <TouchableOpacity style={styles.startButton} onPress={handleStartTimer}>
            <Text style={styles.buttonText}>Start Wait Timer</Text>
          </TouchableOpacity>

          {timerRunning && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Timer: {timerSeconds} seconds</Text>
            </View>
          )}

          <View style={styles.ratingButtonsContainer}>
            <Text style={styles.label}>Rate Cleanliness</Text>
            <View style={styles.ratingButtons}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingButton, bathroomRating === rating && styles.selectedRating]}
                  onPress={() => handleRatingPress(rating)}
                >
                  <Text style={styles.buttonText}>{rating}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => setSelectedGender('female')}
            >
              <Text style={styles.buttonText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => setSelectedGender('male')}
            >
              <Text style={styles.buttonText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderButton}
              onPress={() => setSelectedGender('other')}
            >
              <Text style={styles.buttonText}>Other</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>Thanks for your feedback. You rated this bathroom a: {bathroomRating}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe4e1', // Pale pink background
  },
  startButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  timerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontFamily: 'Lato-Regular', // Use the loaded font
  },
  ratingButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  ratingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  ratingButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRating: {
    backgroundColor: '#ffa07a', // Light salmon color
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  genderButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular', // Use the loaded font
    textAlign: 'center',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
  },
});

export default Form;
