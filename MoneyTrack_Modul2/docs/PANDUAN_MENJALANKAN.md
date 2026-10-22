# Panduan menjalankan Money Track

## 1. Persiapan satu kali

1. Pasang **Node.js 24 LTS** dari https://nodejs.org/en/download. npm sudah ikut terpasang.
2. Pasang Visual Studio Code. Pasang Git dari https://git-scm.com/downloads untuk kebutuhan GitHub.
3. Untuk Android, siapkan Expo Go yang cocok dengan **SDK 57**. Pilih SDK 57 dan Android di https://expo.dev/go jika aplikasi dari toko belum cocok. Ikuti petunjuk resmi yang tampil. Jangan mengganti versi dependensi satu per satu agar cocok dengan Expo Go yang berbeda.
4. Sambungkan laptop dan HP ke Wi-Fi yang sama. Instalasi dependensi pertama membutuhkan internet.
5. Ekstrak ZIP terlebih dahulu; jangan menjalankan file dari dalam tampilan ZIP.

Untuk iPhone, ketersediaan Expo Go SDK 57 mengikuti jalur instalasi resmi Expo. Jika instalasi pada iPhone tidak tersedia di perangkatmu, gunakan Android yang kompatibel atau browser untuk latihan. Konfirmasikan media demo kepada asisten; PDF memperbolehkan Expo Go dan tidak mewajibkan build APK.

## 2. Buka folder yang benar di VS Code

Paket lengkap memiliki folder **MoneyTrack**. Pilih **File > Open Folder > MoneyTrack**. Di Explorer, `package.json`, `app.json`, `app/`, dan `context/` harus terlihat langsung.

Buka **Terminal > New Terminal**. Jalankan satu per satu:

```bash
node --version
npm --version
```

Versi Node yang dipakai untuk verifikasi adalah 24. `npm ci` wajib dijalankan di folder yang memuat `package.json` dan `package-lock.json`.

## 3. Instal dependensi dan jalankan

```bash
npm ci
npm start
```

Tunggu instalasi selesai. `npm start` adalah singkatan dari `expo start --go`, sesuai perintah yang diperbolehkan pada modul. Terminal menampilkan QR code dan alamat server Metro. Biarkan terminal ini terbuka selama aplikasi digunakan.

**Android:** buka Expo Go, pilih pemindaian QR code, lalu pindai QR dari terminal. Izinkan akses jaringan privat di firewall bila Windows meminta. Tunggu proses bundling selesai.

**Latihan di browser:** hentikan server dengan `Ctrl+C`, lalu jalankan:

```bash
npm run web
```

Browser biasanya terbuka otomatis. Jika tidak, buka alamat localhost yang ditampilkan terminal. Web adalah alternatif untuk latihan dan pengujian, sedangkan demonstrasi mobile sebaiknya dicoba juga di HP sebelum hari demo.

## 4. Pemeriksaan awal tampilan

Saat data belum pernah tersimpan, aplikasi memuat lima transaksi contoh bertanggal hari ini:

| Data awal | Nilai |
| --- | --- |
| Uang saku | Rp1.500.000 |
| Makan siang | Rp25.000 |
| Kopi | Rp35.000 |
| Bensin | Rp50.000 |
| Belanja | Rp120.000 |
| Total pengeluaran | Rp230.000 |
| Selisih bulan ini | Rp1.270.000 |
| Pengeluaran untuk keinginan | Rp155.000 |
| Batas pengeluaran | Rp900.000 |

Beranda awal menunjukkan pemakaian sekitar 26%. Jika aplikasi pernah dipakai, data lama akan dibaca. Untuk menyamakan kondisi latihan: **Atur anggaran > Muat ulang data contoh > Ya, ganti data**. Langkah ini mengganti transaksi dan anggaran lokal.

## 5. Cara memakai fitur

