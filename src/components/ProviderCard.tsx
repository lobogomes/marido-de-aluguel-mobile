import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Provider } from '../types';
import { StarRating } from './StarRating';

type Props = {
  provider: Provider;
  onPress: () => void;
  horizontal?: boolean;
};

export function ProviderCard({ provider, onPress, horizontal = false }: Props) {
  if (horizontal) {
    return (
      <TouchableOpacity style={styles.cardH} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: provider.avatar }} style={styles.avatarH} />
        <View style={styles.infoH}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
            {provider.verified && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={{ marginLeft: 4 }} />
            )}
          </View>
          <Text style={styles.service} numberOfLines={1}>{provider.services[0]}</Text>
          <StarRating rating={provider.rating} reviewCount={provider.reviewCount} size={12} />
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
            <Text style={styles.meta}>{provider.distance?.toFixed(1)} km</Text>
            <Ionicons name="time-outline" size={12} color={Colors.textSecondary} style={{ marginLeft: 8 }} />
            <Text style={styles.meta}>{provider.responseTime}</Text>
          </View>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>a partir de</Text>
          <Text style={styles.price}>R${provider.priceRange.min}</Text>
          {provider.available ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Disponível</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeOff]}>
              <Text style={[styles.badgeText, { color: Colors.textSecondary }]}>Ocupado</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: provider.avatar }} style={styles.avatar} />
      {provider.verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
        </View>
      )}
      <Text style={styles.nameCenter} numberOfLines={1}>{provider.name}</Text>
      <StarRating rating={provider.rating} size={12} showValue={false} />
      <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
      <Text style={styles.jobsText}>{provider.completedJobs} serviços</Text>
      <Text style={styles.priceSmall}>R${provider.priceRange.min}+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 46,
    right: 32,
    backgroundColor: Colors.card,
    borderRadius: 10,
  },
  nameCenter: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  jobsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 6,
  },
  cardH: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  avatarH: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  infoH: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  service: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  meta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  badge: {
    backgroundColor: '#E8F8F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeOff: {
    backgroundColor: Colors.background,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600',
  },
});
