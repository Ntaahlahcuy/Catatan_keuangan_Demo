import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AESEncryptionKey, AESSealedData, aesEncryptAsync, aesDecryptAsync } from 'expo-crypto';

// Week 3 Task 2: token, profil, dan verifier password berada di SecureStore.
export async function secureSet(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}

export async function secureGet(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function secureDelete(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

const DATA_KEY = 'sakuin_data_key_v2';
let keyPromise: Promise<AESEncryptionKey> | undefined;
function getDataKey() {
  if (!keyPromise) {
    keyPromise = (async () => {
      const saved = await secureGet(DATA_KEY);
      if (saved) return AESEncryptionKey.import(saved, 'hex');
      const key = await AESEncryptionKey.generate();
      await secureSet(DATA_KEY, await key.encoded('hex'));
      return key;
    })().catch((error) => { keyPromise = undefined; throw error; });
  }
  return keyPromise;
}

// Transaksi bisa panjang. AsyncStorage menyimpan ciphertext AES-GCM saja,
// sedangkan kunci enkripsi tetap tersimpan di SecureStore.
export async function privateSet(key: string, value: string): Promise<void> {
  const utf8 = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
  const bytes = Uint8Array.from(utf8, (character) => character.charCodeAt(0));
  const encrypted = await aesEncryptAsync(bytes, await getDataKey());
  await AsyncStorage.setItem(key, await encrypted.combined('base64'));
}

export async function privateGet(key: string): Promise<string | null> {
  const encrypted = await AsyncStorage.getItem(key);
  if (!encrypted) return null;
  const savedKey = await secureGet(DATA_KEY);
  if (!savedKey) throw new Error('Kunci penyimpanan tidak tersedia.');
  const decrypted = await aesDecryptAsync(AESSealedData.fromCombined(encrypted), await AESEncryptionKey.import(savedKey, 'hex'));
  return decodeURIComponent(Array.from(decrypted, (byte) => `%${byte.toString(16).padStart(2, '0')}`).join(''));
}

export async function privateDelete(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function readLegacyPassword(): Promise<string | null> {
  return SecureStore.getItemAsync('sakuin_password');
}

export async function clearLegacyAuthentication(): Promise<void> {
  await SecureStore.deleteItemAsync('sakuin_password');
  await SecureStore.deleteItemAsync('sakuin_session_token');
}
