import { StyleSheet } from 'react-native';

// External styling: Halaman panduan aplikasi.
export const guideStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 24, maxWidth: 760, width: '100%', alignSelf: 'center' },
  back: { minHeight: 48, justifyContent: 'center', marginBottom: 20 },
  link: { color: '#047857', fontWeight: '700', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 24 },
  section: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  body: { fontSize: 16, lineHeight: 26, color: '#374151' },
});
