import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Booking } from '../types';

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Aguardando confirmação',
  confirmado: 'Confirmado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

const URGENCY_LABELS: Record<string, string> = {
  normal: 'Normal',
  urgente: 'Urgente',
  emergencia: 'Emergência',
};

type Props = {
  booking: Booking;
  onPress: () => void;
};

export function BookingCard({ booking, onPress }: Props) {
  const statusColor = Colors.status[booking.status];
  const urgencyColor = Colors.urgency[booking.urgency];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Image source={{ uri: booking.provider.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.providerName}>{booking.provider.name}</Text>
          <Text style={styles.service}>{booking.service}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABELS[booking.status]}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {booking.scheduledDate} às {booking.scheduledTime}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>{booking.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="warning-outline" size={15} color={urgencyColor} />
          <Text style={[styles.detailText, { color: urgencyColor, fontWeight: '600' }]}>
            {URGENCY_LABELS[booking.urgency]}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Total estimado</Text>
          <Text style={styles.price}>R$ {(booking.finalPrice ?? booking.estimatedPrice).toFixed(2)}</Text>
        </View>
        {!booking.paid && booking.status !== 'cancelado' && (
          <View style={styles.unpaidBadge}>
            <Ionicons name="card-outline" size={14} color={Colors.danger} />
            <Text style={styles.unpaidText}>Pagamento pendente</Text>
          </View>
        )}
        {booking.paid && (
          <View style={styles.paidBadge}>
            <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
            <Text style={styles.paidText}>Pago</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  service: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  details: {
    gap: 7,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  unpaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unpaidText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F8F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
});
