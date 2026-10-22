# Money Track - dompet mahasiswa

Aplikasi React Native + TypeScript + Expo Router untuk membantu mahasiswa mencatat uang saku, mengenali belanja karena keinginan, dan membatasi pengeluaran bulanan. Dibuat untuk Demo Modul 2: State, Hooks, dan Navigasi Page.

## Mulai cepat di VS Code

Gunakan Node.js **24 LTS**, npm, dan koneksi internet untuk instalasi pertama.

```bash
npm ci
npm start
```

`npm start` menjalankan `expo start --go`. Buka dengan Expo Go yang mendukung **SDK 57**, sama dengan versi repositori contoh. Untuk mencoba di browser:

```bash
npm run web
```

Tidak perlu Python, database server, API key, login aplikasi, Android Studio, atau membuat APK untuk mencoba lewat Expo Go/web.

## Fitur

- Pemasukan dan pengeluaran dengan kategori, tanggal, dan catatan.
- Penanda kebutuhan/keinginan untuk mengenali belanja impulsif.
- Ringkasan bulan berjalan, batas pengeluaran, dan peringatan 80%/melewati batas.
- Riwayat semua bulan, pencarian, filter, detail transaksi, dan hapus dengan konfirmasi.
- Penyimpanan lokal dengan AsyncStorage; data contoh saat pertama dibuka.
- Dark mode melalui context serta pusat bantuan dengan catch-all route.

## Panduan

- [Cara menjalankan dan masalah umum](docs/PANDUAN_MENJALANKAN.md)
- [Skenario demo, pertanyaan, dan latihan modifikasi](docs/DEMO_DAN_LATIHAN.md)
- [Pemetaan rubrik dan Codelab](docs/RUBRIK_DAN_CODELAB.md)
- [Pembagian dua anggota dan push GitHub](docs/GITHUB_DUA_ANGGOTA.md)
- [Sumber dan perubahan dari contoh](ATTRIBUTION.md)
- [Hasil verifikasi](docs/HASIL_VERIFIKASI.md)

## Pemeriksaan kode

```bash
npm run check
```

Perintah tersebut memeriksa TypeScript, lint, dan 8 pengujian perhitungan/validasi keuangan. Tidak membuat APK. Node.js 24 dipakai agar test TypeScript bisa berjalan tanpa alat tambahan.

## Data dan batas penggunaan

Beranda menghitung bulan kalender saat ini menurut waktu perangkat. Riwayat mencakup semua bulan. Selisih uang adalah pemasukan dikurangi pengeluaran bulan ini, bukan saldo rekening dan tidak membawa saldo bulan sebelumnya. Batas anggaran yang sama berlaku setiap bulan; pemakaiannya dihitung ulang dari transaksi masing-masing bulan. Aplikasi memulai dengan data contoh yang bisa diganti lewat Anggaran. Data keuangan tersimpan lokal, tidak disinkronkan antarperangkat. Tema hanya bertahan selama sesi aplikasi.

Kedua folder pembagian kontribusi harus digabung menjadi satu project. Untuk langsung mencoba, gunakan paket lengkap. Tidak ada akun GitHub atau identitas anggota yang dibuatkan secara otomatis.
