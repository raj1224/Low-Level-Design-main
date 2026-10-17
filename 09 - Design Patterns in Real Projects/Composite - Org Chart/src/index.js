'use strict';
// =============================================================================
// Composite in a real project — an organization chart. (Node.js)
//   node src/index.js
//
// One call on the CTO totals headcount + monthly cost for the entire subtree.
// =============================================================================
const { IndividualContributor, Manager } = require('./org');

function demo() {
  const cto = new Manager('Asha (CTO)', 500000);

  const eng = new Manager('Ravi (Eng Mgr)', 300000);
  eng.addReport(new IndividualContributor('Dev A', 150000));
  eng.addReport(new IndividualContributor('Dev B', 160000));

  const data = new Manager('Meera (Data Mgr)', 320000);
  data.addReport(new IndividualContributor('Analyst', 140000));

  cto.addReport(eng);
  cto.addReport(data);

  cto.print('');
  console.log(`Org headcount: ${cto.headcount()}, total monthly cost: Rs ${cto.monthlyCost()}`);
}

if (require.main === module) demo();

module.exports = { demo };
