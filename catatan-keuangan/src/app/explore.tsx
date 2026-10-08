import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { guideStyles as styles } from '@/styles/guide.styles';

export default function GuideScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.replace('/')} accessibilityRole="button" style={styles.back}><Text style={styles.link}>Kembali ke SakuIn</Text></Pressable>
        <Text accessibilityRole="header" style={styles.title}>Panduan SakuIn</Text>
        {[
          ['Catatan keuangan', 'Tambah pemasukan atau pengeluaran menggunakan tombol di Beranda. Catatan pribadi tersimpan di perangkat dan tetap tersedia setelah masuk kembali.'],
          ['Transaksi contoh', 'Transaksi berlabel data contoh dari server berasal dari REST API untuk demonstrasi tugas. Saldo dan ringkasan menghitung data contoh bersama catatan pribadi.'],
          ['Muat ulang', 'Tekan Muat ulang atau tarik layar ke bawah untuk meminta data terbaru. Saat server tidak tersedia, aplikasi memberi pesan dan tetap memungkinkan pencatatan pribadi.'],
          ['Riwayat dan ringkasan', 'Riwayat menampilkan semua transaksi. Ringkasan mengelompokkan pengeluaran; kategori selain Makan, Transportasi, dan Kebutuhan Kuliah masuk Lainnya.'],
          ['Akun dan keluar', 'Satu akun lokal digunakan pada satu perangkat. Buka Profil untuk keluar. Keluar menghapus sesi, sementara akun dan catatan tetap tersimpan untuk login berikutnya.'],
        ].map(([title, body]) => <View key={title} style={styles.section}><Text style={styles.heading}>{title}</Text><Text style={styles.body}>{body}</Text></View>)}
      </ScrollView>
    </SafeAreaView>
  );
}
