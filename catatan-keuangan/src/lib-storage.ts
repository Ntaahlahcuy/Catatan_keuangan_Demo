import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytes } from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { validateCredentials } from './lib/auth-validation';
import {
  secureSet, secureGet, secureDelete, privateSet, privateGet, privateDelete,
  readLegacyPassword, clearLegacyAuthentication,
} from './lib/secure-storage';
import type { Transaction } from './models/transaction';

export type UserProfile = { name: string; email: string };
export type StoredTransaction = Transaction;
export type UserSession = { token: string; email: string; expiresAt: number };
type PasswordVerifier = { salt: string; hash: string; iterations: number };

const KEYS = {
  profile: 'sakuin_profile_v2',
  credentials: 'sakuin_credentials_v2',
  session: 'sakuin_session_v2',
  transactions: '@sakuin/transactions_encrypted_v2',
};
const ITERATIONS = 120_000;
const SESSION_DURATION = 12 * 60 * 60 * 1000;

async function createVerifier(password: string): Promise<PasswordVerifier> {
  const salt = bytesToHex(getRandomBytes(16));
  const hash = bytesToHex(await pbkdf2Async(sha256, password, salt, { c: ITERATIONS, dkLen: 32 }));
  return { salt, hash, iterations: ITERATIONS };
}

function equalHashes(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function getProfile(): Promise<UserProfile | null> {
  const raw = await secureGet(KEYS.profile);
  if (!raw) return null;
  const value = JSON.parse(raw);
  if (typeof value?.name !== 'string' || typeof value?.email !== 'string') throw new Error('Profil tidak dapat dibaca.');
  return value;
}

export async function registerLocalUser(profile: UserProfile, password: string): Promise<void> {
  const error = validateCredentials(profile.email, password);
  if (error) throw new Error(error);
  if (!profile.name.trim() || profile.name.trim().length > 80) throw new Error('Nama wajib diisi dan maksimal 80 karakter.');
  if (await getProfile()) throw new Error('Akun sudah terdaftar di perangkat ini. Silakan masuk.');
  const credentials = await createVerifier(password);
  // Password asli tidak pernah ditulis ke disk.
  await secureSet(KEYS.credentials, JSON.stringify(credentials));
  await secureSet(KEYS.profile, JSON.stringify({ name: profile.name.trim(), email: profile.email.trim().toLowerCase() }));
  await secureDelete(KEYS.session);
}

export async function loginLocalUser(email: string, password: string): Promise<UserSession> {
  const error = validateCredentials(email, password);
  if (error) throw new Error(error);
  await secureDelete(KEYS.session);
  const profile = await getProfile();
  const raw = await secureGet(KEYS.credentials);
  if (!profile || !raw) throw new Error('Email atau password salah.');
  const verifier = JSON.parse(raw) as PasswordVerifier;
  if (typeof verifier.salt !== 'string' || typeof verifier.hash !== 'string'
    || !Number.isInteger(verifier.iterations) || verifier.iterations < ITERATIONS || verifier.iterations > 1_000_000) {
    throw new Error('Data akun tidak dapat dibaca.');
  }
  const hash = bytesToHex(await pbkdf2Async(sha256, password, verifier.salt, { c: verifier.iterations, dkLen: 32 }));
  if (!equalHashes(hash, verifier.hash) || profile.email !== email.trim().toLowerCase()) throw new Error('Email atau password salah.');
  const session: UserSession = {
    token: bytesToHex(getRandomBytes(32)), email: profile.email, expiresAt: Date.now() + SESSION_DURATION,
  };
  await secureSet(KEYS.session, JSON.stringify(session));
  return session;
}

export async function getSession(): Promise<UserSession | null> {
  const raw = await secureGet(KEYS.session);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as UserSession;
    const profile = await getProfile();
    if (!/^[a-f0-9]{64}$/.test(value.token) || !Number.isFinite(value.expiresAt)
      || value.expiresAt <= Date.now() || value.email !== profile?.email) {
      await secureDelete(KEYS.session);
      return null;
    }
    return value;
  } catch {
    await secureDelete(KEYS.session);
    return null;
  }
}

export async function isLoggedIn(): Promise<boolean> { return Boolean(await getSession()); }

export async function logoutLocalUser(): Promise<void> {
  await secureDelete(KEYS.session);
  await clearLegacyAuthentication();
}

export async function getTransactions(): Promise<StoredTransaction[]> {
  const raw = await privateGet(KEYS.transactions);
  if (!raw) return [];
  const transactions = JSON.parse(raw);
  if (!Array.isArray(transactions)) throw new Error('Data transaksi tidak dapat dibaca.');
  return transactions;
}

export async function saveTransactions(transactions: StoredTransaction[]): Promise<void> {
  await privateSet(KEYS.transactions, JSON.stringify(transactions));
}

export async function addTransaction(transaction: StoredTransaction): Promise<void> {
  if (!Number.isSafeInteger(transaction.amount) || transaction.amount <= 0) throw new Error('Nominal transaksi tidak valid.');
  const transactions = await getTransactions();
  await saveTransactions([{ ...transaction, source: 'local' }, ...transactions]);
}

// Menjaga akun/transaksi versi lama, lalu menghapus password plaintext dan session lama.
export async function migrateLegacyData(): Promise<void> {
  const oldProfile = await AsyncStorage.getItem('@sakuin/profile');
  if (oldProfile && !await getProfile()) {
    const oldPassword = await readLegacyPassword();
    if (!oldPassword) throw new Error('Akun lama tidak dapat dipindahkan. Kredensial tidak tersedia.');
    const profile = JSON.parse(oldProfile) as UserProfile;
    await secureSet(KEYS.credentials, JSON.stringify(await createVerifier(oldPassword)));
    await secureSet(KEYS.profile, JSON.stringify({ ...profile, email: profile.email.trim().toLowerCase() }));
  }
  const oldTransactions = await AsyncStorage.getItem('@sakuin/transactions');
  if (oldTransactions && !await privateGet(KEYS.transactions)) {
    const items = JSON.parse(oldTransactions) as StoredTransaction[];
    // Contoh bawaan versi awal kini berasal dari API; catatan pengguna tetap disimpan.
    const defaults: Record<string, [string, number]> = { t1: ['Makan Siang', 25000], t2: ['Uang Saku', 500000], t3: ['Transportasi', 15000] };
    await saveTransactions(items.filter((item) => !(defaults[item.id]?.[0] === item.title && defaults[item.id]?.[1] === item.amount)));
  }
  await AsyncStorage.multiRemove(['@sakuin/profile', '@sakuin/transactions']);
  await clearLegacyAuthentication();
}

export async function resetLocalData(): Promise<void> {
  await logoutLocalUser();
  await secureDelete(KEYS.profile);
  await secureDelete(KEYS.credentials);
  await privateDelete(KEYS.transactions);
  await AsyncStorage.multiRemove(['@sakuin/profile', '@sakuin/transactions']);
}
