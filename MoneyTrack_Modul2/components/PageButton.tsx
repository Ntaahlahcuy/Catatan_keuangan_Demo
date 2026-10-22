import { Pressable } from 'react-native';
import { buttonStyles } from '@/styles';
import { useTheme } from '@/context/ThemeContext';
import { AppText } from './UI';

// Komponen eksternal yang dipakai kembali oleh halaman Codelab 2.
export default function PageButton({ title, onPress, secondary = false, danger = false, disabled = false }: {
  title: string; onPress: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean;
}) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={({ pressed }) => [buttonStyles.button, { backgroundColor: danger ? colors.dangerBg : secondary ? colors.soft : '#227650', opacity: disabled ? 0.5 : pressed ? 0.75 : 1 }]}>
    <AppText style={[buttonStyles.text, { color: danger ? colors.danger : secondary ? colors.green : '#FFFFFF' }]}>{title}</AppText>
  </Pressable>;
}
