import { StyleSheet } from 'react-native';
export const pageStyles = StyleSheet.create({
  container: { flexGrow: 1, width: '100%', maxWidth: 680, alignSelf: 'center', padding: 22, paddingBottom: 40, gap: 18 },
  card: { padding: 20, borderRadius: 22, borderWidth: 1, gap: 12 },
  title: { fontSize: 30, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 22, lineHeight: 29, fontWeight: '700', letterSpacing: -0.4 },
  description: { fontSize: 15, lineHeight: 23 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, fontSize: 16, minHeight: 50 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 7 },
});