1. **Catat pengeluaran:** pilih Catat transaksi, isi nama dan nominal, pilih kategori serta kebutuhan/keinginan, kemudian Simpan transaksi. Tanggal awal adalah hari ini.
2. **Catat pemasukan:** pilih Pemasukan pada form. Kategori berubah menjadi uang saku, beasiswa, kerja, dan lainnya.
3. **Periksa riwayat:** cari nama/kategori/catatan atau pilih filter. Ketuk satu transaksi untuk membuka detail berdasarkan ID.
4. **Hapus:** di detail tekan Hapus transaksi, lalu Ya, hapus transaksi. Ada tombol Batal agar tidak menghapus tanpa sengaja.
5. **Atur anggaran:** isi batas pengeluaran, simpan, lalu kembali ke beranda. Pemakaian >=80% menghasilkan peringatan; pengeluaran >100% menghasilkan status melewati batas. Tepat 100% masih berstatus peringatan, dengan sisa nol.
6. **Dark mode:** Anggaran > Ubah tampilan terang / gelap > Toggle Theme. Kembali ke halaman lain untuk melihat tema yang ikut berubah.
7. **Tips:** buka Pusat bantuan lalu pilih panduan. Contoh URL web: `/docs/hemat/keinginan`.
8. **Mulai dari nol:** Anggaran > Mulai catatan kosong > Ya, ganti data. Ini menghapus catatan lokal dan mengembalikan batas menjadi Rp900.000.

Nominal menerima rupiah bulat, misalnya `25000` atau `25.000`. Nilai nol, negatif, desimal, dan nilai di atas Rp1.000.000.000 per transaksi ditolak. Tanggal harus `YYYY-MM-DD`, valid, dan tidak boleh melebihi hari ini. Transaksi bertanggal bulan sebelumnya tetap ada di Riwayat tetapi tidak masuk ringkasan bulan berjalan.

## 6. Verifikasi sebelum demo

```bash
npm run check
```

Pastikan TypeScript dan lint tidak melaporkan error, serta delapan test lulus. Setelah itu buka aplikasi dan coba tambah, filter, detail, hapus, ubah anggaran, ubah tema, dan buka panduan. Tutup/buka kembali atau refresh untuk memeriksa penyimpanan transaksi dan anggaran. Tema memang kembali ke terang saat sesi baru.

## 7. Masalah yang sering muncul

| Pesan/kondisi | Langkah |
| --- | --- |
| `node` atau `npm` tidak dikenali | Pasang Node.js 24 LTS, lalu tutup dan buka kembali VS Code. |
| `ENOENT ... package.json` | Terminal sedang di folder salah. Buka folder MoneyTrack yang berisi package.json. |
| PowerShell menolak `npm.ps1` | Ganti profil terminal VS Code menjadi Command Prompt, atau gunakan `npm.cmd ci` dan `npm.cmd start`. Tidak perlu mengubah kebijakan sistem. |
| QR tidak tersambung | Pastikan Wi-Fi sama, matikan VPN, dan izinkan akses jaringan privat. Coba `npx expo start --go --tunnel` jika LAN kampus memblokir; ikuti pemasangan tunnel bila diminta. |
| Expo Go incompatible | Cocokkan SDK 57 di package.json dengan versi Expo Go melalui expo.dev/go. Jangan mengubah hanya paket expo. |
| Modul tidak ditemukan | Jalankan `npm ci` setelah seluruh file digabung, kemudian `npx expo start --go --clear`. |
| Cache menampilkan tampilan lama | Hentikan server lalu jalankan `npx expo start --go --clear`. |
| Port 8081 sudah dipakai | Setujui port lain yang ditawarkan Expo. Gunakan alamat terbaru dari terminal. |
| Test tidak mengenali file .ts | Gunakan Node.js 24 seperti petunjuk, bukan Node versi lama. |
| Data contoh tidak muncul | Data lama masih ada. Gunakan Muat ulang data contoh dan konfirmasi. |
| Data lama gagal dibaca | Aplikasi menghentikan penyimpanan agar data lama tidak tertimpa. Coba buka ulang; pilih Mulai catatan kosong hanya bila siap mengganti data lokal. |
| `npm ci` gagal setelah mengedit package.json | Jika sengaja mengubah dependensi, jalankan `npm install` untuk memperbarui lockfile, lalu commit kedua file. Pada paket asli gunakan npm ci. |

Internet diperlukan untuk unduh dependensi dan jalur tunnel. Setelah bundle dimuat, aplikasi tidak memanggil API keuangan. Server Metro harus tetap berjalan saat pengembangan. Data web tersimpan pada origin browser; data Expo Go berada pada penyimpanan aplikasi di perangkat. Keduanya tidak otomatis sama.
