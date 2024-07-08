import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

interface FormProps {
  washroomId: number;
  submitForm: () => void;
}

const TIMER_TASK = 'background-timer-task';

TaskManager.defineTask(TIMER_TASK, async () => {
  try {
    const timerStartTime = await AsyncStorage.getItem('timerStartTime');
    if (timerStartTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor((currentTime - parseInt(timerStartTime)) / 1000);
      await AsyncStorage.setItem('timerSeconds', elapsedTime.toString());
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const Form: React.FC<FormProps> = ({ washroomId, submitForm }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('other');
  const [bathroomRating, setBathroomRating] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showTimerMessage, setShowTimerMessage] = useState(false);

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
    const checkStoredTimer = async () => {
      const storedTimerRunning = await AsyncStorage.getItem('timerRunning');
      const storedTimerSeconds = await AsyncStorage.getItem('timerSeconds');
      if (storedTimerRunning === 'true' && storedTimerSeconds) {
        setTimerRunning(true);
        setTimerSeconds(parseInt(storedTimerSeconds));
      }
    };
    checkStoredTimer();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' && timerRunning) {
        await AsyncStorage.setItem('timerStartTime', new Date().getTime().toString());
      }
      if (nextAppState === 'active') {
        const timerStartTime = await AsyncStorage.getItem('timerStartTime');
        if (timerStartTime) {
          const currentTime = new Date().getTime();
          const elapsedTime = Math.floor((currentTime - parseInt(timerStartTime)) / 1000);
          setTimerSeconds(timerSeconds + elapsedTime);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [timerRunning, timerSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      AsyncStorage.setItem('timerRunning', 'true');
    } else if (interval) {
      clearInterval(interval);
      AsyncStorage.setItem('timerRunning', 'false');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerRunning]);

  useEffect(() => {
    AsyncStorage.setItem('timerSeconds', timerSeconds.toString());
  }, [timerSeconds]);

  const handleToggleTimer = () => {
    if (!timerRunning) {
      setTimerRunning(true);
      setTimerSeconds(0); // Reset the timer when starting
    } else {
      setTimerRunning(false);
      setShowTimerMessage(true); // Show the timer message when stopping
    }
  };

  const handleRatingPress = (rating: number) => {
    setBathroomRating(rating);
  };

  const handleGenderPress = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleSubmit = async () => {
    // Send to backend
    try {
      const response = await axios.post('http://172.20.10.3:8000/test.php/ratings', {
        washroomId: washroomId,
        reviewTimestamp: new Date(),
        gender: selectedGender,
        cleanliness: bathroomRating,
        waitTime: timerSeconds,
      });
      console.log('Rating data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending rating data:', error);
    }

    submitForm();
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      {!showTimerMessage ? (
        <TouchableOpacity
          style={[styles.startButton, timerRunning && styles.stopButton]} // Conditional style for Start/Stop button
          onPress={handleToggleTimer}
        >
          <Text style={styles.buttonText}>
            {timerRunning ? 'Stop Wait Timer' : 'Start Wait Timer'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.timerMessageContainer}>
          <Text style={styles.timerMessage}>
            You waited in line for: {timerSeconds} seconds
          </Text>
        </View>
      )}

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
          style={[styles.genderButton, selectedGender === 'female' && styles.selectedGenderButton]}
          onPress={() => handleGenderPress('female')}
        >
          <Text style={[styles.buttonText, selectedGender === 'female' && styles.selectedGenderText]}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, selectedGender === 'male' && styles.selectedGenderButton]}
          onPress={() => handleGenderPress('male')}
        >
          <Text style={[styles.buttonText, selectedGender === 'male' && styles.selectedGenderText]}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, selectedGender === 'other' && styles.selectedGenderButton]}
          onPress={() => handleGenderPress('other')}
        >
          <Text style={[styles.buttonText, selectedGender === 'other' && styles.selectedGenderText]}>Other</Text>
        </TouchableOpacity>
      </View>

      {<TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={timerRunning} // Disable submit when timer is running
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      }
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
  stopButton: {
    backgroundColor: '#ff6347', // Light coral color
  },
  timerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontFamily: 'Lato-Regular', // Use the loaded font
  },
  timerMessageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerMessage: {
    fontSize: 18,
    fontFamily: 'Lato-Bold', // Use the loaded font for emphasis
    textAlign: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  selectedRating: {
    backgroundColor: '#ff69b4', // Highlight selected rating
  },
  buttonText: {
    fontFamily: 'Lato-Regular', // Use the loaded font
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Lato-Bold', // Use the loaded font
    fontSize: 18,
  },
  genderButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedGenderButton: {
    backgroundColor: '#ff69b4', // Highlight selected gender
  },
  selectedGenderText: {
    fontFamily: 'Lato-Bold', // Use the loaded font for emphasis
  },
  submitButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default Form;
