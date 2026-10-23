import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { useBooking } from '../../src/contexts/BookingContext';
import { StarRating } from '../../src/components/StarRating';

type MenuItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  value?: string;
};

function MenuItem({ icon, label, onPress, danger, value }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Ionicons name={icon as any} size={20} color={danger ? Colors.danger : Colors.primary} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();

  const completed = bookings.filter(b => b.status === 'concluido').length;

  function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarBox}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.userTypeBadge}>
            <Text style={styles.userTypeText}>
              {user?.type === 'prestador' ? 'Prestador de Serviços' : 'Cliente'}
            </Text>
          </View>

          {user?.type === 'prestador' && user.rating && (
            <View style={{ marginTop: 8 }}>
              <StarRating rating={user.rating} reviewCount={user.completedJobs} />
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completed}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{bookings.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user?.rating?.toFixed(1) ?? '—'}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{user?.phone}</Text>
          </View>
          {user?.address && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{user.address}</Text>
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={styles.card}>
          <Text style={styles.menuSection}>Conta</Text>
          <MenuItem icon="person-outline" label="Editar perfil" onPress={() => {}} />
          <MenuItem icon="notifications-outline" label="Notificações" onPress={() => {}} />
          <MenuItem icon="card-outline" label="Formas de pagamento" onPress={() => {}} />
          <MenuItem icon="location-outline" label="Endereços salvos" onPress={() => {}} />
        </View>

        <View style={styles.card}>
          <Text style={styles.menuSection}>Suporte</Text>
          <MenuItem icon="help-circle-outline" label="Central de ajuda" onPress={() => {}} />
          <MenuItem icon="star-outline" label="Avaliar o app" onPress={() => {}} />
          <MenuItem icon="shield-outline" label="Política de privacidade" onPress={() => {}} />
          <MenuItem icon="document-text-outline" label="Termos de uso" onPress={() => {}} />
        </View>

        <View style={[styles.card, { marginBottom: 32 }]}>
          <MenuItem icon="log-out-outline" label="Sair da conta" onPress={handleLogout} danger />
        </View>

        <Text style={styles.version}>Marido de Aluguel v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  profileHeader: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarBox: { position: 'relative', marginBottom: 14 },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: Colors.white },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  userTypeBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  userTypeText: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 40,
    gap: 0,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border, alignSelf: 'stretch', marginVertical: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoText: { fontSize: 14, color: Colors.textPrimary, flex: 1 },
  menuSection: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#FFF0EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: { backgroundColor: '#FFF0F0' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  menuLabelDanger: { color: Colors.danger },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13, color: Colors.textSecondary },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textLight, marginBottom: 24 },
});
