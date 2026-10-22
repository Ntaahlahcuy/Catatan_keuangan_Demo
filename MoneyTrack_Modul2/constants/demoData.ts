import type { MoneyData, Transaction } from '@/types/finance';
import { localDate } from '@/utils/finance';

export function createDemoData(): MoneyData {
  const date = localDate();
  const transactions: Transaction[] = [
    { id: 'demo-1', title: 'Uang saku bulanan', amount: 1500000, type: 'income', category: 'Uang saku', kind: 'need', date, note: 'Contoh data untuk latihan. Bisa dihapus.' },
    { id: 'demo-2', title: 'Makan siang di kantin', amount: 25000, type: 'expense', category: 'Makan', kind: 'need', date, note: 'Nasi ayam dan es teh.' },
    { id: 'demo-3', title: 'Kopi bareng teman', amount: 35000, type: 'expense', category: 'Hiburan', kind: 'want', date, note: 'Coba batasi nongkrong minggu ini.' },
    { id: 'demo-4', title: 'Bensin ke kampus', amount: 50000, type: 'expense', category: 'Transport', kind: 'need', date, note: '' },
    { id: 'demo-5', title: 'Checkout barang lucu', amount: 120000, type: 'expense', category: 'Belanja', kind: 'want', date, note: 'Beli karena diskon, padahal belum perlu.' },
  ];
  return { version: 1, monthlyBudget: 900000, transactions };
}
