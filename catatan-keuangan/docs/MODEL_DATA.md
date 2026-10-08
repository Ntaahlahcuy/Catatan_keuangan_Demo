# Model data SakuIn

## Resource aplikasi

| Resource | Fungsi | Sumber |
| --- | --- | --- |
| Transaction | Daftar, pemasukan, pengeluaran, saldo dan ringkasan | API untuk contoh; penyimpanan terenkripsi untuk catatan pribadi |
| UserProfile | Nama dan email akun lokal | Penyimpanan terlindungi |
| UserSession | Status login dan masa berlaku | Penyimpanan terlindungi |

## Field API dan mapping ke UI

| Field TransactionDTO | Tipe | Field Transaction | Pemetaan |
| --- | --- | --- | --- |
| transaction_id | number, bulat positif | id: string | Awalan api-, misalnya 1 menjadi api-1 |
| name | string tidak kosong | title: string | Spasi tepi dibuang |
| category_name | string tidak kosong | category: string | Spasi tepi dibuang |
| nominal | number, bulat positif | amount: number | Nilai rupiah |
| kind | income atau expense | type: income atau expense | Jenis transaksi |
| occurred_at | string tanggal ISO | createdAt dan date: string | ISO untuk urutan; date untuk tampilan |
| — | — | source: api atau local | Sumber catatan |

Validasi menolak payload selain array, field salah tipe, nominal negatif, tanggal invalid dan ID ganda.

## Contoh JSON

GET /api/transactions mengirim HTTP 200 berupa array objek:

    [
      {
        "transaction_id": 1,
        "name": "Makan Siang",
        "category_name": "Makan",
        "nominal": 25000,
        "kind": "expense",
        "occurred_at": "2026-10-08T05:30:00.000Z"
      }
    ]

Ini adalah data fiktif. Server yang disertakan mengirim empat transaksi dari transactions.json.

## Model aplikasi

src/models/transaction.ts:

    type Transaction = {
      id: string;
      title: string;
      category: string;
      amount: number;
      type: 'income' | 'expense';
      date: string;
      createdAt?: string;
      source?: 'api' | 'local';
    };

createdAt dan source opsional agar catatan versi awal tetap dapat dibaca. Catatan baru dan data API mengisi keduanya.

src/lib-storage.ts:

    type UserProfile = { name: string; email: string };
    type UserSession = {
      token: string;
      email: string;
      expiresAt: number;
    };

expiresAt adalah milidetik sejak Unix epoch; sesi berlaku 12 jam sejak login.

## Proses mapping

    const response = await fetch('http://localhost:3001/api/transactions', {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Server gagal mengirim data.');
    const json = await response.json();
    const transactions = parseTransactionResponse(json);

parseTransactionResponse memanggil mapTransactionDTO untuk setiap objek. Hook menyimpan hasilnya ke state lalu komponen UI menampilkannya.

## Penggunaan model

| Komponen | Field | Perhitungan/tampilan |
| --- | --- | --- |
| BalanceCard | amount, type | Total income, total expense, saldo = income − expense |
| ExpenseSummary | category, amount, type | Total expense per kelompok |
| TransactionList | id, title, category, date, amount, type, source | Identitas baris, keterangan, nominal dan sumber |
| Urutan daftar | createdAt | Terbaru lebih dahulu |

Kategori selain Makan, Transportasi dan Kebutuhan Kuliah masuk Lainnya pada ringkasan. Saldo negatif memakai tanda minus.
