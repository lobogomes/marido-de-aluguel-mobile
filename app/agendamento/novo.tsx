import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useBooking } from '../../src/contexts/BookingContext';
import { URGENCY_OPTIONS } from '../../src/constants/categories';
import { UrgencyLevel } from '../../src/types';
import { MOCK_PROVIDERS } from '../../src/data/providers';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function getNextDays(n: number) {
  const days = [];
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toISOString().split('T')[0],
      day: d.getDate(),
      weekday: labels[d.getDay()],
      month: months[d.getMonth()],
    });
  }
  return days;
}

export default function NovoAgendamentoScreen() {
  const { pendingBooking, setPendingBooking, createBooking } = useBooking();
  const provider = MOCK_PROVIDERS.find(p => p.id === pendingBooking?.providerId);

  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState('Rua das Flores, 123 - Pinheiros, SP');
  const [description, setDescription] = useState('');

  const days = getNextDays(10);
  const urgencyOption = URGENCY_OPTIONS.find(o => o.id === urgency)!;
  const totalPrice = (pendingBooking?.estimatedPrice ?? 100) + urgencyOption.extraFee;

  async function handleConfirmar() {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Selecione data e horário.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Atenção', 'Informe o endereço de atendimento.');
      return;
    }

    const booking = await createBooking({
      providerId: pendingBooking!.providerId!,
      service: pendingBooking!.service!,
      urgency,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      address,
      description,
      estimatedPrice: totalPrice,
    });

    setPendingBooking(null);
    router.replace(`/pagamento/${booking.id}`);
  }

  if (!provider) {
    return (
      <View style={styles.center}>
        <Text>Dados inválidos.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Agendamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Provider & Service */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Serviço selecionado</Text>
          <View style={styles.providerRow}>
            <View style={styles.providerIcon}>
              <Ionicons name="construct" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.serviceName}>{pendingBooking?.service}</Text>
            </View>
          </View>
        </View>

        {/* Urgency */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Urgência</Text>
          {URGENCY_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.urgencyOption, urgency === opt.id && styles.urgencyOptionActive]}
              onPress={() => setUrgency(opt.id)}
            >
              <View style={[styles.urgencyDot, { backgroundColor: opt.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.urgencyLabel, urgency === opt.id && { color: Colors.primary }]}>
                  {opt.label}
                </Text>
                <Text style={styles.urgencyDesc}>{opt.description}</Text>
              </View>
              {opt.extraFee > 0 && (
                <Text style={[styles.urgencyFee, { color: opt.color }]}>+R${opt.extraFee}</Text>
              )}
              {urgency === opt.id && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
            {days.map(d => (
              <TouchableOpacity
                key={d.dateStr}
                style={[styles.dayBtn, selectedDate === d.dateStr && styles.dayBtnActive]}
                onPress={() => setSelectedDate(d.dateStr)}
              >
                <Text style={[styles.dayWeekday, selectedDate === d.dateStr && { color: 'rgba(255,255,255,0.8)' }]}>
                  {d.weekday}
                </Text>
                <Text style={[styles.dayNum, selectedDate === d.dateStr && { color: Colors.white }]}>
                  {d.day}
                </Text>
                <Text style={[styles.dayMonth, selectedDate === d.dateStr && { color: 'rgba(255,255,255,0.8)' }]}>
                  {d.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Horário</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.timeBtn, selectedTime === t && styles.timeBtnActive]}
                onPress={() => setSelectedTime(t)}
              >
                <Text style={[styles.timeText, selectedTime === t && { color: Colors.white }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Endereço de atendimento</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Rua, número, bairro"
              multiline
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descreva o problema</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o que precisa ser feito, quanto mais detalhes melhor..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Price summary */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <Text style={styles.cardTitle}>Resumo do valor</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceProp}>Serviço</Text>
            <Text style={styles.priceVal}>R$ {pendingBooking?.estimatedPrice ?? 100}</Text>
          </View>
          {urgencyOption.extraFee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceProp}>Taxa de urgência ({urgencyOption.label})</Text>
              <Text style={[styles.priceVal, { color: urgencyOption.color }]}>+R$ {urgencyOption.extraFee}</Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.priceTotal]}>
            <Text style={styles.priceTotalLabel}>Total estimado</Text>
            <Text style={styles.priceTotalVal}>R$ {totalPrice}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total estimado</Text>
          <Text style={styles.footerPrice}>R$ {totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmar} activeOpacity={0.85}>
          <Text style={styles.confirmText}>Confirmar agendamento</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  scroll: { flex: 1 },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  providerIcon: {
    width: 48, height: 48,
    backgroundColor: '#FFF0EB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  serviceName: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  urgencyOptionActive: { borderColor: Colors.primary, backgroundColor: '#FFF5F2' },
  urgencyDot: { width: 10, height: 10, borderRadius: 5 },
  urgencyLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  urgencyDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  urgencyFee: { fontSize: 14, fontWeight: '700' },
  dayBtn: {
    width: 62,
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  dayBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayWeekday: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  dayNum: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  dayMonth: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  timeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  textArea: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  priceProp: { fontSize: 14, color: Colors.textSecondary },
  priceVal: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  priceTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 14,
  },
  priceTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  priceTotalVal: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
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
  footerLabel: { fontSize: 12, color: Colors.textSecondary },
  footerPrice: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  confirmText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
