import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { AppText, Card, Icon, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import { pageStyles } from '@/styles';

// CODELAB 1: Provider ada di app/_layout.tsx. Tidak ada prop drilling.
// Home -> Profile -> UserCard -> UserName mengambil tema dari context.
export default function Home() { return <Screen><Profile /></Screen>; }
function Profile() { return <UserCard />; }
function UserCard() { return <UserName />; }
function UserName() {
  const { darkMode, toggleTheme } = useTheme();
  return <><View><AppText style={pageStyles.title}>Nyaman di mata.</AppText><AppText muted>Pilih tampilan yang paling nyaman buatmu.</AppText></View>
    <Card><Icon name={darkMode ? 'moon-outline' : 'sunny-outline'} size={40} />
      <AppText style={pageStyles.subtitle}>{darkMode ? 'Dark Mode' : 'Light Mode'}</AppText>
      <AppText muted>Warna beranda, riwayat, dan halaman lain ikut berubah.</AppText>
      <PageButton title="Toggle Theme" onPress={toggleTheme} /></Card></>;
}
