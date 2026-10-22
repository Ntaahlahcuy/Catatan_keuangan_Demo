import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Card, Field, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import { useMoney } from '@/context/MoneyContext';
import { useTheme } from '@/context/ThemeContext';
import { localDate, parseAmount, rupiah, summarize } from '@/utils/finance';
import { pageStyles as s } from '@/styles';

export default function BudgetPage() {
  const { data, setBudget, resetDemo, clearData } = useMoney();
  const { colors } = useTheme();
  const [budget, setBudgetInput] = useState(String(data.monthlyBudget));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<'demo' | 'clear' | null>(null);
  const month = localDate().slice(0, 7);
  const summary = useMemo(() => summarize(data.transactions, month), [data.transactions, month]);
  const categories = Object.entries(summary.categories).sort((a, b) => b[1] - a[1]);
  function saveBudget() {
    const value = parseAmount(budget);
    if (value === null) { setMessage(''); setError('Isi batas belanja rupiah bulat, lebih dari 0, maksimal 1.000.000.000.'); return; }
    setBudget(value); setError(''); setMessage('Batas belanja berhasil disimpan. Cek indikator di beranda.');
  }
  return <Screen><View><AppText style={s.title}>Kasih batas, yuk.</AppText><AppText muted>Biar uang saku cukup sampai akhir bulan.</AppText></View>
    <Card><Field label="Batas pengeluaran per bulan (Rp)" value={budget} onChangeText={setBudgetInput} keyboardType="number-pad" maxLength={16} />
      <AppText muted>Batas ini berlaku untuk setiap bulan kalender. Peringatan muncul ketika terpakai 80% atau lebih; status melewati batas muncul di atas 100%.</AppText>
      {error ? <AppText accessibilityRole="alert" style={{ color: colors.danger }}>{error}</AppText> : null}
      {message ? <AppText accessibilityRole="alert" style={{ color: colors.green }}>{message}</AppText> : null}
      <PageButton title="Simpan batas belanja" onPress={saveBudget} /></Card>
    <Card><AppText style={s.subtitle}>Pengeluaran per kategori</AppText><AppText muted>Bulan ini · {rupiah(summary.expense)}</AppText>
      {categories.length ? categories.map(([name, value]) => <View key={name} style={s.row}><AppText>{name}</AppText><AppText style={{ fontWeight: '700' }}>{rupiah(value)}</AppText></View>) : <AppText muted>Belum ada pengeluaran bulan ini.</AppText>}</Card>
    <PageButton title="Ubah tampilan terang / gelap" secondary onPress={() => router.push('/usecontext_example')} />
    <PageButton title="Baca panduan & tips hemat" secondary onPress={() => router.push('/docs')} />
    <Card><AppText style={{ fontWeight: '700' }}>Data di perangkat ini</AppText><AppText muted>Saat pertama dibuka, aplikasi berisi 5 transaksi contoh bertanggal hari ini. Transaksi dan anggaran tersimpan lokal. Pilihan tema kembali ke terang setelah aplikasi dimulai ulang.</AppText>
      {!confirm ? <><PageButton title="Muat ulang data contoh" secondary onPress={() => setConfirm('demo')} /><PageButton title="Mulai catatan kosong" danger onPress={() => setConfirm('clear')} /></>
        : <><AppText>Ganti semua transaksi dan anggaran dengan {confirm === 'demo' ? 'data contoh' : 'catatan kosong'}?</AppText>
          <PageButton title="Ya, ganti data" danger onPress={() => { if (confirm === 'demo') resetDemo(); else clearData(); setBudgetInput('900000'); setMessage('Data berhasil diganti.'); setError(''); setConfirm(null); }} />
          <PageButton title="Batal" secondary onPress={() => setConfirm(null)} /></>}
    </Card>
  </Screen>;
}
