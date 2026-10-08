// Server REST API lokal untuk Week 4. Seluruh isi transaksi adalah data contoh.
// Tidak memerlukan Express atau instalasi tambahan.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

function createApiServer({ dataFile = path.join(__dirname, 'transactions.json') } = {}) {
  return http.createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    const send = (status, data) => { response.writeHead(status); response.end(JSON.stringify(data)); };
    if (request.method === 'OPTIONS') { response.writeHead(204); response.end(); return; }
    if (request.method !== 'GET') { send(405, { message: 'Method tidak didukung.' }); return; }
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname === '/api/health') { send(200, { status: 'ok', app: 'SakuIn', sampleData: true }); return; }
    if (pathname !== '/api/transactions') { send(404, { message: 'Endpoint tidak ditemukan.' }); return; }
    try {
      // Dibaca pada setiap request: ubah file JSON lalu tekan Muat ulang di aplikasi.
      const transactions = JSON.parse(await fs.readFile(dataFile, 'utf8'));
      if (!Array.isArray(transactions)) throw new Error('Data bukan array.');
      send(200, transactions);
    } catch {
      send(500, { message: 'Data contoh belum dapat dibaca oleh server.' });
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3001);
  const server = createApiServer();
  server.on('error', (error) => {
    console.error(error.code === 'EADDRINUSE' ? 'Port API sedang digunakan. Tutup server lama atau pilih PORT lain.' : 'Server API gagal dijalankan.');
    process.exitCode = 1;
  });
  server.listen(port, '0.0.0.0', () => {
    console.log('SakuIn REST API (data contoh) aktif.');
    console.log('GET http://localhost:' + port + '/api/transactions');
    console.log('Untuk HP: gunakan alamat IPv4 laptop dan Wi-Fi yang sama.');
  });
}
module.exports = { createApiServer };
