import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReviewItemProps {
  review: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <View style={styles.review}>
      <Text>{review}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  review: {
    backgroundColor: '#fff0f5', // Light pastel color
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default ReviewItem;
