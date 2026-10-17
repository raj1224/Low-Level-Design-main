'use strict';
// =============================================================================
// Prototype in a real project — document template registry. (Node.js)
//   node src/index.js
//
// Register a couple of templates once, then clone+customise per document. Each
// clone is independent (no leftover sections from a sibling).
// =============================================================================
const { Document, TemplateRegistry } = require('./document');

function demo() {
  const registry = new TemplateRegistry();

  const invoice = new Document('INVOICE', 'Acme Corp - Tax Invoice', 'Thank you!');
  invoice.addSection('Bill To: ____');
  registry.registerTemplate('invoice', invoice);

  registry.registerTemplate('report', new Document('REPORT', 'Acme Corp - Monthly Report', 'Confidential'));

  const inv1 = registry.create('invoice');
  inv1.setTitle('INVOICE #1001');
  inv1.addSection('Item: Widget x2 - Rs 400');

  const inv2 = registry.create('invoice');   // independent clone of the same template
  inv2.setTitle('INVOICE #1002');

  console.log('Invoice 1 (cloned + edited):'); inv1.print();
  console.log('Invoice 2 (independent clone - no leftover items from inv1):'); inv2.print();
}

if (require.main === module) demo();

module.exports = { demo };
