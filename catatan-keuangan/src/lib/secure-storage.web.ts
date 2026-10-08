// SecureStore tidak tersedia di web. Vault ini memakai AES-GCM + IndexedDB.
// CryptoKey non-extractable; tidak ada password/token plaintext di localStorage.
type EncryptedRecord = { iv: Uint8Array<ArrayBuffer>; ciphertext: ArrayBuffer };
let databasePromise: Promise<IDBDatabase> | undefined;
let keyPromise: Promise<CryptoKey> | undefined;

function getDatabase(): Promise<IDBDatabase> {
  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.crypto?.subtle || !window.indexedDB) {
        reject(new Error('Penyimpanan aman tidak tersedia. Buka lewat localhost atau HTTPS.'));
        return;
      }
      const request = indexedDB.open('sakuin-secure-v2', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('vault');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Penyimpanan aman tidak dapat dibuka.'));
    }).catch((error) => { databasePromise = undefined; throw error; });
  }
  return databasePromise;
}

async function readRecord<T>(key: string): Promise<T | undefined> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('vault', 'readonly');
    const request = transaction.objectStore('vault').get(key);
    transaction.oncomplete = () => resolve(request.result as T | undefined);
    transaction.onerror = transaction.onabort = () => reject(new Error('Data aman tidak dapat dibaca.'));
  });
}

async function writeRecord(key: string, value?: EncryptedRecord): Promise<void> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('vault', 'readwrite');
    const store = transaction.objectStore('vault');
    if (value) store.put(value, key);
    else store.delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = transaction.onabort = () => reject(new Error('Data aman tidak dapat disimpan.'));
  });
}

function getKey(): Promise<CryptoKey> {
  if (!keyPromise) {
    keyPromise = (async () => {
      const existing = await readRecord<CryptoKey>('__encryption_key__');
      if (existing) return existing;
      const candidate = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      const db = await getDatabase();
      // Periksa ulang dalam transaksi untuk mencegah konflik antar-tab.
      return new Promise<CryptoKey>((resolve, reject) => {
        const transaction = db.transaction('vault', 'readwrite');
        const store = transaction.objectStore('vault');
        const request = store.get('__encryption_key__');
        let key = candidate;
        request.onsuccess = () => {
          if (request.result) key = request.result;
          else store.put(candidate, '__encryption_key__');
        };
        transaction.oncomplete = () => resolve(key);
        transaction.onerror = transaction.onabort = () => reject(new Error('Kunci penyimpanan tidak dapat dibuat.'));
      });
    })().catch((error) => { keyPromise = undefined; throw error; });
  }
  return keyPromise;
}

export async function secureSet(key: string, value: string): Promise<void> {
  const encryptionKey = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(key) },
    encryptionKey, new TextEncoder().encode(value));
  await writeRecord(key, { iv, ciphertext });
}

export async function secureGet(key: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const record = await readRecord<EncryptedRecord>(key);
  if (!record) return null;
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: record.iv, additionalData: new TextEncoder().encode(key) }, await getKey(), record.ciphertext);
  return new TextDecoder().decode(decrypted);
}

export async function secureDelete(key: string): Promise<void> { await writeRecord(key); }
export const privateSet = secureSet;
export const privateGet = secureGet;
export const privateDelete = secureDelete;

export async function readLegacyPassword(): Promise<string | null> {
  return typeof window === 'undefined' ? null : localStorage.getItem('sakuin_password');
}

export async function clearLegacyAuthentication(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sakuin_password');
    localStorage.removeItem('sakuin_session_token');
  }
}
