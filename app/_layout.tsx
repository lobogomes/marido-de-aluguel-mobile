import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { BookingProvider } from '../src/contexts/BookingContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <BookingProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="prestador/[id]"
              options={{ headerShown: false, presentation: 'card' }}
            />
            <Stack.Screen
              name="agendamento/novo"
              options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
              name="agendamento/confirmar"
              options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen
              name="pagamento/[id]"
              options={{ headerShown: false, presentation: 'modal' }}
            />
          </Stack>
        </BookingProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
