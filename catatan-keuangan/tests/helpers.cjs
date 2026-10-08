const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const crypto = require('node:crypto');
const project = path.resolve(__dirname, '..');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(result.outputText, filename);
};

function loadTS(filename, mocks = {}) {
  for (const name of Object.keys(require.cache)) {
    if (name.startsWith(path.join(project, 'src') + path.sep)) delete require.cache[name];
  }
  const originalLoad = Module._load;
  Module._load = function (name, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, name)) return mocks[name];
    return originalLoad.call(this, name, parent, isMain);
  };
  try { return require(path.resolve(project, filename)); }
  finally { Module._load = originalLoad; }
}

function storageHarness() {
  const secure = new Map();
  const normal = new Map();
  const secureMock = {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
    async setItemAsync(key, value) { secure.set(key, value); },
    async getItemAsync(key) { return secure.get(key) ?? null; },
    async deleteItemAsync(key) { secure.delete(key); },
  };
  const asyncMock = {
    async setItem(key, value) { normal.set(key, value); },
    async getItem(key) { return normal.get(key) ?? null; },
    async removeItem(key) { normal.delete(key); },
    async multiRemove(keys) { for (const key of keys) normal.delete(key); },
  };
  class EncryptionKey {
    constructor(bytes) { this.bytes = bytes; }
    static async generate() { return new EncryptionKey(crypto.randomBytes(32)); }
    static async import(value, encoding) { return new EncryptionKey(Buffer.from(value, encoding)); }
    async encoded(encoding) { return this.bytes.toString(encoding); }
  }
  // AES-GCM sebenarnya dijalankan dengan node:crypto; API perangkat menjadi test double.
  const cryptoMock = {
    getRandomBytes: (size) => new Uint8Array(crypto.randomBytes(size)),
    AESEncryptionKey: EncryptionKey,
    AESSealedData: { fromCombined: (value) => Buffer.from(value, 'base64') },
    async aesEncryptAsync(bytes, key) {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', key.bytes, iv);
      const ciphertext = Buffer.concat([cipher.update(bytes), cipher.final()]);
      const combined = Buffer.concat([iv, ciphertext, cipher.getAuthTag()]);
      return { async combined(encoding) { return combined.toString(encoding); } };
    },
    async aesDecryptAsync(combined, key) {
      const decipher = crypto.createDecipheriv('aes-256-gcm', key.bytes, combined.subarray(0, 12));
      decipher.setAuthTag(combined.subarray(-16));
      return new Uint8Array(Buffer.concat([decipher.update(combined.subarray(12, -16)), decipher.final()]));
    },
  };
  const api = loadTS('src/lib-storage.ts', {
    'expo-secure-store': secureMock,
    '@react-native-async-storage/async-storage': asyncMock,
    'expo-crypto': cryptoMock,
  });
  return { api, secure, normal };
}
module.exports = { loadTS, storageHarness };
