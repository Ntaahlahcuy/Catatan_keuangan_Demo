# SakuIn — autentikasi dan penyimpanan

Dokumen ini diperbarui sesuai hasil Task 1–3 Week 3.

- Daftar membuat akun, kemudian pengguna masuk melalui form login.
- Email, nama, password dan konfirmasi password memiliki validasi.
- Password tersembunyi secara bawaan.
- Password asli tidak disimpan. Verifier memakai PBKDF2-HMAC-SHA256, salt acak, 120.000 iterasi.
- Profil, verifier, sesi dan kunci enkripsi memakai SecureStore pada Android/iOS.
- Transaksi native berupa ciphertext AES-GCM di AsyncStorage; kunci berada di SecureStore.
- Web memakai vault AES-GCM di IndexedDB dengan CryptoKey non-extractable.
- Logout menghapus sesi. Akun dan catatan tetap tersedia untuk login berikutnya.
- Sesi berlaku 12 jam dan halaman privat dilindungi Stack.Protected.
- Data akun versi lama dimigrasikan sebelum aplikasi dibuka.

Lihat README.md dan docs/HASIL_PENGUJIAN.md. Login merupakan simulasi lokal untuk praktikum, bukan autentikasi server.
