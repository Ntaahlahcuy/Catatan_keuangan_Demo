export type TransactionType = 'income' | 'expense';
export type SpendingKind = 'need' | 'want';
export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  kind: SpendingKind;
  date: string;
  note: string;
};
export type TransactionInput = Omit<Transaction, 'id'>;
export type MoneyData = {
  version: 1;
  monthlyBudget: number;
  transactions: Transaction[];
};
export const EXPENSE_CATEGORIES = ['Makan', 'Transport', 'Kuliah', 'Kos', 'Hiburan', 'Belanja', 'Lainnya'];
export const INCOME_CATEGORIES = ['Uang saku', 'Beasiswa', 'Kerja', 'Lainnya'];
