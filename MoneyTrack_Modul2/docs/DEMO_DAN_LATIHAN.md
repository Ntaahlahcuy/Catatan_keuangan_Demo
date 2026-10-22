# Skenario demo dan latihan individu

Gunakan panduan ini untuk persiapan. Modul halaman 42 menyatakan demo dilakukan **secara individu**, ada pertanyaan dan modifikasi langsung, serta praktikan tidak boleh membuka modul atau menggunakan AI di editor saat penilaian. Pelajari dulu, lalu lakukan simulasi tanpa panduan. Ikuti pula aturan tambahan asisten untuk hari demo.

## 1. Persiapan sebelum giliran

1. Jalankan project lengkap, bukan salah satu folder anggota saja.
2. Jalankan `npm run check` dan pastikan semua pemeriksaan lulus.
3. Coba di HP yang akan dipakai. Pastikan Expo Go cocok dengan SDK 57.
4. Anggaran > Muat ulang data contoh > Ya, ganti data. Periksa pengeluaran Rp230.000 dan selisih Rp1.270.000.
5. Buka file yang perlu dijelaskan di VS Code. Nonaktifkan fitur AI editor untuk penilaian sesuai ketentuan modul.
6. Masing-masing anggota harus memahami seluruh alur aplikasi, termasuk bagian yang dikerjakan pasangan.

## 2. Urutan demonstrasi sekitar 7-10 menit

### A. Perkenalkan masalah dan aplikasi

Contoh penjelasan: "Money Track membantu mahasiswa yang sering tidak sadar uang sakunya habis untuk apa. Pengguna mencatat pemasukan dan pengeluaran, menandai kebutuhan atau keinginan, lalu membatasi belanja bulanan. Data disimpan di perangkat."

Tunjukkan beranda: pemasukan Rp1.500.000, pengeluaran Rp230.000, selisih Rp1.270.000, dan batas Rp900.000. Jelaskan bahwa data awal adalah contoh, bukan data rekening sungguhan.

### B. Tunjukkan useState dan input yang terkontrol

1. Tekan Catat transaksi. Pilih Pengeluaran.
2. Isi nama **Es kopi latihan**, nominal **25000**, kategori **Hiburan**, jenis **Keinginan**, tanggal hari ini.
3. Sebelum menyimpan, tunjukkan `app/tambah.tsx`: `useState` untuk nama, nominal, jenis, kategori, tanggal, dan pesan error.
4. Tekan Simpan transaksi. Form berpindah ke Riwayat melalui `router.replace('/riwayat')`.

Hasil: pengeluaran Rp255.000, selisih Rp1.245.000, dan keinginan Rp180.000. Angka di beranda berubah karena data context berubah dan halaman render ulang.

Uji validasi cepat bila diminta: nama kosong atau nominal `0` ditolak. Pastikan tidak menambahkan transaksi lain jika ingin mengikuti angka skenario ini.

### C. Tunjukkan push, dynamic route, dan back

1. Di Riwayat, cari "Es kopi latihan". Tekan transaksi tersebut.
2. Tunjukkan `router.push({ pathname: '/transaksi/[id]', params: { id: t.id } })` di halaman riwayat.
3. Di detail, jelaskan bahwa `useLocalSearchParams()` mengambil ID. Aplikasi mencari transaksi yang ID-nya sama, bukan mengandalkan posisi array.
4. Tekan tombol kembali. Tunjukkan implementasi `router.back()` di `components/UI.tsx`.
5. Jelaskan `router.canGoBack()` memeriksa history; bila tidak ada, `router.replace('/')` membuka beranda.

### D. Tunjukkan batas dan peringatan

1. Di Anggaran, ganti batas menjadi **300000** dan simpan. Kembali ke beranda: Rp255.000 / Rp300.000 = **85%**, tampil peringatan.
2. Ganti lagi menjadi **200000**: pengeluaran melewati batas **Rp55.000**, persentase dibulatkan menjadi **128%**.
3. Tunjukkan `utils/finance.ts`: `budgetStatus()` memeriksa kondisi di atas 100% dahulu, lalu >=80%.

### E. Tunjukkan useEffect dan penyimpanan

