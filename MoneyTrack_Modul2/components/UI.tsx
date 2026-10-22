import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, type TextProps, type TextInputProps, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useMoney } from '@/context/MoneyContext';
import { pageStyles as s } from '@/styles';

export function AppText(props: TextProps & { muted?: boolean }) {
  const { colors } = useTheme();
  const { muted, style, ...rest } = props;
  return <Text {...rest} style={[{ color: muted ? colors.muted : colors.text, fontSize: 15, lineHeight: 23 }, style]} />;
}
export function Card({ style, ...props }: ViewProps) {
  const { colors } = useTheme();
  return <View {...props} style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }, style]} />;
}
export function Screen({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const { ready, storageError } = useMoney();
  return <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.bg }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        {storageError ? <Card style={{ backgroundColor: colors.warningBg }}><AppText>{storageError}</AppText></Card> : null}
        {ready ? children : <ActivityIndicator color={colors.green} accessibilityLabel="Memuat data" />}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const { colors } = useTheme();
  return <View><AppText style={s.label}>{label}</AppText><TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.muted}
    style={[s.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }, props.style]} /></View>;
}
export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
    style={{ paddingHorizontal: 14, paddingVertical: 10, minHeight: 44, borderRadius: 30, backgroundColor: selected ? '#227650' : colors.card, borderColor: colors.border, borderWidth: 1 }}>
    <AppText style={{ fontSize: 13, fontWeight: '600', color: selected ? '#FFFFFF' : colors.text }}>{label}</AppText>
  </Pressable>;
}
export function Icon({ name, color, size = 22 }: { name: keyof typeof Ionicons.glyphMap; color?: string; size?: number }) {
  const { colors } = useTheme();
  return <Ionicons name={name} color={color ?? colors.green} size={size} />;
}
export function BackButton() {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel="Kembali" onPress={() => {
    // RUBRIK: back(), dengan canGoBack() dan replace() untuk tautan langsung.
    if (router.canGoBack()) router.back(); else router.replace('/');
  }} style={{ padding: 8, marginRight: 8 }}><Ionicons name="arrow-back" size={24} color={colors.text} /></Pressable>;
}
