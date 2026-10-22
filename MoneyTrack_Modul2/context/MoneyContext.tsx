import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createDemoData } from '@/constants/demoData';
import type { MoneyData, TransactionInput } from '@/types/finance';
import { decodeData, MAX_AMOUNT, validateTransaction } from '@/utils/finance';

const STORAGE_KEY = '@money-track/data-v1';
type MoneyValue = {
  data: MoneyData;
  ready: boolean;
  storageError: string;
  addTransaction: (input: TransactionInput) => string;
  deleteTransaction: (id: string) => void;
  setBudget: (value: number) => void;
  resetDemo: () => void;
  clearData: () => void;
};
const MoneyContext = createContext<MoneyValue | undefined>(undefined);

export function MoneyProvider({ children }: { children: ReactNode }) {
  // RUBRIK: useState menyimpan data yang menyebabkan UI melakukan render ulang.
  const [data, setData] = useState<MoneyData>(createDemoData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [canSave, setCanSave] = useState(false);
  const sequence = useRef(0);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  // RUBRIK: [] berarti baca penyimpanan satu kali setelah provider dipasang.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!active) return;
      if (raw !== null) setData(decodeData(raw));
      setCanSave(true);
    }).catch(() => {
      if (active) setStorageError('Data lama gagal dibaca. Penyimpanan dihentikan agar data lama tidak tertimpa. Tutup lalu buka kembali aplikasi, atau pilih mulai kosong di Anggaran.');
    }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  // RUBRIK: effect dipicu oleh perubahan data, setelah pembacaan awal selesai.
  useEffect(() => {
    if (!ready || !canSave) return;
    const snapshot = JSON.stringify(data);
    // Antrean menjaga urutan simpan jika pengguna mengubah data dengan cepat.
    saveQueue.current = saveQueue.current.then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot))
      .then(() => setStorageError(''))
      .catch(() => setStorageError('Gagal menyimpan. Perubahan saat ini masih ada di layar. Coba ubah data lagi sebelum menutup aplikasi.'));
  }, [data, ready, canSave]);

  function addTransaction(input: TransactionInput) {
    const transaction = { ...input, id: `${Date.now()}-${++sequence.current}-${Math.random().toString(36).slice(2, 8)}` };
    if (!validateTransaction(transaction)) throw new Error('Periksa data transaksi.');
    setData(previous => ({ ...previous, transactions: [transaction, ...previous.transactions] }));
    return transaction.id;
  }
  function setBudget(value: number) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > MAX_AMOUNT) throw new Error('Batas tidak valid.');
    setData(previous => ({ ...previous, monthlyBudget: value }));
  }
  function replaceData(next: MoneyData) {
    setStorageError(''); setCanSave(true); setData(next);
  }
  return <MoneyContext.Provider value={{ data, ready, storageError, addTransaction, setBudget,
    deleteTransaction: id => setData(previous => ({ ...previous, transactions: previous.transactions.filter(t => t.id !== id) })),
    resetDemo: () => replaceData(createDemoData()),
    clearData: () => replaceData({ version: 1, monthlyBudget: 900000, transactions: [] }),
  }}>{children}</MoneyContext.Provider>;
}

export function useMoney() {
  const value = useContext(MoneyContext);
  if (!value) throw new Error('useMoney harus berada di dalam MoneyProvider.');
  return value;
}