1. Buka `context/MoneyContext.tsx`.
2. Jelaskan effect pertama dengan dependency `[]`: membaca AsyncStorage ketika provider dipasang.
3. Jelaskan effect kedua dengan dependency `[data, ready, canSave]`: menyimpan setelah pembacaan awal selesai dan ketika data berubah. Flag mencegah data awal menimpa data lama sebelum pemuatan selesai.
4. Refresh web atau buka ulang sesi aplikasi. Transaksi "Es kopi latihan" dan anggaran Rp200.000 tetap ada. Tunggu proses simpan singkat sebelum menutup aplikasi.

### F. Tunjukkan _layout dan Stack.Screen

Buka `app/_layout.tsx`: jelaskan bahwa provider membungkus navigasi sehingga state dipakai bersama. Tunjukkan `Stack.Screen name="tambah"`, `name="riwayat"`, dan `name="transaksi/[id]"`. Ketika detail terbuka, judul header menjadi nama transaksi melalui `Stack.Screen` di halaman detail.

### G. Tunjukkan Codelab 1 dan 2

1. Anggaran > Ubah tampilan > Toggle Theme. Kembali ke beranda dan lihat warna berubah juga. Tunjukkan `useContext` di ThemeContext dan rantai Home -> Profile -> UserCard -> UserName.
2. Buka Pusat bantuan > Jeda 24 jam sebelum checkout. Tunjukkan `app/docs/[...slug].tsx` yang menangkap path `hemat/keinginan`.
3. Jelaskan external component `PageButton`, external styles, barrel `styles/index.ts`, dan alias `@`.

### H. Hapus dan hitung ulang

Buka detail "Es kopi latihan", tekan Hapus transaksi, kemudian Ya, hapus transaksi. Pengeluaran kembali Rp230.000 dan selisih Rp1.270.000. Ubah batas ke Rp900.000 jika ingin mengembalikan kondisi awal.

## 3. Pertanyaan latihan dan jawaban singkat

| Pertanyaan | Jawaban yang perlu dipahami |
| --- | --- |
| Mengapa bukan variabel biasa? | State dipertahankan React antar-render dan setter memicu render ulang. Variabel lokal biasa dibuat kembali saat render dan perubahannya tidak meminta render baru. |
| Apa peran useEffect? | Menyelaraskan komponen dengan sesuatu di luar perhitungan render, di sini penyimpanan lokal. Bukan untuk mengganti semua perhitungan biasa. |
| Apa arti dependency array? | `[]` untuk pemasangan awal; `[data, ready, canSave]` untuk perubahan nilai tersebut. Pada mode development tertentu effect awal dapat dijalankan ulang untuk pemeriksaan React. |
| Mengapa ada ready dan canSave? | Agar penyimpanan menunggu pembacaan awal selesai, dan berhenti bila data lama tidak berhasil dibaca. |
| Mengapa pembaruan state menggunakan previous? | Nilai baru dihitung dari state terbaru; mengurangi risiko pembaruan saling menimpa ketika perubahan berurutan. |
| Apakah state saja cukup setelah aplikasi ditutup? | Tidak. Context/state menjaga data selama provider hidup. AsyncStorage menyimpan data untuk sesi berikutnya. |
| Apa beda push dan replace? | Push menambahkan screen ke stack. Replace mengganti screen aktif; form yang sudah disimpan tidak menjadi screen sebelumnya yang bisa dibuka kembali. |
| Apa beda back dan canGoBack? | Back menjalankan navigasi kembali. canGoBack hanya memeriksa apakah ada history kembali. |
| Apa fungsi _layout.tsx? | Menentukan struktur navigasi dan pembungkus halaman dalam folder, termasuk provider dan konfigurasi stack. |
| Mengapa _layout.tsx, bukan .ts? | File mengandung JSX; ekstensi TypeScript untuk JSX adalah .tsx. Tabel rubrik menulis .ts tetapi contoh kode/layout memakai .tsx. |
| Apakah Stack.Screen membuat route sendiri? | Route tetap ditentukan berkas dalam app. Stack.Screen mengatur opsi seperti judul dan header untuk route tersebut. |
| Apa beda [id] dan [...slug]? | [id] menangkap satu segmen dinamis; [...slug] menangkap beberapa segmen path sebagai parameter. |
| Mengapa memakai ID transaksi? | ID tetap menunjuk transaksi yang benar ketika daftar dicari, difilter, diurutkan, atau dihapus. |
| Apa peran useContext? | Membaca nilai provider tanpa mengoper prop melalui setiap komponen perantara. |
| Apa peran useMemo? | Menyimpan hasil perhitungan ulang berdasarkan dependency; di sini ringkasan dan daftar terfilter. Kebenaran perhitungan tidak bergantung pada cache. |
| Apa peran useRef? | Menyimpan nilai yang tidak perlu memicu render; contohnya mencegah submit ganda dan menjaga antrean simpan. |
| Mengapa selisih bisa negatif? | Pengeluaran bulan itu lebih besar daripada pemasukan yang dicatat. Aplikasi memperbolehkan pencatatan kenyataan tersebut. |
| Apakah data bulan lalu masuk beranda? | Tidak. Beranda memakai bulan kalender saat ini; riwayat memuat semua tanggal. Saldo bulan lalu belum dibawa ke bulan baru. |
| Kapan peringatan muncul? | Pada pengeluaran >=80% dari batas. Di atas 100% menjadi melewati batas. |
| Apakah tema tersimpan setelah restart? | Tidak. Tema hanya state sesi; transaksi dan anggaran disimpan dengan AsyncStorage. |

