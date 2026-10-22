# Pembagian dua anggota dan panduan push GitHub

## 1. Bentuk paket dan pembagian kerja

Paket pembagian memiliki **dua folder utama**: `01_Anggota_1` dan `02_Anggota_2`. Di dalam masing-masing ada folder `project` serta catatan tugas anggotanya. Semua path di dalam `project` sudah mengikuti path project final.

| Anggota | Bagian utama | Yang harus dipahami saat demo |
| --- | --- | --- |
| 1 | Konfigurasi project, tipe/model, data contoh, MoneyContext, perhitungan/validasi, beranda, form tambah, riwayat, test keuangan | useState, useEffect, simpan lokal, input terkontrol, perhitungan, push dan replace |
| 2 | ThemeContext, komponen bersama dan style, root/nested layout, detail dan hapus, anggaran, dark mode, docs catch-all, jawaban Codelab 1 | useContext, Stack.Screen, back/canGoBack, ID, catch-all, tema, pengaturan anggaran |

Panduan tertulis berada pada bagian anggota 1 untuk titik masuk bersama. Pembagian ini memisahkan tanggung jawab dan path file; keduanya tetap perlu menguji, mempelajari, dan menyesuaikan pekerjaannya sendiri. Nama Anggota 1/2 adalah label pembagian, bukan identitas commit.

**Satu folder anggota bukan aplikasi mandiri.** Beberapa file merujuk bagian anggota lain. Keduanya harus digabung sebelum instalasi/pengujian final. Paket lengkap disediakan agar kalian bisa mencoba dan mempelajari hasil integrasi sejak awal.

Hasil GitHub harus **satu project di root satu repository**. Jangan mengunggah kedua folder Anggota sebagai dua aplikasi. Contoh: `01_Anggota_1/project/context/MoneyContext.tsx` disalin menjadi `context/MoneyContext.tsx` di repository; `02_Anggota_2/project/context/ThemeContext.tsx` menjadi `context/ThemeContext.tsx`. Folder `context` digabung, tidak diganti seluruhnya.

Gunakan akun dan email GitHub masing-masing. Baca, uji, dan sesuaikan bagian sendiri sebelum commit. Jangan memalsukan identitas, tanggal commit, atau menganggap dua commit kosong membuktikan kontribusi. Masing-masing perlu bisa menjelaskan dan memodifikasi kode saat demo individu.

## 2. Cara paling sederhana: unggah bagian 1, lalu PR bagian 2

Alur ini sengaja berurutan agar tidak timbul error repository kosong atau konflik awal. Sesudah kedua bagian digabung, perubahan berikutnya dilakukan pada branch fitur masing-masing.

### A. Pemilik membuat repository kosong

1. Anggota 1 login ke GitHub dan pilih **New repository**.
2. Nama contoh: `money-track-mahasiswa`.
3. Pilih visibilitas sesuai aturan kelas. Jangan centang pembuatan README, .gitignore, atau license karena file awal sudah disediakan.
4. Klik Create repository. Salin URL HTTPS repository **milik kelompok**, bukan URL contoh dosen.
5. Settings > Collaborators (atau menu akses yang setara) > Add people. Undang username Anggota 2. Anggota 2 harus menerima undangan sebelum push branch.

Alamat contoh pada perintah berikut harus diganti. `USERNAME_PEMILIK` adalah akun pemilik repository, dan NAMA/EMAIL adalah identitas anggota yang menjalankan perintah. Email harus terhubung ke akun GitHub atau memakai alamat noreply resmi akun tersebut agar kontribusi dapat dikaitkan.

### B. Anggota 1 menyalin bagian 1 dan push pertama

1. Buat folder lokal bernama `money-track-mahasiswa`.
2. Buka `01_Anggota_1/project` hasil ekstraksi. Tampilkan file tersembunyi, pilih **semua isinya**, termasuk `.gitignore` dan `.gitattributes`, lalu salin ke folder lokal tadi.
3. Buka folder lokal tadi di VS Code. Pastikan package.json terlihat langsung.
4. Pada terminal jalankan satu per satu:

```bash
git init
git config user.name "NAMA_ANGGOTA_1"
git config user.email "EMAIL_ANGGOTA_1"
git branch -M main
git add .
git status
git commit -m "feat: tambah model keuangan, state, form, beranda, dan riwayat"
git remote add origin https://github.com/USERNAME_PEMILIK/money-track-mahasiswa.git
git push -u origin main
```

Periksa `git status` sebelum commit: node_modules, .expo, dist, dan file .env tidak boleh ikut. Git Credential Manager dapat membuka browser untuk login GitHub. Ikuti login akun sendiri. Password akun GitHub tidak dimasukkan sebagai password Git HTTPS; gunakan autentikasi yang disediakan Git Credential Manager.

Push pertama hanya memuat bagian Anggota 1. **Aplikasi memang belum lengkap pada tahap ini.** Jangan menyatakan tahap ini siap demo. Pengujian final dilakukan sesudah PR bagian 2 digabung.

### C. Anggota 2 clone, buat branch, salin bagian 2, dan push

Anggota 2 menerima undangan, kemudian membuka terminal di folder tempat ingin menyimpan project:

```bash
git clone https://github.com/USERNAME_PEMILIK/money-track-mahasiswa.git
cd money-track-mahasiswa
git config user.name "NAMA_ANGGOTA_2"
git config user.email "EMAIL_ANGGOTA_2"
git switch -c fitur/anggota-2
```

