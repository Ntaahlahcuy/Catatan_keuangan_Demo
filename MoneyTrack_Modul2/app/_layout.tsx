import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MoneyProvider } from '@/context/MoneyContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { BackButton } from '@/components/UI';

function Navigation() {
  const { colors, darkMode } = useTheme();
  return <><StatusBar style={darkMode ? 'light' : 'dark'} />
    {/* RUBRIK: _layout.tsx + Stack.Screen mengatur judul dan hierarki layar. */}
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.bg }, headerTintColor: colors.text,
      headerShadowVisible: false, headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: colors.bg },
      headerLeft: () => <BackButton /> }}>
      <Stack.Screen name="index" options={{ title: 'Money Track', headerLeft: () => null }} />
      <Stack.Screen name="tambah" options={{ title: 'Catat transaksi' }} />
      <Stack.Screen name="riwayat" options={{ title: 'Riwayat transaksi' }} />
      <Stack.Screen name="transaksi/[id]" options={{ title: 'Detail transaksi' }} />
      <Stack.Screen name="anggaran" options={{ title: 'Anggaran & pengaturan' }} />
      <Stack.Screen name="usecontext_example" options={{ title: 'Tampilan aplikasi' }} />
      <Stack.Screen name="docs" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Halaman tidak tersedia' }} />
    </Stack></>;
}
export default function RootLayout() {
  return <SafeAreaProvider><ThemeProvider><MoneyProvider><Navigation /></MoneyProvider></ThemeProvider></SafeAreaProvider>;
}
