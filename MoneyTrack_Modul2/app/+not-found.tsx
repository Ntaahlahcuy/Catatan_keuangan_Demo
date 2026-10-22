import { router } from 'expo-router';
import { Screen, AppText, Card } from '@/components/UI';
import PageButton from '@/components/PageButton';
export default function NotFound() {
  return <Screen><Card><AppText>Halaman tidak ditemukan. Kembali ke beranda untuk melanjutkan.</AppText><PageButton title="Ke beranda" onPress={() => router.replace('/')} /></Card></Screen>;
}
