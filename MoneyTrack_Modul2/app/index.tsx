import { useMemo } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Card, Icon, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import TransactionRow from '@/components/TransactionRow';
import { useMoney } from '@/context/MoneyContext';
import { useTheme } from '@/context/ThemeContext';
import { budgetPercent, budgetStatus, localDate, rupiah, summarize } from '@/utils/finance';
import { pageStyles as s } from '@/styles';

export default function HomePage() {
  const { data } = useMoney();
  const { colors } = useTheme();
  const month = localDate().slice(0, 7);
  const summary = useMemo(() => summarize(data.transactions, month), [data.transactions, month]);
  const status = budgetStatus(summary.expense, data.monthlyBudget);
  const percentage = budgetPercent(summary.expense, data.monthlyBudget);
  const latest = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const monthName = new Date(`${month}-01T12:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  return <Screen>
    <View style={s.row}><View style={{ flex: 1 }}><AppText muted style={{ fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>DOMPET MAHASISWA</AppText>
      <AppText style={s.title}>Boros? Bisa diatur.</AppText><AppText muted>{monthName} · Mulai dari mencatat.</AppText></View><Icon name="wallet-outline" size={36} /></View>

    <Card style={{ backgroundColor: '#173F2E', borderColor: '#173F2E', gap: 20 }}>
      <View><AppText style={{ color: '#C5DFCE', fontSize: 13 }}>Selisih uang bulan ini</AppText><AppText testID="balance" numberOfLines={1} adjustsFontSizeToFit style={{ color: '#FFFFFF', fontSize: 36, lineHeight: 46, fontWeight: '800', letterSpacing: -1 }}>{rupiah(summary.balance)}</AppText></View>
      <View style={s.row}><View><AppText style={{ color: '#C5DFCE', fontSize: 12 }}>Pemasukan</AppText><AppText style={{ color: '#FFFFFF', fontWeight: '700' }}>{rupiah(summary.income)}</AppText></View>
        <View><AppText style={{ color: '#C5DFCE', fontSize: 12 }}>Pengeluaran</AppText><AppText testID="expense" style={{ color: '#FFFFFF', fontWeight: '700' }}>{rupiah(summary.expense)}</AppText></View></View>
      <PageButton title="+ Catat transaksi" onPress={() => router.push('/tambah')} />
    </Card>

    <View style={s.row}><View style={{ flex: 1 }}><PageButton title="Riwayat" secondary onPress={() => router.push('/riwayat')} /></View>
      <View style={{ flex: 1 }}><PageButton title="Atur anggaran" secondary onPress={() => router.push('/anggaran')} /></View></View>

    <Card><View style={s.row}><AppText style={{ fontWeight: '700' }}>Batas belanja bulanan</AppText><AppText style={{ color: colors.green, fontWeight: '800' }}>{percentage}%</AppText></View>
      <View style={{ height: 8, borderRadius: 8, backgroundColor: colors.soft, overflow: 'hidden' }}><View style={{ height: 8, borderRadius: 8, width: `${Math.min(percentage, 100)}%`, backgroundColor: status.level === 'danger' ? colors.danger : '#54A06B' }} /></View>
      <AppText muted>{rupiah(summary.expense)} dari {rupiah(data.monthlyBudget)}</AppText>
      <View style={{ padding: 14, borderRadius: 14, backgroundColor: status.level === 'danger' ? colors.dangerBg : status.level === 'warning' ? colors.warningBg : colors.soft }}>
        <AppText style={{ fontWeight: '700' }}>{status.title}</AppText><AppText muted style={{ fontSize: 13 }}>{status.message}</AppText></View>
    </Card>

    <Card><View style={s.row}><Icon name="sparkles-outline" /><AppText style={{ flex: 1, fontWeight: '700' }}>Jeda dulu sebelum checkout</AppText></View>
      <AppText muted>Pengeluaran untuk keinginan bulan ini: <AppText style={{ fontWeight: '800' }}>{rupiah(summary.wants)}</AppText>. Coba tunggu 24 jam sebelum membeli barang di luar kebutuhan.</AppText></Card>

    <View><View style={[s.row, { marginBottom: 6 }]}><AppText style={s.subtitle}>Transaksi terbaru</AppText><Icon name="time-outline" /></View>
      {latest.length ? latest.map(t => <TransactionRow key={t.id} transaction={t} onPress={() => router.push({ pathname: '/transaksi/[id]', params: { id: t.id } })} />)
        : <Card><AppText muted>Belum ada transaksi. Catat uang saku atau pengeluaran pertamamu.</AppText></Card>}
    </View>
    <PageButton title="Pusat bantuan & tips hemat" secondary onPress={() => router.push('/docs')} />
    <AppText muted style={{ fontSize: 12, textAlign: 'center' }}>Catatan bulan ini, bukan saldo rekening bank.</AppText>
  </Screen>;
}
