import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { ServiceCategory } from '../types';

type Props = {
  category: ServiceCategory;
  onPress: () => void;
  selected?: boolean;
  compact?: boolean;
};

export function CategoryCard({ category, onPress, selected = false, compact = false }: Props) {
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.chip, selected && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={category.icon as any}
          size={14}
          color={selected ? Colors.white : category.color}
        />
        <Text style={[styles.chipText, selected && { color: Colors.white }]}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconBox, { backgroundColor: `${category.color}20` }]}>
        <Ionicons name={category.icon as any} size={28} color={category.color} />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 80,
    alignItems: 'center',
    marginRight: 12,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    gap: 5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
