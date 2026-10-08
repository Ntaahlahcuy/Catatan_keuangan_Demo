export function validateCredentials(email: string, password: string): string | null {
  if (!email.trim() || !password.trim()) return 'Email dan password wajib diisi.';
  if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Masukkan alamat email yang valid.';
  if (password.length < 6) return 'Password minimal 6 karakter.';
  if (password.length > 128) return 'Password maksimal 128 karakter.';
  return null;
}
