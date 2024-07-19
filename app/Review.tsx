import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ReviewItem from './ReviewItem'; // Import the ReviewItem component
import axios from 'axios';

interface ReviewProps {
  washroomId: number;
  goBackToMap: () => void;
}

interface ReviewItem {
  reviewText: string;
}

const Review: React.FC<ReviewProps> = ({washroomId, goBackToMap}) => {
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://172.20.10.3:8000/test.php/reviews?washroomID=${washroomId}`);
        console.log('API response data:', response.data);
        setReviews(response.data)
      } catch (error) {
        console.error('Error fetching washrooms data: ', error);
      }
    };
  }, []);


  const handleAddReview = () => {
    if (newReview.trim()) {
      const newReviewObject = {review: newReview };
      setNewReview('');
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
      <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <ScrollView style={styles.reviewsContainer}>
        {reviews.map((review) => (
          <ReviewItem review={review.reviewText} />
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
