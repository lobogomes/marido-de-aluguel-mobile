import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useBooking } from '../../src/contexts/BookingContext';
import { PaymentMethod } from '../../src/types';

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pix', type: 'pix', label: 'PIX', icon: 'qr-code', last4: undefined },
  { id: 'credit1', type: 'credito', label: 'Cartão de crédito', icon: 'card', last4: '4242' },
  { id: 'debit1', type: 'debito', label: 'Cartão de débito', icon: 'card-outline', last4: '1234' },
];

export default function PagamentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings, payBooking } = useBooking();
  const booking = bookings.find(b => b.id === id);

  const [selectedMethod, setSelectedMethod] = useState<string>('pix');
  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text>Agendamento não encontrado.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/agendamentos')}>
          <Text style={{ color: Colors.primary }}>Ver agendamentos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handlePagar() {
    setLoading(true);
    try {
      await payBooking(booking!.id, selectedMethod);
      router.replace('/(tabs)/agendamentos');
      Alert.alert('Pagamento realizado!', 'Seu agendamento foi confirmado. O profissional entrará em contato em breve.');
    } catch {
      Alert.alert('Erro', 'Falha ao processar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const urgencyLabels: Record<string, string> = {
    normal: 'Normal',
    urgente: 'Urgente',
    emergencia: 'Emergência',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Order summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo do serviço</Text>

          <View style={styles.summaryItem}>
            <Ionicons name="person-outline" size={18} color={Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Profissional</Text>
              <Text style={styles.summaryValue}>{booking.provider.name}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="construct-outline" size={18} color={Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Serviço</Text>
              <Text style={styles.summaryValue}>{booking.service}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Data e horário</Text>
              <Text style={styles.summaryValue}>{booking.scheduledDate} às {booking.scheduledTime}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Endereço</Text>
              <Text style={styles.summaryValue} numberOfLines={2}>{booking.address}</Text>
            </View>
          </View>

          <View style={[styles.summaryItem, { borderBottomWidth: 0 }]}>
            <Ionicons
              name="warning-outline"
              size={18}
              color={Colors.urgency[booking.urgency]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Urgência</Text>
              <Text style={[styles.summaryValue, { color: Colors.urgency[booking.urgency] }]}>
                {urgencyLabels[booking.urgency]}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Forma de pagamento</Text>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodItem, selectedMethod === method.id && styles.methodItemActive]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.methodIcon, selectedMethod === method.id && styles.methodIconActive]}>
                <Ionicons
                  name={method.icon as any}
                  size={22}
                  color={selectedMethod === method.id ? Colors.white : Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodLabel, selectedMethod === method.id && { color: Colors.primary }]}>
                  {method.label}
                </Text>
                {method.last4 && (
                  <Text style={styles.methodSub}>···· ···· ···· {method.last4}</Text>
                )}
                {method.type === 'pix' && (
                  <Text style={styles.methodSub}>Pagamento instantâneo</Text>
                )}
              </View>
              {selectedMethod === method.id ? (
                <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              ) : (
                <Ionicons name="radio-button-off" size={22} color={Colors.border} />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addCardBtn}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.addCardText}>Adicionar cartão</Text>
          </TouchableOpacity>
        </View>

        {/* Total */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <Text style={styles.cardTitle}>Valor total</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Serviço</Text>
            <Text style={styles.totalValue}>R$ {booking.estimatedPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Taxa de serviço</Text>
            <Text style={styles.totalValue}>R$ 0,00</Text>
          </View>
          <View style={[styles.totalRow, styles.totalFinal]}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>R$ {booking.estimatedPrice.toFixed(2)}</Text>
          </View>

          {selectedMethod === 'pix' && (
            <View style={styles.pixInfo}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
              <Text style={styles.pixInfoText}>
                Após confirmar, você receberá o QR Code do PIX para efetuar o pagamento.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>R$ {booking.estimatedPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnDisabled]}
          onPress={handlePagar}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color={Colors.white} />
              <Text style={styles.payText}>Pagar agora</Text>
            </>
          )}
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
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryLabel: { fontSize: 12, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 2 },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  methodItemActive: { borderColor: Colors.primary, backgroundColor: '#FFF5F2' },
  methodIcon: {
    width: 44, height: 44,
    backgroundColor: '#FFF0EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconActive: { backgroundColor: Colors.primary },
  methodLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  methodSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  addCardText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: { fontSize: 14, color: Colors.textSecondary },
  totalValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  totalFinal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 14,
  },
  totalFinalLabel: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  totalFinalValue: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  pixInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EBF5FB',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  pixInfoText: { fontSize: 12, color: Colors.info, lineHeight: 18, flex: 1 },
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
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    minWidth: 150,
    justifyContent: 'center',
  },
  payBtnDisabled: { opacity: 0.7 },
  payText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
});
