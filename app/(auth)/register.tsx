import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';
import { UserType } from '../../src/types';

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState<UserType>('cliente');

  async function handleRegister() {
    if (!name || !email || !phone || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    try {
      await register({ name, email, phone, password, type });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a conta.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Que tipo de conta?</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'cliente' && styles.typeBtnActive]}
              onPress={() => setType('cliente')}
            >
              <Ionicons name="person-outline" size={22} color={type === 'cliente' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.typeText, type === 'cliente' && styles.typeTextActive]}>Cliente</Text>
              <Text style={[styles.typeDesc, type === 'cliente' && { color: 'rgba(255,255,255,0.8)' }]}>
                Contratar serviços
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'prestador' && styles.typeBtnActive]}
              onPress={() => setType('prestador')}
            >
              <Ionicons name="construct-outline" size={22} color={type === 'prestador' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.typeText, type === 'prestador' && styles.typeTextActive]}>Prestador</Text>
              <Text style={[styles.typeDesc, type === 'prestador' && { color: 'rgba(255,255,255,0.8)' }]}>
                Oferecer serviços
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Dados pessoais</Text>

          {[
            { label: 'Nome completo', value: name, setter: setName, icon: 'person-outline', placeholder: 'Seu nome' },
            { label: 'E-mail', value: email, setter: setEmail, icon: 'mail-outline', placeholder: 'seu@email.com', keyboardType: 'email-address' },
            { label: 'WhatsApp', value: phone, setter: setPhone, icon: 'call-outline', placeholder: '(11) 99999-0000', keyboardType: 'phone-pad' },
            { label: 'Senha', value: password, setter: setPassword, icon: 'lock-closed-outline', placeholder: 'Crie uma senha', secure: true },
          ].map((field) => (
            <View key={field.label} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={field.icon as any} size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  secureTextEntry={field.secure}
                  keyboardType={(field as any).keyboardType || 'default'}
                  autoCapitalize="none"
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.btnText}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
            <Text style={styles.loginLinkText}>
              Já tem conta? <Text style={{ color: Colors.primary }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.white },
  form: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingTop: 32,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  typeBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 6,
  },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  typeTextActive: { color: Colors.white },
  typeDesc: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginLinkText: { fontSize: 14, color: Colors.textSecondary },
});
