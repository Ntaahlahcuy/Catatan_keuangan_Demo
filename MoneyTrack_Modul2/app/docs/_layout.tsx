import { Stack } from 'expo-router';
import { BackButton } from '@/components/UI';
import { useTheme } from '@/context/ThemeContext';
export default function DocsLayout() {
  const { colors } = useTheme();
  return <Stack screenOptions={{ headerStyle: { backgroundColor: colors.bg }, headerTintColor: colors.text, headerShadowVisible: false, headerLeft: () => <BackButton /> }}>
    <Stack.Screen name="index" options={{ title: 'Pusat bantuan' }} />
    <Stack.Screen name="[...slug]" options={{ title: 'Panduan hemat' }} />
  </Stack>;
}
