import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { AppText, Card, Chip, Field, Screen } from '@/components/UI';
import PageButton from '@/components/PageButton';
import { useMoney } from '@/context/MoneyContext';
import { useTheme } from '@/context/ThemeContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type SpendingKind, type TransactionType } from '@/types/finance';
import { isValidDate, localDate, parseAmount } from '@/utils/finance';
import { pageStyles as s } from '@/styles';

export default function AddTransactionPage() {
  const { addTransaction } = useMoney();
  const { colors } = useTheme();
  // RUBRIK: setiap input dan pilihan disimpan sebagai state terkontrol.
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Makan');
  const [kind, setKind] = useState<SpendingKind>('need');
  const [date, setDate] = useState(localDate());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const submitted = useRef(false);
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function save() {
    if (submitted.current) return;
    const parsed = parseAmount(amount);
    if (!title.trim()) return setError('Nama transaksi wajib diisi.');
    if (parsed === null) return setError('Nominal harus rupiah bulat, lebih dari 0, maksimal 1.000.000.000. Contoh: 25000 atau 25.000.');
    if (!isValidDate(date)) return setError('Tanggal harus valid dengan format YYYY-MM-DD.');
    if (date > localDate()) return setError('Tanggal tidak boleh melebihi hari ini.');
    try {
      submitted.current = true;
      addTransaction({ title: title.trim(), amount: parsed, type, category, kind: type === 'income' ? 'need' : kind, date, note: note.trim() });
      // RUBRIK: replace mengganti form supaya Back tidak membuka form tersimpan lagi.
      router.replace('/riwayat');
    } catch {
      submitted.current = false; setError('Transaksi gagal ditambahkan. Periksa kembali isian.');
    }
  }
  return <Screen><View><AppText style={s.title}>Uangnya ke mana?</AppText><AppText muted>Catat sekarang, biar tidak lupa nanti.</AppText></View>
    <View style={s.wrap}><Chip label="Pengeluaran" selected={type === 'expense'} onPress={() => { setType('expense'); setCategory('Makan'); }} />
      <Chip label="Pemasukan" selected={type === 'income'} onPress={() => { setType('income'); setCategory('Uang saku'); }} /></View>
    <Field label="Nama transaksi" placeholder="Contoh: makan di kantin" value={title} onChangeText={setTitle} maxLength={70} />
    <Field label="Nominal (Rp)" placeholder="25000" value={amount} onChangeText={setAmount} keyboardType="number-pad" maxLength={16} />
    <View><AppText style={s.label}>Kategori</AppText><View style={s.wrap}>{categories.map(c => <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />)}</View></View>
    {type === 'expense' ? <Card><AppText style={s.label}>Kebutuhan atau keinginan?</AppText><View style={s.wrap}>
      <Chip label="Kebutuhan" selected={kind === 'need'} onPress={() => setKind('need')} /><Chip label="Keinginan" selected={kind === 'want'} onPress={() => setKind('want')} /></View>
      <AppText muted style={{ fontSize: 13 }}>Kebutuhan: makan, kos, transport. Keinginan: checkout impulsif atau nongkrong tambahan.</AppText></Card> : null}
    <Field label="Tanggal (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder={localDate()} maxLength={10} />
    <Field label="Catatan (opsional)" value={note} onChangeText={setNote} placeholder="Ada yang ingin diingat?" multiline maxLength={300} />
    {error ? <AppText accessibilityRole="alert" style={{ color: colors.danger }}>{error}</AppText> : null}
    <PageButton title="Simpan transaksi" onPress={save} />
  </Screen>;
}
