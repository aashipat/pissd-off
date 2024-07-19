import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import ReviewItem from './ReviewItem'; // Ensure this import is correct

interface ReviewProps {
  washroomId: number;
  goBackToMap: () => void;
}

interface ReviewItemInterface {
  reviewText: string;
}

const Review: React.FC<ReviewProps> = ({ washroomId, goBackToMap }) => {
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState<ReviewItemInterface[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://172.20.10.3:8000/test.php/reviews?washroomId=${washroomId}`);
        console.log('API response data:', response.data);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching Review data:', error);
      }
    };
    fetchReviews();
  }, [washroomId]);

  const sendNewReview = async () => {
    if (newReview.trim()) {
      try {
        const response = await axios.post('http://172.20.10.3:8000/test.php/reviews', {
          text: newReview,
          washroomId: washroomId
        });
        console.log('Review data sent successfully:', response.data);
        
        // Update the reviews state with the new review
        setReviews(prevReviews => [...prevReviews, { reviewText: newReview }]);
        setNewReview('');
      } catch (error) {
        console.error('Error sending review data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Write your review here..."
        value={newReview}
        onChangeText={setNewReview}
      />
      <TouchableOpacity style={styles.submitButton} onPress={sendNewReview}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <ScrollView style={styles.reviewsContainer}>
        {reviews.map((review, index) => (
          <ReviewItem key={index} review={review.reviewText} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffe4e1', // Pale pink background
  },
  textInput: {
    height: 40,
    borderColor: '#ffb6c1', // Light pastel color
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#ffb6c1', // Light pastel color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  reviewsContainer: {
    marginTop: 20,
  },
});

export default Review;
