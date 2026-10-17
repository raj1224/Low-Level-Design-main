'use strict';
// COMPOSITE — an org chart. A leaf (IndividualContributor) and a composite
// (Manager, which holds reports) expose the SAME interface — headcount(),
// monthlyCost(), print() — so a manager totals its whole subtree uniformly,
// without caring whether each report is an IC or another manager.
class IndividualContributor {
  constructor(name, salary) { this.nameVal = name; this.salary = salary; }
  headcount() { return 1; }
  monthlyCost() { return this.salary; }
  print(indent) { console.log(`${indent}- ${this.nameVal} (Rs ${this.salary})`); }
}

class Manager {
  constructor(name, salary) { this.nameVal = name; this.salary = salary; this.reports = []; }
  addReport(e) { this.reports.push(e); }
  headcount() { return 1 + this.reports.reduce((n, r) => n + r.headcount(), 0); }
  monthlyCost() { return this.salary + this.reports.reduce((c, r) => c + r.monthlyCost(), 0); }
  print(indent) {
    console.log(`${indent}+ ${this.nameVal} (Rs ${this.salary}) - team of ${this.headcount()}, cost Rs ${this.monthlyCost()}`);
    for (const r of this.reports) r.print(indent + '   ');
  }
}

module.exports = { IndividualContributor, Manager };
