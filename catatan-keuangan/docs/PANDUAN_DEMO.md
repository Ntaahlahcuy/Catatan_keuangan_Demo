# Panduan demonstrasi

## Persiapan

Jalankan npm ci, npm run api dan npm start/npm run web sesuai README. Untuk latihan, daftar nama Mahasiswa, email mahasiswa@example.com, password Belajar123. Akun ini tidak otomatis dibuat.

## Week 3

1. Buka aplikasi tanpa login; form Masuk tampil.
2. Tekan Masuk dengan input kosong; tunjukkan validasi.
3. Buka Daftar, isi data, gunakan konfirmasi password berbeda; tunjukkan validasi.
4. Benarkan konfirmasi, tekan Daftar; tunjukkan feedback dan form Masuk.
5. Login dengan password salah; tunjukkan pesan umum credential salah.
6. Login dengan password benar; tunjukkan Beranda dan nama pengguna.
7. Muat ulang; sesi masih tersedia selama belum berakhir.
8. Tambah catatan pribadi lalu muat ulang; data dapat dibaca kembali.
9. Buka Profil dan Keluar dari akun; form Masuk tampil.
10. Coba tombol kembali atau halaman privat; akses memerlukan login.

Penjelasan singkat:

“Password asli tidak disimpan. Verifier memakai PBKDF2 dengan salt acak. Pada Android/iOS, token, profil, verifier dan kunci enkripsi disimpan melalui SecureStore. Transaksi pribadi dienkripsi. Logout menghapus sesi dan mengunci halaman privat.”

Pada web, jelaskan vault AES-GCM di IndexedDB dan kunci non-extractable; tidak ada password/token plaintext di localStorage.

## Week 4

1. Tunjukkan server dan GET /api/transactions.
2. Buka endpoint di browser untuk menunjukkan JSON.
3. Tampilkan MODEL_DATA.md dan jelaskan mapping transaction_id menjadi id, name menjadi title, nominal menjadi amount, kind menjadi type.
4. Login, tunjukkan empat transaksi contoh server.
5. Sebelum catatan pribadi ditambahkan, saldo Rp425.000, pemasukan Rp500.000, pengeluaran Rp75.000.
6. Ubah name atau nominal pada server/transactions.json dan simpan.
7. Tekan Muat ulang; daftar, saldo dan ringkasan ikut berubah tanpa mengganti UI.
8. Hentikan API, tekan Muat ulang; tunjukkan pesan gagal koneksi.
9. Jalankan API lagi, tekan Muat ulang; data kembali tampil.
10. Tambah catatan pribadi; jelaskan catatan tersimpan di perangkat.

Penjelasan singkat:

“Aplikasi mengirim GET. Server mengirim array JSON. Respons diperiksa, JSON di-parse dan DTO dipetakan menjadi Transaction. State ini digunakan kartu saldo, ringkasan dan daftar.”

## Uji aksesibilitas pada HP

- Aktifkan TalkBack/VoiceOver.
- Periksa pembacaan label input dan tombol termasuk Tampilkan/Sembunyikan password.
- Periksa pesan validasi.
- Perbesar ukuran teks; form harus tetap dapat digulir.
- Periksa navigasi tab, kontras dan area sentuh.
- Uji portrait dan landscape pada perangkat yang mendukungnya.

## Commit dan push

Jika checklist kelas meminta commit/push, lakukan pada repository kelas setelah menyalin hasil paket. ZIP ini tidak terhubung ke repository tertentu dan tidak mengklaim commit/push yang belum dilakukan.
