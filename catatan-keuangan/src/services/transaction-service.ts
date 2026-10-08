import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { parseTransactionResponse, type Transaction } from '../models/transaction';

export function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');
  if (Platform.OS === 'web') return `http://${typeof window === 'undefined' ? 'localhost' : window.location.hostname}:3001/api`;
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    try {
      const hostname = new URL(hostUri.includes('://') ? hostUri : `http://${hostUri}`).hostname;
      return `http://${hostname}:3001/api`;
    } catch { /* Gunakan alamat emulator jika host tidak bisa dibaca. */ }
  }
  return `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}:3001/api`;
}

// Week 4 Task 2: GET, cek status, parse JSON, validasi dan mapping DTO.
export async function fetchTransactions(baseUrl = getApiBaseUrl(), signal?: AbortSignal, timeoutMs = 8000): Promise<Transaction[]> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, timeoutMs);
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/transactions`, {
      method: 'GET', headers: { Accept: 'application/json' }, signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Server belum dapat mengirim data (HTTP ${response.status}).`);
    const json: unknown = await response.json();
    return parseTransactionResponse(json);
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Permintaan terhenti atau terlalu lama. Coba lagi.');
    if (error instanceof TypeError) throw new Error('Tidak dapat terhubung ke server. Pastikan server API aktif dan koneksi tersedia.');
    if (error instanceof SyntaxError) throw new Error('Respons server bukan JSON yang valid.');
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
