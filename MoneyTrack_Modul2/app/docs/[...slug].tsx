import { router, Stack, useLocalSearchParams } from 'expo-router';
import { AppText, Card, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import { guides } from '@/constants/guides';
import { pageStyles } from '@/styles';

export default function GuidePage() {
  // CODELAB 2: catch-all menerima banyak segmen; [id] hanya satu segmen.
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const path = Array.isArray(slug) ? slug.join('/') : slug ?? '';
  const guide = guides[path];
  if (!guide) return <Screen><Card><AppText>Panduan tidak ditemukan.</AppText><PageButton title="Daftar panduan" onPress={() => router.replace('/docs')} /></Card></Screen>;
  return <Screen><Stack.Screen options={{ title: guide.title }} />
    <AppText style={pageStyles.title}>{guide.title}</AppText><AppText muted>{guide.intro}</AppText>
    <Card>{guide.points.map((point, index) => <AppText key={point}>{index + 1}. {point}</AppText>)}</Card>
    <AppText muted style={{ fontSize: 12 }}>Money Track · Catat, cek, kendalikan.</AppText>
  </Screen>;
}
