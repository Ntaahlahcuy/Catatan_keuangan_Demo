const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { loadTS } = require('./helpers.cjs');
const { createApiServer } = require('../server/index.cjs');
const service = loadTS('src/services/transaction-service.ts', { 'expo-constants': { expoConfig: {} }, 'react-native': { Platform: { OS: 'web' } } });
const model = loadTS('src/models/transaction.ts');
const fixture = { transaction_id: 1, name: 'Makan siang', category_name: 'Makan', nominal: 25000, kind: 'expense', occurred_at: '2026-10-08T05:30:00.000Z' };

async function listen(server) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return 'http://127.0.0.1:' + server.address().port;
}
async function close(server) {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}

test('W4 T1: DTO memetakan nama field API menjadi model untuk UI', () => {
  const item = model.mapTransactionDTO(fixture);
  assert.equal(item.id, 'api-1');
  assert.equal(item.title, fixture.name);
  assert.equal(item.category, fixture.category_name);
  assert.equal(item.amount, fixture.nominal);
  assert.equal(item.type, 'expense');
  assert.equal(item.source, 'api');
  assert.equal(item.createdAt, fixture.occurred_at);
  assert.equal('transaction_id' in item, false);
});

test('W4 T1: payload bukan array, field invalid dan ID ganda ditolak', () => {
  assert.throws(() => model.parseTransactionResponse({ data: [] }), /daftar transaksi/);
  for (const change of [{ nominal: -1 }, { kind: 'invalid' }, { name: '' }, { occurred_at: 'bukan tanggal' }, { transaction_id: 0 }]) {
    assert.throws(() => model.parseTransactionResponse([{ ...fixture, ...change }]), /Format data/);
  }
  assert.throws(() => model.parseTransactionResponse([fixture, fixture]), /ID transaksi/);
  assert.deepEqual(model.parseTransactionResponse([]), []);
});

test('W4 T2-3: GET API sungguhan, HTTP 200, CORS, mapping dan perubahan data tanpa restart', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sakuin-test-'));
  const dataFile = path.join(directory, 'transactions.json');
  await fs.writeFile(dataFile, JSON.stringify([fixture]));
  const server = createApiServer({ dataFile });
  try {
    const address = await listen(server);
    const response = await fetch(address + '/api/transactions');
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
    assert.deepEqual(await response.json(), [fixture]);
    let items = await service.fetchTransactions(address + '/api');
    assert.equal(items[0].title, fixture.name);
    await fs.writeFile(dataFile, JSON.stringify([{ ...fixture, name: 'Diperbarui dari server', nominal: 30000 }]));
    items = await service.fetchTransactions(address + '/api');
    assert.equal(items[0].title, 'Diperbarui dari server');
    assert.equal(items[0].amount, 30000);
    const unsupported = await fetch(address + '/api/transactions', { method: 'POST' });
    assert.equal(unsupported.status, 405);
    const missing = await fetch(address + '/api/salah');
    assert.equal(missing.status, 404);
  } finally { await close(server); await fs.rm(directory, { recursive: true, force: true }); }
});

test('W4 T2: HTTP gagal dan JSON invalid ditangani tanpa dianggap data valid', async () => {
  const server = http.createServer((request, response) => {
    response.writeHead(request.url.startsWith('/failed') ? 503 : 200, { 'Content-Type': 'application/json' });
    response.end(request.url.startsWith('/failed') ? '{"error":true}' : 'json-rusak');
  });
  try {
    const address = await listen(server);
    await assert.rejects(service.fetchTransactions(address + '/failed'), /HTTP 503/);
    await assert.rejects(service.fetchTransactions(address + '/broken'), /bukan JSON/);
  } finally { await close(server); }
});

test('W4 T2: timeout dan pembatalan request ditangani', async () => {
  const server = http.createServer(() => {});
  try {
    const address = await listen(server);
    await assert.rejects(service.fetchTransactions(address, undefined, 30), /terlalu lama/);
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(service.fetchTransactions(address, controller.signal), /terlalu lama/);
  } finally { await close(server); }
});

test('W4 T2: kegagalan koneksi menghasilkan pesan untuk pengguna', async () => {
  const server = http.createServer(() => {});
  const address = await listen(server);
  await close(server);
  await assert.rejects(service.fetchTransactions(address), /Tidak dapat terhubung/);
});
