export const guides: Record<string, { title: string; intro: string; points: string[] }> = {
  'panduan/catat': { title: 'Mulai catat uangmu', intro: 'Cukup satu menit setiap selesai bertransaksi.', points: [
    'Buka Catat transaksi, lalu pilih Pemasukan atau Pengeluaran.',
    'Isi nama, nominal rupiah bulat, kategori, dan tanggal. Contoh nominal: 25000 atau 25.000.',
    'Tandai pengeluaran sebagai kebutuhan atau keinginan, lalu simpan.',
    'Buka Riwayat untuk mencari transaksi. Ketuk transaksi untuk membaca detail atau menghapusnya.',
  ] },
  'panduan/anggaran': { title: 'Mengatur batas belanja', intro: 'Beri setiap pengeluaran tempat di dalam anggaranmu.', points: [
    'Buka Atur anggaran, lalu isi batas pengeluaran per bulan.',
    'Indikator beranda menghitung pengeluaran pada bulan kalender saat ini.',
    'Saat pemakaian mencapai 80%, aplikasi mengingatkan untuk menahan belanja. Di atas 100%, batas sudah terlewati.',
    'Selisih uang di beranda adalah pemasukan dikurangi pengeluaran bulan ini. Nilai tersebut tidak tersambung ke rekening bank.',
  ] },
  'hemat/keinginan': { title: 'Jeda 24 jam sebelum checkout', intro: 'Diskon besar belum tentu membuat pembelian jadi perlu.', points: [
    'Masukkan barang ke daftar keinginan terlebih dahulu.',
    'Tunggu 24 jam. Tanyakan apakah barang itu masih dibutuhkan.',
    'Cek pengeluaran kategori Belanja dan filter Keinginan di Riwayat.',
    'Jika batas belanja mulai habis, tunda pembelian yang bisa menunggu.',
  ] },
  'hemat/makan': { title: 'Hemat tanpa melewatkan makan', intro: 'Atur kebiasaan kecil yang dilakukan setiap hari.', points: [
    'Buat rencana makan sederhana sebelum berangkat kuliah.',
    'Bandingkan total biaya makanan, ongkir, dan biaya layanan sebelum memesan.',
    'Bawa botol minum. Catat jajanan dan kopi supaya pengeluaran kecil terlihat.',
  ] },
};
