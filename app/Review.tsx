import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ReviewItem from './ReviewItem'; // Import the ReviewItem component

const dummyReviews = [
  { id: 1, review: 'Clean and well-maintained!' },
  { id: 2, review: 'Could be better. The soap dispenser was empty.' },
  { id: 3, review: 'Nice and clean, but the floor was a bit wet.' },
];

const Review: React.FC = () => {
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState(dummyReviews);

  const handleAddReview = () => {
    if (newReview.trim()) {
      const newReviewObject = { id: reviews.length + 1, review: newReview };
      setReviews([...reviews, newReviewObject]);
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
          <ReviewItem key={review.id} review={review.review} />
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
