import type { MoneyData, Transaction } from '../types/finance.ts';

export const MAX_AMOUNT = 1_000_000_000;
export const WARNING_THRESHOLD = 0.8;

export function budgetPercent(expense: number, budget: number) {
  // Kalikan sebelum pembagian agar 127,5% dibulatkan tepat menjadi 128%.
  return Math.round(expense * 100 / budget);
}

export function rupiah(amount: number) {
  return `${amount < 0 ? '-' : ''}Rp${Math.abs(amount).toLocaleString('id-ID')}`;
}

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && localDate(date) === value;
}

// Rupiah bulat: 25000 atau 25.000. Koma, desimal, dan angka negatif ditolak.
export function parseAmount(value: string): number | null {
  const clean = value.trim();
  if (!/^\d+$/.test(clean) && !/^\d{1,3}(\.\d{3})+$/.test(clean)) return null;
  const amount = Number(clean.replaceAll('.', ''));
  return Number.isSafeInteger(amount) && amount > 0 && amount <= MAX_AMOUNT ? amount : null;
}

export function summarize(transactions: Transaction[], month: string) {
  let income = 0, expense = 0, wants = 0;
  const categories: Record<string, number> = {};
  for (const transaction of transactions) {
    if (!transaction.date.startsWith(month)) continue;
    if (transaction.type === 'income') income += transaction.amount;
    else {
      expense += transaction.amount;
      if (transaction.kind === 'want') wants += transaction.amount;
      categories[transaction.category] = (categories[transaction.category] ?? 0) + transaction.amount;
    }
  }
  return { income, expense, balance: income - expense, wants, categories };
}

export function budgetStatus(expense: number, budget: number) {
  if (expense > budget) return { level: 'danger' as const, title: 'Belanja melewati batas', message: `Lewat ${rupiah(expense - budget)}. Tunda dulu belanja yang bisa menunggu.` };
  if (expense >= budget * WARNING_THRESHOLD) return { level: 'warning' as const, title: 'Rem belanjanya dulu, yuk', message: `Batas belanja sudah terpakai ${budgetPercent(expense, budget)}%. Prioritaskan kebutuhan.` };
  return { level: 'safe' as const, title: 'Masih terkendali', message: 'Catat pengeluaran kecil juga. Sedikit-sedikit bisa jadi banyak.' };
}

export function validateTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return typeof t.id === 'string' && t.id.length > 0 && typeof t.title === 'string' && t.title.trim().length > 0 &&
    typeof t.amount === 'number' && Number.isSafeInteger(t.amount) && t.amount > 0 && t.amount <= MAX_AMOUNT &&
    (t.type === 'income' || t.type === 'expense') && typeof t.category === 'string' && t.category.length > 0 &&
    (t.kind === 'need' || t.kind === 'want') && typeof t.date === 'string' && isValidDate(t.date) && typeof t.note === 'string';
}

export function decodeData(raw: string): MoneyData {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('Format data tidak dikenali.');
  const data = value as MoneyData;
  if (data.version !== 1 || !Number.isSafeInteger(data.monthlyBudget) || data.monthlyBudget <= 0 || data.monthlyBudget > MAX_AMOUNT ||
    !Array.isArray(data.transactions) || !data.transactions.every(validateTransaction) ||
    new Set(data.transactions.map(t => t.id)).size !== data.transactions.length) {
    throw new Error('Data tersimpan tidak valid.');
  }
  return data;
}
