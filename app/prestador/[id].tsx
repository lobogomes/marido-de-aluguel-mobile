import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Image, FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { MOCK_PROVIDERS } from '../../src/data/providers';
import { StarRating } from '../../src/components/StarRating';
import { useBooking } from '../../src/contexts/BookingContext';

export default function PrestadorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setPendingBooking } = useBooking();
  const provider = MOCK_PROVIDERS.find(p => p.id === id);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text>Profissional não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleAgendar() {
    if (!selectedService) return;
    setPendingBooking({
      providerId: provider!.id,
      service: selectedService,
      estimatedPrice: provider!.priceRange.min,
    });
    router.push('/agendamento/novo');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header image / avatar */}
        <View style={styles.heroBg}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: provider.avatar }} style={styles.avatar} />
            {provider.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{provider.name}</Text>
            <StarRating rating={provider.rating} reviewCount={provider.reviewCount} size={14} />
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.location}>{provider.address}</Text>
              {provider.distance && (
                <Text style={styles.distance}> · {provider.distance.toFixed(1)} km</Text>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{provider.completedJobs}</Text>
              <Text style={styles.statLabel}>Serviços</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{provider.responseTime}</Text>
              <Text style={styles.statLabel}>Resposta</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>R${provider.priceRange.min}+</Text>
              <Text style={styles.statLabel}>A partir de</Text>
            </View>
          </View>

          {/* Availability */}
          <View style={[styles.availBadge, { backgroundColor: provider.available ? '#E8F8F1' : '#F5F5F5' }]}>
            <View style={[styles.availDot, { backgroundColor: provider.available ? Colors.success : Colors.textLight }]} />
            <Text style={[styles.availText, { color: provider.available ? Colors.success : Colors.textSecondary }]}>
              {provider.available ? 'Disponível agora' : 'Indisponível no momento'}
            </Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.bio}>{provider.bio}</Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços oferecidos</Text>
          <Text style={styles.serviceHint}>Selecione o serviço desejado</Text>
          {provider.services.map(service => (
            <TouchableOpacity
              key={service}
              style={[styles.serviceItem, selectedService === service && styles.serviceItemActive]}
              onPress={() => setSelectedService(s => s === service ? null : service)}
            >
              <View style={styles.serviceLeft}>
                <Ionicons
                  name={selectedService === service ? 'checkmark-circle' : 'radio-button-off'}
                  size={22}
                  color={selectedService === service ? Colors.primary : Colors.border}
                />
                <Text style={[styles.serviceText, selectedService === service && { color: Colors.primary, fontWeight: '700' }]}>
                  {service}
                </Text>
              </View>
              <Text style={styles.servicePrice}>R${provider.priceRange.min}+</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <View style={styles.ratingBig}>
              <Text style={styles.ratingBigNum}>{provider.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={18} color="#F39C12" />
            </View>
          </View>
          {provider.reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{review.clientName[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{review.clientName}</Text>
                  <Text style={styles.reviewService}>{review.service}</Text>
                </View>
                <View>
                  <StarRating rating={review.rating} size={12} showValue={false} />
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>A partir de</Text>
          <Text style={styles.price}>R$ {provider.priceRange.min}</Text>
        </View>
        <TouchableOpacity
          style={[styles.agendarBtn, (!provider.available || !selectedService) && styles.agendarBtnDisabled]}
          onPress={handleAgendar}
          disabled={!provider.available || !selectedService}
        >
          <Ionicons name="calendar-outline" size={20} color={Colors.white} />
          <Text style={styles.agendarText}>
            {!selectedService ? 'Selecione um serviço' : 'Agendar serviço'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  heroBg: {
    height: 160,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backBtn: {
    width: 40, height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  shareBtn: {
    width: 40, height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -50,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: Colors.white },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: -2,
    backgroundColor: Colors.white, borderRadius: 12,
  },
  profileInfo: { alignItems: 'center', gap: 6 },
  name: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 13, color: Colors.textSecondary },
  distance: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
  },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { fontSize: 13, fontWeight: '600' },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10 },
  bio: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  serviceHint: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12, marginTop: -4 },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  serviceItemActive: { borderColor: Colors.primary, backgroundColor: '#FFF5F2' },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  serviceText: { fontSize: 14, color: Colors.textPrimary, flex: 1 },
  servicePrice: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ratingBig: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingBigNum: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 14,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  reviewAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  reviewName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  reviewService: { fontSize: 12, color: Colors.textSecondary },
  reviewDate: { fontSize: 11, color: Colors.textLight, marginTop: 3 },
  reviewComment: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceLabel: { fontSize: 12, color: Colors.textSecondary },
  price: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  agendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  agendarBtnDisabled: { backgroundColor: Colors.textLight },
  agendarText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
