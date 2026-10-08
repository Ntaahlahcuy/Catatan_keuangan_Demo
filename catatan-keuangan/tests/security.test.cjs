const { test } = require('node:test');
const assert = require('node:assert/strict');
const { storageHarness } = require('./helpers.cjs');
const profile = { name: 'Mahasiswa', email: 'mahasiswa@example.com' };
const password = 'Belajar123';
const transaction = { id: 'local-1', title: 'Makan 🍚', category: 'Makan', date: '08 Okt', amount: 12000, type: 'expense' };

test('W3 T1: register lalu login valid membuat session dan profil dapat dibaca', async () => {
  const { api, secure } = storageHarness();
  await api.registerLocalUser(profile, password);
  assert.equal(await api.isLoggedIn(), false);
  const session = await api.loginLocalUser(' MAHASISWA@example.com ', password);
  assert.match(session.token, /^[a-f0-9]{64}$/);
  assert.ok(session.expiresAt > Date.now());
  assert.equal(await api.isLoggedIn(), true);
  assert.deepEqual(await api.getProfile(), profile);
  assert.ok(secure.has('sakuin_session_v2'));
});

test('W3 T1: input kosong, email tidak valid, nama kosong, dan password pendek ditolak', async () => {
  const { api, secure } = storageHarness();
  await assert.rejects(api.loginLocalUser('', ''), /wajib diisi/);
  await assert.rejects(api.registerLocalUser({ ...profile, email: 'salah' }, password), /email yang valid/);
  await assert.rejects(api.registerLocalUser(profile, '123'), /minimal 6/);
  await assert.rejects(api.registerLocalUser({ ...profile, name: ' ' }, password), /Nama wajib/);
  assert.equal(secure.size, 0);
});

test('W3 T3: credential salah dan akun tidak ada memberikan error umum, tanpa session', async () => {
  const { api } = storageHarness();
  await assert.rejects(api.loginLocalUser(profile.email, password), /^Error: Email atau password salah\.$/);
  await api.registerLocalUser(profile, password);
  await assert.rejects(api.loginLocalUser(profile.email, 'Salah123'), /^Error: Email atau password salah\.$/);
  await assert.rejects(api.loginLocalUser('lain@example.com', password), /^Error: Email atau password salah\.$/);
  assert.equal(await api.isLoggedIn(), false);
});

test('W3 T2: password berupa verifier PBKDF2 dan salt acak, bukan plaintext', async () => {
  const { api, secure, normal } = storageHarness();
  await api.registerLocalUser(profile, password);
  const first = JSON.parse(secure.get('sakuin_credentials_v2'));
  assert.equal(first.iterations, 120000);
  assert.match(first.hash, /^[a-f0-9]{64}$/);
  assert.equal([...secure.values(), ...normal.values()].some((value) => value.includes(password)), false);
  await api.resetLocalData();
  await api.registerLocalUser(profile, password);
  const second = JSON.parse(secure.get('sakuin_credentials_v2'));
  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.hash, second.hash);
});

test('W3 T3: logout membersihkan session; akun dan catatan dapat dipakai lagi', async () => {
  const { api, secure } = storageHarness();
  await api.registerLocalUser(profile, password);
  await api.loginLocalUser(profile.email, password);
  await api.addTransaction(transaction);
  await api.logoutLocalUser();
  assert.equal(await api.isLoggedIn(), false);
  assert.equal(secure.has('sakuin_session_v2'), false);
  assert.equal((await api.getTransactions())[0].title, transaction.title);
  await api.loginLocalUser(profile.email, password);
  assert.equal(await api.isLoggedIn(), true);
});

test('W3 T3: session kedaluwarsa atau rusak dihapus dan tidak dianggap login', async () => {
  const { api, secure } = storageHarness();
  await api.registerLocalUser(profile, password);
  const session = await api.loginLocalUser(profile.email, password);
  secure.set('sakuin_session_v2', JSON.stringify({ ...session, expiresAt: Date.now() - 1 }));
  assert.equal(await api.isLoggedIn(), false);
  assert.equal(secure.has('sakuin_session_v2'), false);
  secure.set('sakuin_session_v2', '{"token":');
  assert.equal(await api.isLoggedIn(), false);
  assert.equal(secure.has('sakuin_session_v2'), false);
});

test('W3 T2: transaksi dienkripsi, teks Unicode dapat dibaca kembali, ciphertext rusak ditolak', async () => {
  const { api, normal } = storageHarness();
  await api.addTransaction(transaction);
  const encrypted = normal.get('@sakuin/transactions_encrypted_v2');
  assert.ok(encrypted);
  assert.equal(encrypted.includes(transaction.title), false);
  assert.equal(encrypted.includes('"amount"'), false);
  assert.deepEqual(await api.getTransactions(), [{ ...transaction, source: 'local' }]);
  const bytes = Buffer.from(encrypted, 'base64');
  bytes[15] ^= 1;
  normal.set('@sakuin/transactions_encrypted_v2', bytes.toString('base64'));
  await assert.rejects(api.getTransactions());
});

test('W3 T2: migrasi menjaga catatan pengguna dan menghapus data plaintext versi lama', async () => {
  const { api, secure, normal } = storageHarness();
  normal.set('@sakuin/profile', JSON.stringify(profile));
  normal.set('@sakuin/transactions', JSON.stringify([transaction]));
  secure.set('sakuin_password', password);
  secure.set('sakuin_session_token', 'old-session');
  await api.migrateLegacyData();
  assert.equal(normal.has('@sakuin/profile'), false);
  assert.equal(normal.has('@sakuin/transactions'), false);
  assert.equal(secure.has('sakuin_password'), false);
  assert.equal(secure.has('sakuin_session_token'), false);
  assert.equal((await api.getTransactions())[0].title, transaction.title);
  await api.loginLocalUser(profile.email, password);
  assert.equal(await api.isLoggedIn(), true);
});

test('W3 T1: daftar ulang di perangkat yang sama ditolak tanpa menimpa akun', async () => {
  const { api } = storageHarness();
  await api.registerLocalUser(profile, password);
  await assert.rejects(api.registerLocalUser({ name: 'Lain', email: 'lain@example.com' }, 'Lain123'), /sudah terdaftar/);
  await api.loginLocalUser(profile.email, password);
});
