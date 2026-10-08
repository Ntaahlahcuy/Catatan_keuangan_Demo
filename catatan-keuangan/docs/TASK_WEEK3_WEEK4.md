# Penerapan Task 01–03 Week 3 dan Week 4

Contoh PresidentKu pada slide diterapkan pada SakuIn dengan mempertahankan tema dan komponen UI program pengguna.

## Week 3 — Task 01: Build the authentication flow

Sumber: week3.pptx, slide 6.

1. Daftar menerima nama, email, password dan konfirmasi password.
2. Validasi memeriksa input kosong, format email, password 6–128 karakter, nama maksimal 80 karakter, dan kesamaan konfirmasi.
3. Daftar berhasil memberi feedback dan membuka form Masuk.
4. Login memeriksa email dan hasil derivasi password terhadap verifier tersimpan.
5. Credential benar membuat token acak dan membuka Beranda. Credential salah memberi pesan umum “Email atau password salah.”
6. AuthProvider mengelola status login. Stack.Protected melindungi Beranda dan Panduan.
7. Input memiliki label terlihat dan accessibilityLabel. Tombol memiliki peran dan label; password tersembunyi saat form dibuka.
8. Logout melalui Profil atau menu akun menghapus sesi dan mengunci halaman privat.

File: src/app/auth.tsx, src/context/auth-context.tsx, src/app/_layout.tsx, src/lib-storage.ts, src/lib/auth-validation.ts.

## Week 3 — Task 02: Secure the local data

Sumber: week3.pptx, slide 9.

| Kelompok | Contoh SakuIn | Penanganan |
| --- | --- | --- |
| Data autentikasi sensitif | Verifier password, token, sesi | SecureStore native; vault terenkripsi web |
| Data pribadi | Nama, email, transaksi pribadi | Profil native di SecureStore; transaksi native terenkripsi; seluruh record web dalam vault |
| Kunci enkripsi | Kunci untuk membuka transaksi | SecureStore native; CryptoKey non-extractable web |
| Data biasa | Label kategori, tab terpilih, alamat API, transaksi fiktif | Tab berada di state UI; alamat API pada konfigurasi publik; tidak mengandung credential |

Password asli hanya dipakai untuk derivasi dan tidak ditulis ke disk. Verifier menyimpan salt, hasil PBKDF2-HMAC-SHA256, dan jumlah iterasi. Token memakai 32 byte acak kriptografis.

Fungsi secureGet/privateGet membaca data kembali. Transaksi panjang dienkripsi AES-GCM sebelum disimpan pada AsyncStorage, sementara kuncinya tetap pada SecureStore. Logout menghapus sesi; profil dan verifier dipertahankan untuk login berikutnya.

Web memiliki adapter terpisah karena SecureStore ditujukan untuk native. Perlindungan vault mengikuti keamanan origin browser, bukan keystore Android/iOS.

File: src/lib-storage.ts, src/lib/secure-storage.ts, src/lib/secure-storage.web.ts. Plugin expo-secure-store dicantumkan pada app.json.

## Week 3 — Task 03: Validate the security

Sumber: week3.pptx, slide 12.

tests/security.test.cjs menguji credential benar/salah, input kosong, logout, sesi kedaluwarsa/rusak, verifier, enkripsi dan migrasi.

Browser juga memeriksa form, password tersembunyi, halaman privat, pembacaan kembali data dan penghapusan sesi. Hasil aktual ada pada HASIL_PENGUJIAN.md. Panduan uji aksesibilitas ada pada PANDUAN_DEMO.md. Pemeriksaan browser tidak menggantikan TalkBack/VoiceOver di HP.

## Week 4 — Task 01: Model the data

Sumber: week4.pptx, slide 9.

Resource utama adalah transaksi. TransactionDTO menjelaskan JSON server, sedangkan Transaction menjelaskan data untuk saldo, ringkasan dan daftar.

MODEL_DATA.md memuat resource, field, tipe, contoh JSON dan mapping. Implementasi ada pada src/models/transaction.ts.

## Week 4 — Task 02: Connect to REST API

Sumber: week4.pptx, slide 10.

Slide memakai api.example.com sebagai ilustrasi tanpa endpoint nyata. Paket ini menyediakan REST API Node.js untuk transaksi fiktif.

Alur: GET /api/transactions, server membaca server/transactions.json, respons HTTP 200 berupa JSON, response.json(), validasi field, mapping DTO menjadi Transaction.

src/services/transaction-service.ts memakai Fetch dan menangani HTTP gagal, JSON invalid, putus koneksi, timeout 8 detik dan pembatalan request. Alamat API dapat diatur melalui EXPO_PUBLIC_API_URL. Server menyediakan CORS untuk web.

Password dan token akun lokal tidak dikirim ke server contoh. Endpoint hanya menyajikan data fiktif untuk latihan GET.

## Week 4 — Task 03: Display API data

Sumber: week4.pptx, slide 11.

src/hooks/use-api-transactions.ts mengelola state data/loading/error/muat ulang. UI di src/app/index.tsx menggunakan hasil mapping:

- BalanceCard menghitung pemasukan, pengeluaran dan saldo.
- ExpenseSummary menghitung total kategori.
- TransactionList menampilkan nama, kategori, tanggal dan nominal.
- Riwayat menampilkan semua transaksi.
- Loading/error memiliki feedback.
- Muat ulang atau tarik ke bawah meminta data terbaru.
- Request lama dibatalkan agar tidak menimpa hasil terbaru.

Empat contoh berasal dari API, bukan array transaksi statis dalam layar. Catatan pengguna tetap tersimpan lokal sebagai fitur program awal. Kedua sumber diberi label.

## Batas cakupan

Paket menyediakan implementasi keenam task dan bukti uji. Pengujian fisik Expo Go serta commit/push ke repository kelas perlu dilakukan pada perangkat dan repository pengguna.
