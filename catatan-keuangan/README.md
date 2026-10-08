# SakuIn — Task Week 3/4 dan External Styling Modul 1

Program dari ZIP awal dikembangkan untuk Task 01–03 pada kedua materi. Contoh PresidentKu di slide diterapkan pada transaksi SakuIn. Nama aplikasi, tampilan hijau, kartu saldo, ringkasan kategori, dan pencatatan transaksi tetap digunakan.

## Cara menjalankan

1. Ekstrak ZIP. Buka terminal di folder yang berisi package.json.
2. Gunakan Node.js 22.13 atau lebih baru. Instal dependensi:

       npm ci

3. Terminal pertama, jalankan server API:

       npm run api

4. Terminal kedua, jalankan aplikasi web:

       npm run web

   Untuk HP melalui Expo Go:

       npm start

   Scan QR dengan Expo Go yang sesuai SDK 57. Laptop dan HP harus berada pada Wi-Fi yang sama. Kedua terminal harus tetap berjalan.

5. Tekan Daftar, isi nama, email, password minimal 6 karakter, dan konfirmasi password. Setelah daftar berhasil, masuk menggunakan akun tersebut. Tidak ada akun admin atau password bawaan.

## Menghubungkan API ke HP

Web menggunakan http://localhost:3001/api saat dijalankan dari localhost. Expo Go berusaha membaca alamat LAN host Expo secara otomatis.

Jika koneksi otomatis belum berhasil:

1. Jalankan ipconfig di Windows. Lihat IPv4 Address adapter Wi-Fi laptop.
2. Salin .env.example menjadi .env.
3. Ganti alamat dengan IPv4 laptop, misalnya:

       EXPO_PUBLIC_API_URL=http://192.168.1.10:3001/api

4. Hentikan Expo lalu jalankan npm start lagi.
5. Buka http://192.168.1.10:3001/api/health melalui browser HP. Jika tidak terbuka, periksa Wi-Fi dan izinkan koneksi Node.js pada jaringan privat melalui Windows Firewall.

Jangan memakai localhost pada HP untuk menunjuk laptop. Tunnel Expo tidak otomatis meneruskan port API. Jika memakai tunnel, alamat API juga harus dapat dijangkau HP.

Untuk web, gunakan localhost atau HTTPS agar Web Crypto tersedia. Web HTTPS memerlukan endpoint API HTTPS.

## Task yang diterapkan

| Materi | Task | Penerapan |
| --- | --- | --- |
| Week 3 | 01 — Authentication flow | Daftar, login, validasi, konfirmasi password, status autentikasi, halaman privat, logout |
| Week 3 | 02 — Secure local data | Verifier PBKDF2 dengan salt acak, SecureStore native, transaksi terenkripsi, vault AES-GCM web |
| Week 3 | 03 — Validate security | Uji credential, input kosong, sesi, logout, enkripsi, migrasi; panduan uji aksesibilitas |
| Week 4 | 01 — Data modeling | DTO, model Transaction, field, tipe, contoh JSON, mapping ke UI |
| Week 4 | 02 — REST API | Server contoh, GET, Fetch, cek HTTP, parsing JSON, validasi, timeout, pembatalan |
| Week 4 | 03 — Display API data | Data API pada saldo, ringkasan dan riwayat; loading, error, retry, tarik untuk muat ulang |

## Data contoh dan catatan pribadi

Server menyajikan empat transaksi fiktif dari server/transactions.json. Pada keadaan awal, pemasukan Rp500.000, pengeluaran Rp75.000, saldo Rp425.000.

Transaksi yang ditambahkan melalui aplikasi menjadi catatan pribadi yang tersimpan terenkripsi pada perangkat. Saldo dan ringkasan menghitung gabungan transaksi contoh dan catatan pribadi. Label pada daftar membedakan sumbernya.

Untuk membuktikan data dinamis, ubah name atau nominal pada server/transactions.json, simpan, lalu tekan Muat ulang. Perubahan tampil tanpa mengganti UI atau me-restart server.

API contoh hanya mendukung pembacaan GET; catatan pribadi tidak dikirim ke server. Autentikasi adalah simulasi lokal untuk praktikum: satu akun pada satu perangkat, tanpa sinkronisasi antarperangkat.

## Struktur file penting

| File/folder | Isi |
| --- | --- |
| src/app/auth.tsx | Form daftar/login, label, validasi dan feedback |
| src/app/_layout.tsx | Stack.Protected untuk membatasi halaman privat |
| src/context/auth-context.tsx | Status autentikasi bersama dan sesi 12 jam |
| src/lib-storage.ts | Akun, verifier password, sesi, transaksi dan migrasi |
| src/lib/secure-storage.ts | SecureStore dan enkripsi native |
| src/lib/secure-storage.web.ts | Vault browser terenkripsi dalam IndexedDB |
| src/models/transaction.ts | DTO, model, validasi dan mapping |
| src/services/transaction-service.ts | Alamat API dan HTTP GET |
| src/hooks/use-api-transactions.ts | State data/loading/error dan muat ulang |
| src/app/index.tsx | Saldo, ringkasan, transaksi dan navigasi |
| src/styles/finance.styles.ts | External styles Beranda, transaksi, ringkasan dan navigasi |
| src/styles/auth.styles.ts | External styles form masuk/daftar |
| src/styles/guide.styles.ts | External styles halaman panduan |
| server/ | API Node.js dan JSON transaksi fiktif |
| tests/ | Pengujian otomatis keamanan dan API |
| docs/ | Model data, pemetaan task, demo, hasil uji dan tangkapan layar |

## External Styling Modul 1

Style tiga layar aplikasi kini ditulis dalam file terpisah di `src/styles/` lalu diimpor ke `src/app/index.tsx`, `src/app/auth.tsx`, dan `src/app/explore.tsx`. Inline styling tetap dipakai untuk penyesuaian yang bergantung pada data atau kondisi layar, sehingga aplikasi menerapkan inline dan external styles sesuai kriteria kode Demo Modul 1.

Penjelasan dan contoh penerapannya ada di `docs/EXTERNAL_STYLING.md`.

## Pengujian

    npm run typecheck
    npm test

Untuk bundle seluruh platform:

    npx expo export --platform all

Lihat docs/HASIL_PENGUJIAN.md dan docs/PANDUAN_DEMO.md. node_modules dan hasil build tidak dimasukkan dalam ZIP; buat kembali dengan perintah di atas.

## Akun versi awal

Jika akun lama ada pada penyimpanan perangkat yang sama, aplikasi memindahkan profil dan catatan pengguna ke penyimpanan terlindungi, mengubah password lama menjadi verifier, dan menghapus sesi lama. Pengguna perlu login kembali. Tiga transaksi contoh versi awal digantikan data API agar tidak dihitung dua kali.

## Referensi implementasi

- week3.pptx: Task 01 slide 6, Task 02 slide 9, Task 03 slide 12.
- week4.pptx: Task 01–03 slide 9–11.
- Expo SDK 57: https://docs.expo.dev/versions/v57.0.0/
- SecureStore: https://docs.expo.dev/versions/v57.0.0/sdk/securestore/
- Expo Crypto: https://docs.expo.dev/versions/v57.0.0/sdk/crypto/
- Expo Router authentication: https://docs.expo.dev/router/advanced/authentication/
