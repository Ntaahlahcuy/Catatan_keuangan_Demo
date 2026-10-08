import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { financeStyles as styles } from '@/styles/finance.styles';
import { useAuth } from '@/context/auth-context';
import { useApiTransactions } from '@/hooks/use-api-transactions';
import {
  addTransaction,
  getTransactions,
  StoredTransaction,
  UserProfile,
} from '@/lib-storage';

type FeatherIconName = keyof typeof Feather.glyphMap;
type TransactionType = 'income' | 'expense';

type SummaryItem = {
  id: string;
  icon: FeatherIconName;
  title: string;
  amount: number;
  color: string;
};

const CATEGORY_ICONS: Record<string, FeatherIconName> = {
  Makan: 'coffee',
  Transportasi: 'truck',
  'Kebutuhan Kuliah': 'book',
  Lainnya: 'grid',
  Pemasukan: 'briefcase',
};

const formatRupiah = (value: number) =>
  `${value < 0 ? '-' : ''}Rp${Math.abs(value).toLocaleString('id-ID')}`;

const formatDate = () => {
  const now = new Date();
  return `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
};

function Header({ profile, onLogout, isSmallScreen }: { profile: UserProfile | null; onLogout: () => void; isSmallScreen: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = profile?.name || 'Mahasiswa';

  return (
    <View style={styles.header}>
      <View accessibilityRole="header">
        <Text style={styles.appName}>SakuIn</Text>
        <Text style={[styles.greeting, isSmallScreen && { fontSize: 20 }]}>Halo, {name}!</Text>
      </View>
      <Pressable
        style={styles.profileBtn}
        onPress={() => setMenuOpen((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel="Menu profil">
        <Feather name="user" size={22} color="#047857" />
      </Pressable>

      {menuOpen && (
        <View style={styles.profileMenu}>
          <Text style={styles.profileMenuName}>{profile?.name}</Text>
          <Text style={styles.profileMenuEmail}>{profile?.email}</Text>
          <View style={styles.menuDivider} />
          <Pressable
            style={styles.logoutButton}
            accessibilityRole="button"
            accessibilityLabel="Keluar dari akun"
            onPress={() => {
              setMenuOpen(false);
              onLogout();
            }}>
            <Feather name="log-out" size={18} color="#B91C1C" />
            <Text style={styles.logoutText}>Keluar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function BalanceCard({ balance, income, expense, isTablet }: { balance: number; income: number; expense: number; isTablet: boolean }) {
  const { width } = useWindowDimensions();
  const compact = width < 450;
  return (
    <View style={[styles.mainCard, isTablet && styles.mainCardTablet]} accessibilityLabel={`Saldo ${formatRupiah(balance)}`}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Total Saldo</Text>
          <Text style={styles.balanceText} numberOfLines={1} adjustsFontSizeToFit>{formatRupiah(balance)}</Text>
        </View>
        <Ionicons name="wallet-outline" size={40} color="#FFFFFF" />
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.cardStats}>
        <View style={[styles.statItem, compact && styles.statItemCompact]}>
          <View style={[styles.statIconContainerIncome, compact && { marginRight: 0 }]}><Feather name="arrow-down-left" size={20} color="#065F46" /></View>
          <View style={compact ? styles.statTextContainerCompact : styles.statTextContainer}>
            <Text style={styles.statLabel}>Pemasukan (+)</Text>
            <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{formatRupiah(income)}</Text>
          </View>
        </View>
        <View style={[styles.statItem, compact && styles.statItemCompact]}>
          <View style={[styles.statIconContainerExpense, compact && { marginRight: 0 }]}><Feather name="arrow-up-right" size={20} color="#991B1B" /></View>
          <View style={compact ? styles.statTextContainerCompact : styles.statTextContainer}>
            <Text style={styles.statLabel}>Pengeluaran (-)</Text>
            <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{formatRupiah(expense)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ActionButtons({ onAdd }: { onAdd: (type: TransactionType) => void }) {
  return (
    <View style={styles.actionContainer}>
      <Pressable style={[styles.actionButton, styles.btnIncome]} onPress={() => onAdd('income')} accessibilityRole="button" accessibilityLabel="Tambah pemasukan">
        <Feather name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.actionButtonText}>Pemasukan</Text>
      </Pressable>
      <Pressable style={[styles.actionButton, styles.btnExpense]} onPress={() => onAdd('expense')} accessibilityRole="button" accessibilityLabel="Tambah pengeluaran">
        <Feather name="minus" size={20} color="#B91C1C" />
        <Text style={[styles.actionButtonText, styles.textExpense]}>Pengeluaran</Text>
      </Pressable>
    </View>
  );
}

function ExpenseSummary({ transactions, isTablet, isLandscape }: { transactions: StoredTransaction[]; isTablet: boolean; isLandscape: boolean }) {
  const categories = ['Makan', 'Transportasi', 'Kebutuhan Kuliah', 'Lainnya'];
  const useGrid = isTablet || isLandscape;
  const data: SummaryItem[] = categories.map((category, index) => ({
    id: String(index),
    icon: CATEGORY_ICONS[category] || 'grid',
    title: category,
    amount: transactions
      .filter((item) => item.type === 'expense' && (category === 'Lainnya' ? !categories.slice(0, 3).includes(item.category) : item.category === category))
      .reduce((sum, item) => sum + item.amount, 0),
    color: ['#B45309', '#1D4ED8', '#6D28D9', '#374151'][index],
  }));

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Ringkasan Pengeluaran</Text>
      <View style={[styles.summaryCard, useGrid && styles.summaryCardGrid]}>
        {data.map((item, index) => (
          <View key={item.id} style={[styles.summaryItem, useGrid && styles.summaryItemGrid, !useGrid && index !== data.length - 1 && styles.borderBottom]}>
            <View style={[styles.summaryItemLeft, useGrid && { flexDirection: 'column', alignItems: 'flex-start', gap: 8 }]}>
              <View style={[styles.summaryIconContainer, { backgroundColor: `${item.color}20` }, useGrid && { marginRight: 0 }]}>
                <Feather name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.summaryItemTitle}>{item.title}</Text>
            </View>
            <Text style={styles.summaryItemAmount}>{formatRupiah(item.amount)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TransactionList({ transactions, all = false }: { transactions: StoredTransaction[]; all?: boolean }) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{all ? 'Riwayat Transaksi' : 'Transaksi Terbaru'}</Text>
        <Text style={styles.transactionCount}>{transactions.length} transaksi</Text>
      </View>
      {transactions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Feather name="inbox" size={30} color="#9CA3AF" />
          <Text style={styles.emptyText}>Belum ada transaksi.</Text>
        </View>
      ) : (
        (all ? transactions : transactions.slice(0, 8)).map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={[styles.transactionIcon, { backgroundColor: item.type === 'income' ? '#E0F2FE' : '#FCE7F3' }]}>
                <Feather
                  name={item.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'}
                  size={24}
                  color={item.type === 'income' ? '#0369A1' : '#BE123C'}
                />
              </View>
              <View style={styles.transactionTextContainer}>
                <Text style={styles.transactionTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.transactionCategory}>{item.category} • {item.date}</Text>
                <Text style={styles.transactionSource}>{item.source === 'api' ? 'Data contoh dari server' : 'Catatan pribadi'}</Text>
              </View>
            </View>
            <Text style={[styles.transactionAmount, { color: item.type === 'income' ? '#047857' : '#B91C1C' }]}>
              {item.type === 'income' ? '+' : '-'}{formatRupiah(item.amount)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

function TransactionModal({ visible, type, onClose, onSave }: { visible: boolean; type: TransactionType; onClose: () => void; onSave: (title: string, category: string, amount: number) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(type === 'income' ? 'Pemasukan' : 'Makan');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle('');
      setAmount('');
      setCategory(type === 'income' ? 'Pemasukan' : 'Makan');
      setError('');
    }
  }, [visible, type]);

  const save = async () => {
    setError('');
    const numericAmount = Number(amount.trim().replace(/\./g, ''));
    if (!title.trim() || !/^\d+$|^\d{1,3}(\.\d{3})+$/.test(amount.trim()) || !Number.isSafeInteger(numericAmount) || numericAmount <= 0) {
      setError('Isi nama transaksi dan nominal berupa angka bulat positif.');
      return;
    }
    try {
      setSaving(true);
      await onSave(title.trim(), category.trim() || 'Lainnya', numericAmount);
      onClose();
    } catch {
      setError('Transaksi belum dapat disimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { if (!saving) onClose(); }}>
      <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.modalCard}>
          <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{type === 'income' ? 'Tambah Pemasukan' : 'Tambah Pengeluaran'}</Text>
              <Text style={styles.modalSubtitle}>Catatan pribadi tersimpan aman di perangkat.</Text>
            </View>
            <Pressable onPress={onClose} disabled={saving} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Tutup formulir transaksi"><Feather name="x" size={22} color="#374151" /></Pressable>
          </View>

          <Text style={styles.label}>Nama transaksi</Text>
          <TextInput style={styles.formInput} placeholder="Contoh: Makan siang" value={title} onChangeText={setTitle} maxLength={100} accessibilityLabel="Nama transaksi" />
          <Text style={styles.label}>Kategori</Text>
          <TextInput style={styles.formInput} placeholder="Contoh: Makan" value={category} onChangeText={setCategory} maxLength={50} accessibilityLabel="Kategori transaksi" />
          <Text style={styles.label}>Nominal</Text>
          <TextInput style={styles.formInput} placeholder="50000" value={amount} onChangeText={setAmount} keyboardType="number-pad" maxLength={20} accessibilityLabel="Nominal dalam rupiah" />
          {!!error && <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text>}

          <Pressable style={styles.primarySaveButton} onPress={save} disabled={saving} accessibilityRole="button" accessibilityState={{ disabled: saving, busy: saving }}>
            <Text style={styles.primarySaveText}>{saving ? 'Menyimpan...' : 'Simpan Transaksi'}</Text>
          </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type NavigationTab = 'home' | 'history' | 'summary' | 'profile';
function BottomNavigation({ selected, onChange }: { selected: NavigationTab; onChange: (tab: NavigationTab) => void }) {
  const items: { id: NavigationTab; icon: FeatherIconName; label: string }[] = [
    { id: 'home', icon: 'home', label: 'Beranda' },
    { id: 'history', icon: 'clock', label: 'Riwayat' },
    { id: 'summary', icon: 'pie-chart', label: 'Ringkasan' },
    { id: 'profile', icon: 'user', label: 'Profil' },
  ];
  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        {items.map((item) => <Pressable key={item.id} style={styles.navItem} onPress={() => onChange(item.id)} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: selected === item.id }}>
          <Feather name={item.icon} size={26} color={selected === item.id ? '#047857' : '#4B5563'} />
          <Text style={[styles.navLabel, selected === item.id && styles.navLabelActive]}>{item.label}</Text>
        </Pressable>)}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const { profile, logout } = useAuth();
  const api = useApiTransactions();
  const [localTransactions, setLocalTransactions] = useState<StoredTransaction[]>([]);
  const [localError, setLocalError] = useState('');
  const [tab, setTab] = useState<NavigationTab>('home');
  const [refreshing, setRefreshing] = useState(false);
  const [modalType, setModalType] = useState<TransactionType | null>(null);

  const isSmallScreen = width < 360;
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const contentPadding = isTablet ? 40 : isSmallScreen ? 16 : 20;

  const loadData = useCallback(async () => {
    try { setLocalTransactions(await getTransactions()); setLocalError(''); }
    catch { setLocalError('Catatan pribadi belum dapat dibaca. Coba muat ulang.'); }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const transactions = useMemo(() => [...localTransactions, ...api.transactions].sort((left, right) =>
    (Date.parse(right.createdAt || '') || 0) - (Date.parse(left.createdAt || '') || 0)), [localTransactions, api.transactions]);
  const refreshAll = async () => {
    setRefreshing(true);
    try { await Promise.all([loadData(), api.refresh()]); } finally { setRefreshing(false); }
  };

  const totals = useMemo(() => {
    const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const handleSaveTransaction = async (title: string, category: string, amount: number) => {
    if (!modalType) return;
    await addTransaction({
      id: `tx-${Date.now()}`,
      title,
      category,
      date: formatDate(),
      createdAt: new Date().toISOString(),
      amount,
      type: modalType,
    });
    await loadData();
  };

  const handleLogout = () => {
    const action = async () => {
      try { await logout(); }
      catch { setLocalError('Belum dapat keluar. Coba lagi.'); }
    };

    if (Platform.OS === 'web') {
      void action();
    } else {
      Alert.alert('Keluar dari SakuIn?', 'Sesi login akan diakhiri. Catatanmu tetap tersimpan.', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: () => void action() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { padding: contentPadding, paddingTop: Platform.OS === 'android' ? 40 : contentPadding }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refreshAll()} tintColor="#047857" />}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.contentWrapper, isTablet && styles.contentWrapperTablet]}>
          <Header profile={profile} onLogout={handleLogout} isSmallScreen={isSmallScreen} />
          {!!localError && <Text style={styles.errorText} accessibilityRole="alert">{localError}</Text>}
          {tab !== 'profile' && <View style={styles.apiCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.apiTitle}>{api.loading ? 'Mengambil transaksi dari server...' : api.error ? 'Data server belum diperbarui' : 'Terhubung ke server'}</Text>
              <Text style={styles.apiDescription}>{api.error || `${api.transactions.length} transaksi contoh dari server · ${localTransactions.length} catatan pribadi`}</Text>
              {api.error && api.loaded && <Text style={styles.apiDescription}>Menampilkan hasil terakhir yang berhasil dimuat.</Text>}
            </View>
            {api.loading ? <ActivityIndicator color="#047857" accessibilityLabel="Memuat data API" /> : <Pressable style={styles.refreshButton} onPress={() => void refreshAll()} accessibilityRole="button" accessibilityLabel="Muat ulang transaksi dari server"><Feather name="refresh-cw" size={18} color="#047857" /><Text style={styles.refreshText}>Muat ulang</Text></Pressable>}
          </View>}
          {tab === 'home' && <>
          <View style={isLandscape && isTablet ? styles.landscapeRow : undefined}>
            <View style={isLandscape && isTablet ? { flex: 1, marginRight: 24 } : undefined}>
              <BalanceCard balance={totals.balance} income={totals.income} expense={totals.expense} isTablet={isTablet} />
              <ActionButtons onAdd={setModalType} />
            </View>
            <View style={isLandscape && isTablet ? { flex: 1 } : undefined}>
              <ExpenseSummary transactions={transactions} isTablet={isTablet} isLandscape={isLandscape} />
              <TransactionList transactions={transactions} />
            </View>
          </View>
          </>}
          {tab === 'history' && <TransactionList transactions={transactions} all />}
          {tab === 'summary' && <><BalanceCard balance={totals.balance} income={totals.income} expense={totals.expense} isTablet={isTablet} /><ExpenseSummary transactions={transactions} isTablet={isTablet} isLandscape={isLandscape} /></>}
          {tab === 'profile' && <View style={styles.profileCard}>
            <Feather name="user" size={40} color="#047857" />
            <Text style={styles.sectionTitle}>{profile?.name}</Text>
            <Text style={styles.profileDetail}>{profile?.email}</Text>
            <Text style={styles.profileDetail}>Akun lokal di perangkat ini. Sesi berakhir otomatis setelah 12 jam.</Text>
            <Pressable style={styles.guideButton} accessibilityRole="button" onPress={() => router.push('/explore')}><Text style={styles.refreshText}>Panduan penggunaan</Text></Pressable>
            <Pressable style={styles.logoutButton} accessibilityRole="button" accessibilityLabel="Keluar dari akun" onPress={handleLogout}><Feather name="log-out" size={20} color="#B91C1C" /><Text style={styles.logoutText}>Keluar dari akun</Text></Pressable>
          </View>}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <BottomNavigation selected={tab} onChange={setTab} />
      <TransactionModal visible={modalType !== null} type={modalType || 'expense'} onClose={() => setModalType(null)} onSave={handleSaveTransaction} />
    </SafeAreaView>
  );
}
