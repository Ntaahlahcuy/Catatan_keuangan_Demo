# Hasil verifikasi paket

Pemeriksaan dilakukan pada 22 Oktober 2026 dengan Node.js 24 dan dependensi terkunci dalam package-lock.json. Ini adalah hasil pemeriksaan paket yang disiapkan, bukan bukti penilaian dari asisten praktikum.

| Pemeriksaan | Hasil |
| --- | --- |
| Instalasi dependensi | Berhasil menggunakan dependensi SDK 57 dari contoh, ditambah AsyncStorage dan tipe Node. |
| TypeScript | npm run typecheck lulus tanpa error. |
| Lint | npm run lint lulus. |
| Logika keuangan | 8 test lulus: nominal, tanggal, ringkasan per bulan, saldo negatif/kosong, batas/pembulatan persentase, hapus, baca data valid, dan penolakan data rusak. |
| Bundle Android | Expo export berhasil menghasilkan bundle Android. |
| Bundle iOS | Expo export berhasil menghasilkan bundle iOS. |
| Bundle web | Expo export berhasil menghasilkan bundle web. |
| Alur penggunaan web | 12 skenario otomatis lulus dan tidak ada page error. |
| Lebar layar web | Beranda dicek pada 320, 390, dan 1280 piksel tanpa overflow horizontal. |
| Pembagian file | Semua source dibagi tanpa path ganda; gabungan kedua bagian dibandingkan dengan project lengkap. |

## Skenario penggunaan yang diperiksa

Dua belas skenario mencakup pemuatan data contoh; validasi nama/nominal; tambah pengeluaran; pencarian, filter, detail, dan kembali; peringatan 85%; kondisi melewati batas dan penyimpanan setelah reload; tema lintas halaman; panduan catch-all; konfirmasi hapus dan hitung ulang; tambah pemasukan; penanganan ID/path salah; serta reset dan keadaan kosong.

## Batas pemeriksaan

Bundle Android/iOS berhasil dibuat, tetapi aplikasi belum dijalankan pada HP fisik dalam proses ini. Coba sendiri pada perangkat dan Expo Go SDK 57 yang akan dipakai sebelum demo. Proses ini tidak membuat APK, tidak melakukan penilaian individu, dan tidak membuat repository atau melakukan push ke GitHub. Kecocokan paket diperiksa terhadap metadata SDK yang terpasang; pemeriksaan jaringan Expo secara penuh tidak selesai karena koneksi proxy.

Script pengujian browser memakai alat internal untuk memeriksa hasil. Paket source yang dikirim menyertakan test logika yang dapat dijalankan dengan npm test; skenario browser dijelaskan di atas dan dapat diikuti secara manual melalui panduan demo. Tidak perlu memasang alat browser tambahan untuk menjalankan aplikasinya.