## 4. Latihan modifikasi langsung

### Latihan 1 - tambahkan kategori Pulsa

Buka `types/finance.ts`, tambahkan `'Pulsa'` ke `EXPENSE_CATEGORIES`. Simpan dan cek form Catat transaksi. Pilih kategori tersebut, simpan transaksi, lalu pastikan kategori tampil di riwayat/detail dan ringkasan kategori. Tidak perlu menambah halaman baru.

### Latihan 2 - ubah peringatan menjadi 75%

Buka `utils/finance.ts`, ubah `WARNING_THRESHOLD` dari `0.8` menjadi `0.75`. Ubah keterangan 80% di halaman anggaran/panduan agar sesuai perilaku. Perbarui pengujian batas di `tests/finance.test.ts`: nilai 74 masih safe, 75 warning untuk budget 100; pengujian 100 dan 101 tetap. Cek dengan pengeluaran Rp230.000 dan batas Rp300.000: sekitar 77%, kini sudah warning.

### Latihan 3 - ganti batas awal

Buka `constants/demoData.ts`, ubah `monthlyBudget` dari `900000` menjadi `1000000`. Perubahan ini hanya berlaku untuk data awal/reset contoh. Data yang sudah tersimpan tidak berubah sendiri. Muat ulang data contoh untuk melihatnya. Jika ingin seluruh reset konsisten, sesuaikan juga default `clearData()` di MoneyContext dan nilai input reset di halaman anggaran.

### Latihan 4 - ubah dark mode awal

Di `context/ThemeContext.tsx`, ubah `useState(false)` menjadi `useState(true)`. Refresh penuh untuk melihat state awal yang baru. Mengedit file saat Fast Refresh dapat mempertahankan state yang ada, jadi reload penuh bila tampilan belum berubah.

### Latihan 5 - tambah artikel panduan

Tambahkan satu entri pada `constants/guides.ts`, misalnya key `hemat/transport` dengan title, intro, dan array points. Daftar bantuan otomatis menampilkan tombol baru karena membaca Object.entries(guides). Klik tombol dan periksa catch-all menampilkan kontennya.

### Latihan 6 - ubah judul header

Di `app/_layout.tsx`, ubah title screen `riwayat` menjadi `Catatan uangku`. Jangan mengubah `name` tanpa mengganti nama file route. Buka Riwayat untuk memastikan judul berubah dan navigasi tetap bekerja.

Sesudah latihan jalankan `npm run check`, lalu cek perilaku aplikasi. Bila aturan bisnis diubah, pengujian dan teks penjelasannya juga harus disesuaikan. Latihan ini untuk persiapan; pada penilaian lakukan sendiri sesuai instruksi asisten.
