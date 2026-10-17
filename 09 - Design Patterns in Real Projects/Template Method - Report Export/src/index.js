'use strict';
// =============================================================================
// Template Method in a real project — report export pipeline. (Node.js)
//   node src/index.js
//
// The same exportReport() skeleton produces CSV or JSON depending on the subclass.
// =============================================================================
const { CsvExporter, JsonExporter } = require('./exporters');

function demo() {
  const rows = [['1', 'Widget', '400'], ['2', 'Gadget', '750']];
  console.log('CSV:\n' + new CsvExporter().exportReport(rows));
  console.log('JSON:\n' + new JsonExporter().exportReport(rows));
}

if (require.main === module) demo();

module.exports = { demo };
