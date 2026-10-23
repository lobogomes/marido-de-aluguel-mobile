import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

type Props = {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
};

export function StarRating({ rating, size = 14, showValue = true, reviewCount }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map(s => (
        <Ionicons
          key={s}
          name={s <= Math.floor(rating) ? 'star' : s - rating < 1 ? 'star-half' : 'star-outline'}
          size={size}
          color="#F39C12"
          style={{ marginRight: 1 }}
        />
      ))}
      {showValue && (
        <Text style={[styles.value, { fontSize: size }]}>
          {' '}{rating.toFixed(1)}
          {reviewCount !== undefined && (
            <Text style={styles.count}> ({reviewCount})</Text>
          )}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 2,
  },
  count: {
    fontWeight: '400',
    color: Colors.textSecondary,
  },
});
