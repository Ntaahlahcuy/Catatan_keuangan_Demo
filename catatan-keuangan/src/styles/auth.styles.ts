import { StyleSheet } from 'react-native';

// External styling: Form masuk dan daftar akun.
export const authStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  brand: { textAlign: 'center', color: '#047857', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  title: { marginTop: 10, textAlign: 'center', fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { textAlign: 'center', color: '#4B5563', fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 24 },
  label: { fontSize: 14, color: '#374151', fontWeight: '700', marginBottom: 6 },
  inputWrapper: { minHeight: 54, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 4, marginBottom: 12, backgroundColor: '#F9FAFB' },
  input: { flex: 1, minWidth: 0, fontSize: 16, color: '#111827', marginLeft: 10, paddingVertical: 12 },
  eyeButton: { minWidth: 48, minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#B91C1C', backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginBottom: 12, lineHeight: 20 },
  success: { color: '#065F46', backgroundColor: '#ECFDF5', borderRadius: 10, padding: 12, marginBottom: 12, lineHeight: 20 },
  primaryButton: { minHeight: 52, borderRadius: 14, backgroundColor: '#047857', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  switchButton: { alignItems: 'center', minHeight: 48, justifyContent: 'center', paddingVertical: 16 },
  switchText: { color: '#4B5563', fontSize: 14 },
  switchTextBold: { color: '#047857', fontWeight: '800' },
  infoBox: { flexDirection: 'row', gap: 9, backgroundColor: '#ECFDF5', borderRadius: 12, padding: 12, alignItems: 'flex-start' },
  infoText: { flex: 1, color: '#065F46', fontSize: 13, lineHeight: 20 },
});
