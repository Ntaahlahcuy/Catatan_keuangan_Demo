import { useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { AppText, Card, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import { useMoney } from '@/context/MoneyContext';
import { useTheme } from '@/context/ThemeContext';
import { rupiah } from '@/utils/finance';
import { pageStyles as s } from '@/styles';

export default function TransactionDetailPage() {
  // [id].tsx menerima satu segmen URL, misalnya /transaksi/demo-3.
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data, deleteTransaction } = useMoney();
  const { colors } = useTheme();
  const [confirm, setConfirm] = useState(false);
  const transaction = data.transactions.find(t => t.id === id);
  if (!transaction) return <Screen><Card><AppText style={s.subtitle}>Transaksi tidak ditemukan</AppText><AppText muted>ID mungkin salah atau transaksi sudah dihapus.</AppText><PageButton title="Ke riwayat" onPress={() => router.replace('/riwayat')} /></Card></Screen>;
  const t = transaction;
  return <Screen><Stack.Screen options={{ title: t.title }} />
    <Card><AppText muted>{t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</AppText><AppText style={[s.title, { color: t.type === 'income' ? colors.green : colors.text }]}>{rupiah(t.amount)}</AppText>
      <AppText style={s.subtitle}>{t.title}</AppText><AppText muted>Kategori: {t.category}</AppText><AppText muted>Tanggal: {t.date}</AppText>
      {t.type === 'expense' ? <AppText muted>Jenis: {t.kind === 'want' ? 'Keinginan' : 'Kebutuhan'}</AppText> : null}
      <AppText>Catatan: {t.note || 'Tidak ada catatan.'}</AppText></Card>
    {t.type === 'expense' && t.kind === 'want' ? <Card style={{ backgroundColor: colors.warningBg }}><AppText style={{ fontWeight: '700' }}>Coba evaluasi sebelum membeli lagi</AppText><AppText muted>Apakah pembelian ini masih terasa perlu setelah lewat 24 jam?</AppText></Card> : null}
    {confirm ? <Card><AppText>Hapus transaksi ini? Ringkasan uang akan dihitung ulang.</AppText><PageButton title="Ya, hapus transaksi" danger onPress={() => { deleteTransaction(t.id); router.replace('/riwayat'); }} />
      <PageButton title="Batal" secondary onPress={() => setConfirm(false)} /></Card>
      : <PageButton title="Hapus transaksi" danger onPress={() => setConfirm(true)} />}
  </Screen>;
}
