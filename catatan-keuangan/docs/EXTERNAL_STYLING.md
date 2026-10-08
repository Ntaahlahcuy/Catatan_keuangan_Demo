# External Styling untuk Demo Modul 1

Style utama sudah dipisahkan dari komponen layar ke file TypeScript eksternal.
Komponen mengimpor objek hasil `StyleSheet.create()` dan menerapkannya pada JSX.

| Layar | File style | Objek yang diekspor |
| --- | --- | --- |
| `src/app/index.tsx` | `src/styles/finance.styles.ts` | `financeStyles` |
| `src/app/auth.tsx` | `src/styles/auth.styles.ts` | `authStyles` |
| `src/app/explore.tsx` | `src/styles/guide.styles.ts` | `guideStyles` |

## Contoh external styling yang benar-benar digunakan

File `src/styles/finance.styles.ts` mengekspor `financeStyles` menggunakan
`StyleSheet.create()`. Layar Beranda mengimpornya melalui:

```tsx
import { financeStyles as styles } from '@/styles/finance.styles';
```

`as styles` adalah alias: nama `financeStyles` dipakai sebagai `styles` di file
layar, sehingga pemakaiannya tetap mudah dibaca. Contoh penerapan pada JSX:

```tsx
<Text style={styles.appName}>SakuIn</Text>
```

Jika ingin mengganti warna kartu saldo, edit `mainCard.backgroundColor` di
`src/styles/finance.styles.ts`. Jika ingin mengganti style form masuk/daftar,
edit `src/styles/auth.styles.ts`. Style panduan berada di `guide.styles.ts`.

## Inline styling yang tetap digunakan

Warna nominal transaksi bergantung pada pemasukan atau pengeluaran:

```tsx
<Text
  style={[
    styles.transactionAmount,
    { color: item.type === 'income' ? '#047857' : '#B91C1C' },
  ]}
>
  {/* Nominal transaksi ditampilkan di sini. */}
</Text>
```

Ini menggabungkan style eksternal `transactionAmount` dengan style inline yang
bergantung pada data. Contoh lain adalah ukuran sapaan untuk layar kecil serta
opacity tombol ketika login sedang diproses.

## Kriteria kode Demo Modul 1

| Kriteria | Contoh pada aplikasi |
| --- | --- |
| Custom function dan loop | `formatRupiah()`, `addTransaction()`, `.map()` pada transaksi dan navigasi |
| Type dan array of objects | `Transaction`, `SummaryItem`, array data ringkasan dan objek menu |
| Inline dan external styles | Style dinamis dalam JSX serta import dari `src/styles/` |

Refactor ini memindahkan objek style beserta nilai aslinya. Properti untuk Android,
iOS, dan web tetap ditentukan oleh `Platform` pada style yang memerlukannya.
Pemeriksaan setelah refactor dicatat di `docs/VERIFIKASI_EXTERNAL_STYLING.md`.

## Pembagian pekerjaan GitHub

A memegang `src/app/`, `src/styles/`, komponen, aset, dan konfigurasi. B memegang
logika autentikasi, penyimpanan, model, REST API, pengujian, dan dokumentasi.
Gunakan `COMMAND_A.txt` dan `COMMAND_B.txt` di folder utama paket untuk push awal.
Folder `PROGRAM_LENGKAP/catatan-keuangan` dapat langsung dipakai untuk menjalankan
program, sedangkan folder A dan B dipakai untuk urutan commit terpisah.
