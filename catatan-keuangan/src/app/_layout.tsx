import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, Pressable, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

void SplashScreen.preventAutoHideAsync().catch(() => {});

function AuthGate() {
  const { loading, session, error, retry } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator accessibilityLabel="Memeriksa sesi login" color="#047857" /></View>;
  if (error) return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Text accessibilityRole="alert" style={{ textAlign: 'center', color: '#B91C1C' }}>{error}</Text>
      <Pressable onPress={() => void retry()} accessibilityRole="button" style={{ padding: 16 }}><Text>Coba lagi</Text></Pressable>
    </View>
  );
  // Protected menghapus halaman privat dari riwayat navigasi ketika logout.
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
    <Stack.Protected guard={!!session}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
    </Stack.Protected>
    <Stack.Protected guard={!session}>
      <Stack.Screen name="auth" />
    </Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <AnimatedSplashOverlay />
          <AuthGate />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
