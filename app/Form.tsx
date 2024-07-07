import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios';

interface FormProps {
  washroomId: number;
  submitForm: () => void;
}

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
  selectedGenderButton: {
    backgroundColor: '#ffa07a', // Light salmon color when selected
  },
  selectedGenderText: {
    color: 'white', // White text color when selected
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
});

export default Form;
