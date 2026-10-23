import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, SafeAreaView, Modal, ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { MOCK_PROVIDERS } from '../../src/data/providers';
import { SERVICE_CATEGORIES, URGENCY_OPTIONS } from '../../src/constants/categories';
import { ProviderCard } from '../../src/components/ProviderCard';
import { CategoryCard } from '../../src/components/CategoryCard';
import { FilterOptions, UrgencyLevel } from '../../src/types';

export default function BuscarScreen() {
  const params = useLocalSearchParams<{ q?: string; categoria?: string; sort?: string; urgencia?: string }>();
  const [search, setSearch] = useState(params.q ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.categoria ?? null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    minRating: 0,
    maxDistance: 50,
    sortBy: (params.sort as FilterOptions['sortBy']) ?? 'avaliacao',
    urgency: params.urgencia as UrgencyLevel | undefined,
  });

  const filtered = useMemo(() => {
    let list = [...MOCK_PROVIDERS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      list = list.filter(p => p.serviceCategories.includes(selectedCategory));
    }

    if (filters.minRating > 0) {
      list = list.filter(p => p.rating >= filters.minRating);
    }

    if (filters.maxDistance < 50) {
      list = list.filter(p => (p.distance ?? 0) <= filters.maxDistance);
    }

    list.sort((a, b) => {
      if (filters.sortBy === 'avaliacao') return b.rating - a.rating;
      if (filters.sortBy === 'distancia') return (a.distance ?? 0) - (b.distance ?? 0);
      if (filters.sortBy === 'preco') return a.priceRange.min - b.priceRange.min;
      return 0;
    });

    return list;
  }, [search, selectedCategory, filters]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.searchInput}>
            <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar serviço ou profissional..."
              autoFocus={!params.categoria}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
            <Ionicons name="options-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Categories horizontal */}
        <FlatList
          data={[{ id: '', name: 'Todos', icon: 'apps', color: Colors.primary, description: '' }, ...SERVICE_CATEGORIES]}
          keyExtractor={i => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              compact
              selected={selectedCategory === item.id || (item.id === '' && !selectedCategory)}
              onPress={() => setSelectedCategory(item.id === '' ? null : item.id)}
            />
          )}
        />
      </View>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.count}>{filtered.length} profissionais encontrados</Text>
        <Text style={styles.sortLabel}>
          Ordenado por: <Text style={{ color: Colors.primary, fontWeight: '700' }}>
            {filters.sortBy === 'avaliacao' ? 'Avaliação' : filters.sortBy === 'distancia' ? 'Distância' : 'Preço'}
          </Text>
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            horizontal
            onPress={() => router.push(`/prestador/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>Nenhum profissional encontrado</Text>
            <Text style={styles.emptyDesc}>Tente ajustar os filtros ou buscar por outro serviço</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={showFilter} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Ionicons name="close" size={26} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {/* Sort */}
            <Text style={styles.filterSection}>Ordenar por</Text>
            {(['avaliacao', 'distancia', 'preco'] as const).map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.filterOption, filters.sortBy === opt && styles.filterOptionActive]}
                onPress={() => setFilters(f => ({ ...f, sortBy: opt }))}
              >
                <Ionicons
                  name={opt === 'avaliacao' ? 'star' : opt === 'distancia' ? 'location' : 'pricetag'}
                  size={18}
                  color={filters.sortBy === opt ? Colors.primary : Colors.textSecondary}
                />
                <Text style={[styles.filterOptionText, filters.sortBy === opt && { color: Colors.primary }]}>
                  {opt === 'avaliacao' ? 'Melhor avaliação' : opt === 'distancia' ? 'Mais próximo' : 'Menor preço'}
                </Text>
                {filters.sortBy === opt && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
              </TouchableOpacity>
            ))}

            {/* Rating */}
            <Text style={styles.filterSection}>Avaliação mínima</Text>
            <View style={styles.ratingRow}>
              {[0, 3, 4, 4.5].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.ratingBtn, filters.minRating === r && styles.ratingBtnActive]}
                  onPress={() => setFilters(f => ({ ...f, minRating: r }))}
                >
                  <Text style={[styles.ratingBtnText, filters.minRating === r && { color: Colors.white }]}>
                    {r === 0 ? 'Todos' : `${r}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Distance */}
            <Text style={styles.filterSection}>Distância máxima</Text>
            <View style={styles.ratingRow}>
              {[2, 5, 10, 50].map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.ratingBtn, filters.maxDistance === d && styles.ratingBtnActive]}
                  onPress={() => setFilters(f => ({ ...f, maxDistance: d }))}
                >
                  <Text style={[styles.ratingBtnText, filters.maxDistance === d && { color: Colors.white }]}>
                    {d === 50 ? 'Qualquer' : `${d} km`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Urgency */}
            <Text style={styles.filterSection}>Urgência</Text>
            {URGENCY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.filterOption, filters.urgency === opt.id && styles.filterOptionActive]}
                onPress={() => setFilters(f => ({ ...f, urgency: f.urgency === opt.id ? undefined : opt.id }))}
              >
                <View style={[styles.urgencyDot, { backgroundColor: opt.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.filterOptionText, filters.urgency === opt.id && { color: Colors.primary }]}>{opt.label}</Text>
                  <Text style={styles.filterSubText}>{opt.description}</Text>
                </View>
                {filters.urgency === opt.id && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setFilters({ minRating: 0, maxDistance: 50, sortBy: 'avaliacao' })}
            >
              <Text style={styles.clearText}>Limpar filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  filterBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  catList: { paddingHorizontal: 16, paddingBottom: 12 },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  count: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  sortLabel: { fontSize: 12, color: Colors.textSecondary },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 },
  modal: { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalScroll: { flex: 1, padding: 20 },
  filterSection: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginTop: 20, marginBottom: 12 },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.background,
    marginBottom: 8,
  },
  filterOptionActive: { backgroundColor: '#FFF0EB', borderWidth: 1.5, borderColor: Colors.primary },
  filterOptionText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  filterSubText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  urgencyDot: { width: 10, height: 10, borderRadius: 5 },
  ratingRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  ratingBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  ratingBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  ratingBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  clearBtn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 14,
  },
  clearText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  applyBtn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
  },
  applyText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
