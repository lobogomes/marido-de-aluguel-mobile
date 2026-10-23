import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { SERVICE_CATEGORIES } from '../../src/constants/categories';
import { MOCK_PROVIDERS } from '../../src/data/providers';
import { ProviderCard } from '../../src/components/ProviderCard';
import { CategoryCard } from '../../src/components/CategoryCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const topProviders = [...MOCK_PROVIDERS]
    .filter(p => p.available)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const nearbyProviders = [...MOCK_PROVIDERS]
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    .slice(0, 5);

  function handleSearch() {
    if (search.trim()) {
      router.push({ pathname: '/(tabs)/buscar', params: { q: search } });
    }
  }

  function handleCategoryPress(categoryId: string) {
    router.push({ pathname: '/(tabs)/buscar', params: { categoria: categoryId } });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}!</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.location}>{user?.city ?? 'São Paulo, SP'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <TouchableOpacity style={styles.searchInput} onPress={() => router.push('/(tabs)/buscar')} activeOpacity={0.8}>
            <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>Buscar serviço ou profissional...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={() => router.push('/(tabs)/buscar')}>
            <Ionicons name="options-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Banner urgency */}
        <View style={styles.urgencyBanner}>
          <View style={styles.urgencyInfo}>
            <Text style={styles.urgencyTitle}>Precisa agora?</Text>
            <Text style={styles.urgencyDesc}>Profissionais disponíveis em até 1 hora</Text>
          </View>
          <TouchableOpacity
            style={styles.urgencyBtn}
            onPress={() => router.push({ pathname: '/(tabs)/buscar', params: { urgencia: 'emergencia' } })}
          >
            <Ionicons name="flash" size={16} color={Colors.primary} />
            <Text style={styles.urgencyBtnText}>Ver</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/buscar')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={SERVICE_CATEGORIES}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <CategoryCard category={item} onPress={() => handleCategoryPress(item.id)} />
            )}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
          />
        </View>

        {/* Top Rated */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mais bem avaliados</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/buscar', params: { sort: 'avaliacao' } })}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topProviders}
            keyExtractor={i => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProviderCard
                provider={item}
                onPress={() => router.push(`/prestador/${item.id}`)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}
          />
        </View>

        {/* Nearby */}
        <View style={[styles.section, { marginBottom: 24 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Perto de você</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/buscar', params: { sort: 'distancia' } })}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            {nearbyProviders.map(p => (
              <ProviderCard
                key={p.id}
                provider={p}
                horizontal
                onPress={() => router.push(`/prestador/${p.id}`)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 70,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.white },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  location: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  notifBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: '#FFD700',
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  searchBox: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    gap: 10,
  },
  searchPlaceholder: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  filterBtn: {
    width: 52,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  urgencyBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFF5F0',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFD5C2',
  },
  urgencyInfo: { flex: 1 },
  urgencyTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  urgencyDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  urgencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  urgencyBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
