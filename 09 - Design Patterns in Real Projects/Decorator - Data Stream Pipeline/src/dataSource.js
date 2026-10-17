'use strict';
// DECORATOR — a data-stream pipeline. Each decorator wraps a DataSource and adds
// one transform on write (and the inverse on read), so you can stack
// compress + encrypt + encode in any order without subclass combinations.

// ---- Concrete component: the storage ----
class InMemoryDataSource {
  writeData(data) { this.buffer = data; console.log(`  [stored bytes] ${data}`); }
  readData() { return this.buffer; }
}

// ---- Base decorator ----
class DataSourceDecorator {
  constructor(wrappee) { this.wrappee = wrappee; }
}

// ---- Compression (run-length encoding) ----
class CompressionDecorator extends DataSourceDecorator {
  writeData(data) { this.wrappee.writeData(CompressionDecorator.rle(data)); }
  readData() { return CompressionDecorator.unrle(this.wrappee.readData()); }
  static rle(s) {
    let out = '', i = 0;
    while (i < s.length) {
      const c = s[i]; let j = i; while (j < s.length && s[j] === c) j++;
      out += c + (j - i); i = j;
    }
    return out;
  }
  static unrle(s) {
    let out = '', i = 0;
    while (i < s.length) {
      const c = s[i++]; let num = '';
      while (i < s.length && s[i] >= '0' && s[i] <= '9') num += s[i++];
      out += c.repeat(parseInt(num, 10));
    }
    return out;
  }
}

// ---- Encryption (Caesar shift on letters) ----
class EncryptionDecorator extends DataSourceDecorator {
  writeData(data) { this.wrappee.writeData(EncryptionDecorator.shift(data, 3)); }
  readData() { return EncryptionDecorator.shift(this.wrappee.readData(), 23); }
  static shift(s, k) {
    let out = '';
    for (const ch of s) {
      const c = ch.charCodeAt(0);
      if (c >= 97 && c <= 122) out += String.fromCharCode(97 + (c - 97 + k) % 26);
      else if (c >= 65 && c <= 90) out += String.fromCharCode(65 + (c - 65 + k) % 26);
      else out += ch;
    }
    return out;
  }
}

// ---- Encoding (hex; stands in for base64) ----
class HexEncodingDecorator extends DataSourceDecorator {
  writeData(data) { this.wrappee.writeData(Buffer.from(data, 'binary').toString('hex')); }
  readData() { return Buffer.from(this.wrappee.readData(), 'hex').toString('binary'); }
}

module.exports = {
  InMemoryDataSource, DataSourceDecorator,
  CompressionDecorator, EncryptionDecorator, HexEncodingDecorator,
};