Sekarang buka `02_Anggota_2/project` hasil ekstraksi, salin **semua isinya** ke root repository hasil clone. Ketika Windows meminta menggabungkan folder `app`, `context`, dan `constants`, gabungkan. Tidak ada path file sumber yang sengaja dimiliki kedua anggota sekaligus.

Jangan membuat folder tambahan `project` di dalam repository, dan jangan menyalin file dari ZIP lengkap ke commit kedua. Setelah penyalinan, package.json tetap satu di root; folder app berisi _layout, index, tambah, riwayat, anggaran, dan route lainnya.

```bash
npm ci
npm run check
npm run web
```

Coba alur aplikasi. Tekan Ctrl+C untuk menghentikan server, lalu:

```bash
git status
git add .
git commit -m "feat: tambah layout, detail, anggaran, tema, dan panduan hemat"
git push -u origin fitur/anggota-2
```

### D. Buat pull request dan gabungkan

1. Di GitHub buka repository kelompok, pilih Compare & pull request untuk branch `fitur/anggota-2`.
2. Pastikan **base: main**, **compare: fitur/anggota-2**.
3. Judul: `Tambah navigasi, anggaran, tema, dan panduan`.
4. Isi deskripsi dengan fitur yang ditambahkan dan pemeriksaan yang benar-benar dilakukan, misalnya `npm run check` dan demo tambah/hapus/tema.
5. Anggota 1 membaca perubahan dan mencoba hasilnya. Pilih **Create a merge commit** untuk menggabungkan dan mempertahankan commit kedua anggota dalam history.
6. Anggota 1 memperbarui salinan lokal:

```bash
git pull origin main
npm ci
npm run check
npm start
```

Anggota 2 juga kembali ke main yang sudah lengkap:

```bash
git switch main
git pull origin main
```

Sekarang `main` memuat hasil gabungan. Simpan tautan repository dan pull request untuk menunjukkan pembagian kerja.

## 3. Untuk perubahan berikutnya oleh setiap anggota

Mulai dari main terbaru dan branch sendiri. Contoh untuk Anggota 1:

```bash
git switch main
git pull origin main
git switch -c fitur/perbaikan-validasi
```

Edit file, uji, lalu jalankan:

```bash
git add app/tambah.tsx
git commit -m "fix: perjelas validasi nominal transaksi"
git push -u origin fitur/perbaikan-validasi
```

Buat PR ke main dan minta pasangan memeriksa. Anggota 2 memakai branch lain sesuai tugasnya. Hindari mengedit file milik pasangan bersamaan tanpa koordinasi.

## 4. Bila ingin menggabungkan folder secara lokal dahulu

Buat folder baru, salin isi `01_Anggota_1/project`, lalu gabungkan isi `02_Anggota_2/project` ke folder yang sama. Hasilnya harus sama dengan paket lengkap, kecuali dokumen hasil verifikasi yang dibuat sesudah pengujian. Jalankan npm ci dan npm run check. **Cara ini untuk mencoba integrasi**, bukan untuk mengunggah semuanya dengan satu akun lalu membuat commit kosong dari akun lain.

## 5. Masalah Git yang umum

| Kondisi | Perbaikan |
| --- | --- |
| `git` tidak dikenali | Pasang Git lalu buka ulang VS Code. |
| `src refspec main does not match any` | Pastikan sudah ada commit dan branch bernama main. Jalankan git status lalu git branch. |
| `remote origin already exists` | Periksa git remote -v. Bila URL keliru, gunakan git remote set-url origin URL_REPO_KELOMPOK. |
| `403` atau permission denied | Pastikan akun benar, undangan collaborator diterima, dan URL mengarah ke repository kelompok. |
| `non-fast-forward` | Ambil perubahan terbaru dahulu. Pada branch kerja gunakan git pull --rebase origin NAMA_BRANCH setelah commit lokal; selesaikan konflik, baru push. Jangan force-push untuk mengatasi ketidaktahuan. |
| Push ditolak karena main dilindungi | Push branch fitur lalu buat PR sesuai aturan repository. |
| Folder app tidak lengkap sesudah penyalinan | Gabungkan isi kedua folder project, jangan mengganti satu folder app dengan folder app anggota lain. |
| node_modules terlanjur masuk staging | Sebelum commit, jalankan git rm -r --cached node_modules lalu periksa .gitignore dan git status. Folder lokal tetap ada. |

## 6. Checklist hasil GitHub

- Repository kelompok memuat satu project lengkap di root dan npm ci dapat dijalankan di sana.
- Commit memperlihatkan identitas akun/email masing-masing anggota yang benar.
- Ada PR yang menjelaskan bagian Anggota 2 dan hasil pengujiannya.
- Kedua anggota sudah clone/pull main terbaru dan mencoba aplikasi.
- node_modules, .expo, dist, file .env, dan data pribadi tidak ikut di repository.
- Tautan yang diserahkan adalah repository kelompok, bukan repositori contoh dosen.

Paket ini tidak membuat repository atau melakukan push ke akun siapa pun. Perintah di atas dijalankan pada akun kelompok kalian. PDF menyebut tiga anggota; ikuti persetujuan kelas jika kelompok kalian dua orang.
