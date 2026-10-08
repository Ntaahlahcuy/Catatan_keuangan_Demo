// Week 4 Task 1: struktur JSON server (DTO) dipisahkan dari model untuk UI.
export type TransactionDTO = {
  transaction_id: number;
  name: string;
  category_name: string;
  nominal: number;
  kind: 'income' | 'expense';
  occurred_at: string;
};

export type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  createdAt?: string;
  source?: 'api' | 'local';
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mapTransactionDTO(value: unknown): Transaction {
  if (!isObject(value)
    || !Number.isSafeInteger(value.transaction_id) || Number(value.transaction_id) < 1
    || typeof value.name !== 'string' || !value.name.trim()
    || typeof value.category_name !== 'string' || !value.category_name.trim()
    || typeof value.nominal !== 'number' || !Number.isSafeInteger(value.nominal) || value.nominal <= 0
    || (value.kind !== 'income' && value.kind !== 'expense')
    || typeof value.occurred_at !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T/.test(value.occurred_at)
    || Number.isNaN(Date.parse(value.occurred_at))) {
    throw new Error('Format data transaksi dari server tidak sesuai.');
  }
  const timestamp = new Date(value.occurred_at);
  return {
    id: `api-${value.transaction_id}`,
    title: value.name.trim(), category: value.category_name.trim(),
    amount: value.nominal, type: value.kind,
    date: timestamp.toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    createdAt: timestamp.toISOString(), source: 'api',
  };
}

export function parseTransactionResponse(value: unknown): Transaction[] {
  if (!Array.isArray(value)) throw new Error('Respons server harus berupa daftar transaksi.');
  const items = value.map(mapTransactionDTO);
  if (new Set(items.map((item) => item.id)).size !== items.length) {
    throw new Error('Server mengirim ID transaksi yang berulang.');
  }
  return items;
}
