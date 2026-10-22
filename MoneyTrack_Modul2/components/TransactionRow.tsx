import { Pressable, View } from 'react-native';
import { AppText, Icon } from './UI';
import { useTheme } from '@/context/ThemeContext';
import type { Transaction } from '@/types/finance';
import { rupiah } from '@/utils/finance';

export default function TransactionRow({ transaction: t, onPress }: { transaction: Transaction; onPress: () => void }) {
  const { colors } = useTheme();
  const income = t.type === 'income';
  return <Pressable accessibilityRole="button" accessibilityLabel={`Detail ${t.title}`} onPress={onPress}
    style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border, opacity: pressed ? 0.6 : 1 })}>
    <View style={{ padding: 11, borderRadius: 14, backgroundColor: income ? colors.soft : colors.warningBg }}><Icon name={income ? 'arrow-down-outline' : 'arrow-up-outline'} color={income ? colors.green : colors.warning} /></View>
    <View style={{ flex: 1 }}><AppText style={{ fontWeight: '700' }}>{t.title}</AppText><AppText muted style={{ fontSize: 12 }}>{t.category} · {t.date}</AppText></View>
    <View style={{ alignItems: 'flex-end', maxWidth: '44%' }}><AppText style={{ fontWeight: '700', color: income ? colors.green : colors.text }}>{income ? '+' : '-'}{rupiah(t.amount)}</AppText>
      <AppText muted style={{ fontSize: 11 }}>{income ? 'Pemasukan' : t.kind === 'want' ? 'Keinginan' : 'Kebutuhan'}</AppText></View>
  </Pressable>;
}
