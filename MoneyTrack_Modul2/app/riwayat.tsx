import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Card, Chip, Field, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import TransactionRow from '@/components/TransactionRow';
import { useMoney } from '@/context/MoneyContext';
import { pageStyles as s } from '@/styles';

export default function HistoryPage() {
  const { data } = useMoney();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => data.transactions.filter(t =>
    (filter === 'all' || (filter === 'want' ? t.type === 'expense' && t.kind === 'want' : t.type === filter)) &&
    `${t.title} ${t.category} ${t.note}`.toLowerCase().includes(query.toLowerCase().trim())
  ).sort((a, b) => b.date.localeCompare(a.date)), [data.transactions, filter, query]);
  return <Screen><View><AppText style={s.title}>Jejak uangmu.</AppText><AppText muted>Semua bulan · {filtered.length} transaksi ditampilkan</AppText></View>
    <Field label="Cari transaksi" placeholder="Nama, kategori, atau catatan" value={query} onChangeText={setQuery} />
    <View style={s.wrap}>{[['all', 'Semua'], ['expense', 'Pengeluaran'], ['income', 'Pemasukan'], ['want', 'Keinginan']].map(([key, label]) => <Chip key={key} label={label} selected={filter === key} onPress={() => setFilter(key)} />)}</View>
    <Card>{filtered.length ? filtered.map(t => <TransactionRow key={t.id} transaction={t} onPress={() => {
      // RUBRIK: push() + parameter ID ke dynamic route.
      router.push({ pathname: '/transaksi/[id]', params: { id: t.id } });
    }} />) : <AppText muted>Tidak ada transaksi yang cocok. Coba kata kunci atau filter lain.</AppText>}</Card>
    <PageButton title="+ Catat transaksi baru" onPress={() => router.push('/tambah')} />
  </Screen>;
}
