'use strict';
// =============================================================================
// Decorator in a real project — a data-stream pipeline. (Node.js)
//   node src/index.js
//
// Stack compression + encryption + hex-encoding around a storage sink. Writing
// applies them outside-in; reading unwinds them, round-tripping the original.
// =============================================================================
const {
  InMemoryDataSource, CompressionDecorator, EncryptionDecorator, HexEncodingDecorator,
} = require('./dataSource');

function demo() {
  const source = new CompressionDecorator(
    new EncryptionDecorator(
      new HexEncodingDecorator(
        new InMemoryDataSource())));

  const original = 'aaaabbbcccccd';
  console.log(`Writing: "${original}"`);
  source.writeData(original);

  const roundTrip = source.readData();
  console.log(`Read back: "${roundTrip}"`);
  console.log(`Round-trip ${roundTrip === original ? 'OK' : 'MISMATCH'}`);
}

if (require.main === module) demo();

module.exports = { demo };
