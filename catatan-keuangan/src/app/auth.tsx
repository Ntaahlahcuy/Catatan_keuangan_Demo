import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authStyles as styles } from '@/styles/auth.styles';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { validateCredentials } from '@/lib/auth-validation';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async () => {
    if (loading) return;
    setError(''); setSuccess('');
    const validation = validateCredentials(email, password);
    if (validation) { setError(validation); return; }
    if (isRegister && !name.trim()) { setError('Nama wajib diisi.'); return; }
    if (isRegister && password !== confirmation) { setError('Konfirmasi password belum sama.'); return; }
    try {
      setLoading(true);
      if (isRegister) {
        await register({ name: name.trim(), email: email.trim() }, password);
        // Week 3 Task 1: sesudah daftar, pengguna masuk melalui form login.
        setIsRegister(false); setPassword(''); setConfirmation(''); setShowPassword(false);
        setSuccess('Akun berhasil dibuat. Silakan masuk dengan email dan passwordmu.');
      } else {
        await login(email, password);
        setPassword(''); setShowPassword(false);
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Proses belum berhasil. Coba lagi.');
    } finally { setLoading(false); }
  };

  const switchMode = () => {
    setIsRegister((value) => !value);
    setError(''); setSuccess(''); setPassword(''); setConfirmation(''); setShowPassword(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.logoCircle}><Feather name="credit-card" size={30} color="#FFFFFF" /></View>
            <Text style={styles.brand}>SakuIn</Text>
            <Text style={styles.title} accessibilityRole="header">{isRegister ? 'Buat Akun' : 'Selamat Datang'}</Text>
            <Text style={styles.subtitle}>{isRegister ? 'Daftar untuk menyimpan catatan keuanganmu.' : 'Masuk untuk melanjutkan ke catatan keuanganmu.'}</Text>
            {isRegister && <>
              <Text style={styles.label}>Nama lengkap</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#6B7280" />
                <TextInput style={styles.input} placeholder="Nama lengkap" value={name} onChangeText={setName} autoCapitalize="words" maxLength={80} editable={!loading} accessibilityLabel="Nama lengkap" autoComplete="name" />
              </View>
            </>}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color="#6B7280" />
              <TextInput style={styles.input} placeholder="nama@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!loading} accessibilityLabel="Alamat email" autoComplete="email" />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color="#6B7280" />
              <TextInput style={styles.input} placeholder="Minimal 6 karakter" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} maxLength={128} editable={!loading} accessibilityLabel="Password" autoComplete={isRegister ? 'new-password' : 'current-password'} onSubmitEditing={() => { if (!isRegister) void submit(); }} />
              <Pressable onPress={() => setShowPassword((value) => !value)} style={styles.eyeButton} accessibilityRole="button" accessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} disabled={loading}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
              </Pressable>
            </View>
            {isRegister && <>
              <Text style={styles.label}>Konfirmasi password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#6B7280" />
                <TextInput style={styles.input} placeholder="Ulangi password" value={confirmation} onChangeText={setConfirmation} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} maxLength={128} editable={!loading} accessibilityLabel="Konfirmasi password" autoComplete="new-password" onSubmitEditing={() => void submit()} />
              </View>
            </>}
            {!!error && <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text>}
            {!!success && <Text style={styles.success} accessibilityLiveRegion="polite">{success}</Text>}
            <Pressable style={[styles.primaryButton, loading && { opacity: 0.7 }]} onPress={() => void submit()} disabled={loading} accessibilityRole="button" accessibilityLabel={isRegister ? 'Daftar akun' : 'Masuk ke akun'} accessibilityState={{ disabled: loading, busy: loading }}>
              {loading ? <ActivityIndicator color="#FFFFFF" accessibilityLabel="Memproses akun" /> : <Text style={styles.primaryText}>{isRegister ? 'Daftar' : 'Masuk'}</Text>}
            </Pressable>
            <Pressable style={styles.switchButton} onPress={switchMode} disabled={loading} accessibilityRole="button" accessibilityLabel={isRegister ? 'Buka halaman masuk' : 'Buka halaman daftar'}>
              <Text style={styles.switchText}>{isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}<Text style={styles.switchTextBold}>{isRegister ? 'Masuk' : 'Daftar'}</Text></Text>
            </Pressable>
            <View style={styles.infoBox}>
              <Feather name="shield" size={18} color="#047857" />
              <Text style={styles.infoText}>Akun ini tersimpan di perangkatmu. Gunakan email dan password yang sama untuk masuk kembali.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
