import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useBooking } from '../../src/contexts/BookingContext';
import { BookingCard } from '../../src/components/BookingCard';
import { BookingStatus } from '../../src/types';

const TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: 'Ativos', statuses: ['pendente', 'confirmado', 'em_andamento'] },
  { label: 'Concluídos', statuses: ['concluido'] },
  { label: 'Cancelados', statuses: ['cancelado'] },
];

export default function AgendamentosScreen() {
  const { bookings } = useBooking();
  const [activeTab, setActiveTab] = useState(0);

  const filtered = bookings.filter(b =>
    TABS[activeTab].statuses.includes(b.status)
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Agendamentos</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => router.push('/(tabs)/buscar')}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.label}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {bookings.filter(b => tab.statuses.includes(b.status)).length > 0 && (
              <View style={[styles.tabBadge, activeTab === i && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === i && { color: Colors.white }]}>
                  {bookings.filter(b => tab.statuses.includes(b.status)).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => {
              if (!item.paid && item.status !== 'cancelado') {
                router.push(`/pagamento/${item.id}`);
              }
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={72} color={Colors.border} />
            <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 0
                ? 'Você não tem agendamentos ativos. Que tal buscar um profissional?'
                : 'Nenhum registro aqui ainda.'}
            </Text>
            {activeTab === 0 && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(tabs)/buscar')}
              >
                <Text style={styles.emptyBtnText}>Buscar profissional</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  newBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    gap: 6,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  tabBadge: {
    backgroundColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  tabBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  list: { padding: 20 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
