import { test } from 'node:test';
import assert from 'node:assert/strict';
import { budgetPercent, budgetStatus, decodeData, isValidDate, parseAmount, summarize } from '../utils/finance.ts';
import type { Transaction } from '../types/finance.ts';

const base: Transaction = { id: 'a', title: 'Makan', amount: 25000, type: 'expense', category: 'Makan', kind: 'need', date: '2026-10-22', note: '' };
test('nominal rupiah valid dan penolakan input ambigu', () => {
  assert.equal(parseAmount('25.000'), 25000); assert.equal(parseAmount(' 25000 '), 25000);
  for (const value of ['', '0', '-20', '25,5', '1.5', 'abc', '1e6', '1000000001']) assert.equal(parseAmount(value), null, value);
});
test('tanggal kalender termasuk tahun kabisat', () => {
  assert.equal(isValidDate('2024-02-29'), true); assert.equal(isValidDate('2026-02-29'), false);
  assert.equal(isValidDate('2026-13-01'), false); assert.equal(isValidDate('2026-2-1'), false);
});
test('ringkasan hanya memakai bulan yang dipilih', () => {
  const list = [base, { ...base, id: 'b', amount: 100000, type: 'income' as const }, { ...base, id: 'c', amount: 35000, kind: 'want' as const }, { ...base, id: 'd', date: '2026-09-22', amount: 999999 }];
  assert.deepEqual(summarize(list, '2026-10'), { income: 100000, expense: 60000, balance: 40000, wants: 35000, categories: { Makan: 60000 } });
});
test('saldo negatif dan data kosong dihitung benar', () => {
  assert.equal(summarize([base], '2026-10').balance, -25000);
  assert.equal(summarize([], '2026-10').expense, 0);
});
test('batas peringatan tepat di 80%, 100%, dan di atas 100%', () => {
  assert.equal(budgetPercent(255000, 200000), 128);
  assert.equal(budgetStatus(79, 100).level, 'safe'); assert.equal(budgetStatus(80, 100).level, 'warning');
  assert.equal(budgetStatus(100, 100).level, 'warning'); assert.equal(budgetStatus(101, 100).level, 'danger');
});
test('penghapusan mengeluarkan transaksi dari total', () => {
  const remaining = [base].filter(t => t.id !== 'a');
  assert.equal(summarize(remaining, '2026-10').expense, 0);
});
test('data tersimpan valid dapat dibaca kembali', () => {
  const data = { version: 1, monthlyBudget: 900000, transactions: [base] };
  assert.deepEqual(decodeData(JSON.stringify(data)), data);
});
test('data rusak, versi salah, dan ID ganda ditolak', () => {
  for (const value of ['{broken', JSON.stringify({ version: 2 }), JSON.stringify({ version: 1, monthlyBudget: 0, transactions: [] }), JSON.stringify({ version: 1, monthlyBudget: 900000, transactions: [{ ...base, amount: -1 }] }), JSON.stringify({ version: 1, monthlyBudget: 900000, transactions: [base, base] })]) assert.throws(() => decodeData(value));
});
