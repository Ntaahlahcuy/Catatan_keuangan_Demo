# Pemetaan rubrik dan Codelab

Sumber: Modul 2(6).pdf halaman 42-43. Tabel penilaian berisi Codelab 1-2 sebesar 40%, dan tugas demo sebesar 60%. Lima butir di bawah tugas demo berjumlah 60%; tidak dijumlahkan lagi menjadi 160%.

| Kriteria | Bobot | Bukti dalam project | Cara menunjukkan |
| --- | --- | --- | --- |
| Codelab 1-2 | 40% | ThemeContext, app/usecontext_example.tsx; app/docs/ dan styles/ | Ubah tema; buka panduan dengan beberapa segmen URL. Siapkan jawaban latihan masing-masing. |
| useState dan useEffect | 10% | context/MoneyContext.tsx; app/tambah.tsx | Ubah input, simpan transaksi, lalu buka ulang aplikasi. Jelaskan effect baca sekali dan simpan saat data berubah. |
| push, back, dan satu fungsi lain | 10% | app/riwayat.tsx; components/UI.tsx; app/tambah.tsx | Riwayat ke detail memakai push; tombol kembali memakai back; simpan form memakai replace. canGoBack memberi fallback. |
| _layout dan Stack.Screen | 10% | app/_layout.tsx; app/docs/_layout.tsx; detail transaksi | Tunjukkan judul halaman, root stack, nested stack panduan, dan judul dinamis detail. |
| Menjawab pertanyaan | 15% | Kesiapan masing-masing anggota | Pelajari jawaban dan jelaskan alur tanpa membaca modul saat penilaian. |
| Modifikasi langsung | 15% | Kemampuan masing-masing anggota | Latih perubahan threshold, kategori, dan data contoh; jalankan ulang dan periksa hasil. |
| Total | 100% | | |

Fitur dan source code membantu menyiapkan demonstrasi, tetapi 30% pertanyaan/modifikasi tetap dinilai dari kemampuan individu; kelengkapan source tidak menjamin nilai tertentu.

## Codelab 1 - jawaban dan implementasi

Halaman 17 meminta `usecontext_example.tsx` tentang Dark Mode. Jawaban bentuk dasar tersedia di `latihan/codelab1/usecontext_example.tsx`. File tersebut adalah bahan belajar, tidak diakses sebagai URL karena berada di luar folder app.

Bagian kosong yang dilengkapi:

1. Import `createContext`, `useContext`, dan `useState` dari `react`.
2. Import `View`, `Text`, dan `Button` dari `react-native`.
3. Buat context memakai `createContext`.
4. Bungkus `<Home />` menggunakan `ThemeContext.Provider` dan berikan `value={{ darkMode, setDarkMode }}`.
5. Komponen terdalam membaca `useContext(ThemeContext)`.

Alur tetap `Home -> Profile -> UserCard -> UserName`; komponen perantara tidak mengoper prop tema. Jawaban memakai tipe yang jelas dan pemeriksaan null menggantikan `any` pada contoh.

Untuk aplikasi Money Track, provider dipindahkan ke `context/ThemeContext.tsx` dan dipasang di root layout. Halaman `app/usecontext_example.tsx` mempertahankan rantai komponen tersebut dan menggunakan `useTheme()`, yang membungkus `useContext()`. Dengan begitu tema juga berlaku ke halaman lain. Demo: Anggaran > Ubah tampilan > Toggle Theme.

## Codelab 2 - routing dan external styling

Struktur utama yang diminta halaman 39-41 sudah ada:

- `app/_layout.tsx`: root Stack dan Stack.Screen.
- `app/index.tsx`: halaman awal dengan `useRouter` setara akses object `router`; project memakai `router` yang diimpor langsung.
- `app/docs/index.tsx`: daftar dokumentasi.
- `app/docs/[...slug].tsx`: halaman catch-all.
- `components/PageButton.tsx`: komponen tombol yang digunakan kembali.
- `styles/page.ts`, `styles/button.ts`, `styles/index.ts`: style terpisah dan barrel export.

`app/docs/_layout.tsx` ditambahkan untuk memberi header sendiri pada pusat bantuan. `@/` mengacu ke root project melalui `tsconfig.json`. Huruf besar-kecil nama berkas/import konsisten: `PageButton.tsx`, bukan `pageButton.tsx`.

Bagian kosong pada root layout contoh di halaman 40 dilengkapi menjadi:

```tsx
import { Stack } from 'expo-router';
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="docs" options={{ title: 'Documentation' }} />
    </Stack>
  );
}
```

Bagian kosong pada halaman awal contoh adalah `useRouter()`. Bentuknya:

```tsx
const router = useRouter();
// Pada tombol:
router.push('/docs');
```

Pada versi terintegrasi, judul dan isi halaman disesuaikan dengan Money Track, dan root layout memiliki provider serta route tambahan. Bentuk ringkas di atas untuk memahami jawaban; jangan menimpa root layout final dengannya karena akan menghilangkan provider.

Catch-all membaca `useLocalSearchParams`, menormalkan slug ke string path, kemudian mengambil isi dari `constants/guides.ts`. Contoh URL `/docs/hemat/keinginan` ditangkap sebagai dua segmen `['hemat', 'keinginan']` lalu digabung menjadi `hemat/keinginan`. URL tidak dikenal menampilkan pesan yang aman. Dynamic route `/transaksi/[id]` berbeda: hanya menangkap satu ID.

## Berkas yang sebaiknya dibuka sebelum latihan

1. `app/_layout.tsx`: provider, Stack, Screen, dan header.
2. `context/MoneyContext.tsx`: state, effect, AsyncStorage, dan fungsi perubahan data.
3. `app/tambah.tsx`: state input, validasi, simpan, replace.
4. `app/riwayat.tsx` dan `app/transaksi/[id].tsx`: push, ID, pencarian transaksi.
5. `components/UI.tsx`: tombol back dengan pemeriksaan history.
6. `context/ThemeContext.tsx` dan `app/usecontext_example.tsx`: Codelab 1.
7. `app/docs/[...slug].tsx`: Codelab 2.
