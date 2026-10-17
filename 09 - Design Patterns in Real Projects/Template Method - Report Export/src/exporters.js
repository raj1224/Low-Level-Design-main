'use strict';
// TEMPLATE METHOD — exportReport() fixes the skeleton (open document -> format
// each row -> close document); subclasses fill in only the format-specific steps.
class ReportExporter {
  constructor() { this.columns = ['id', 'name', 'amount']; }

  // THE TEMPLATE METHOD: fixed skeleton, varying steps.
  exportReport(rows) {
    let out = this.openDocument();
    rows.forEach((row, i) => { out += this.formatRow(row, i + 1 === rows.length); });
    out += this.closeDocument();
    return out;
  }

  openDocument() { throw new Error('abstract'); }
  formatRow() { throw new Error('abstract'); }
  closeDocument() { throw new Error('abstract'); }
}

class CsvExporter extends ReportExporter {
  openDocument() { return this.columns.join(',') + '\n'; }
  formatRow(row) { return row.join(',') + '\n'; }
  closeDocument() { return ''; }
}

class JsonExporter extends ReportExporter {
  openDocument() { return '[\n'; }
  formatRow(row, isLast) {
    const pairs = this.columns.map((c, i) => `"${c}": "${row[i]}"`).join(', ');
    return `  {${pairs}}${isLast ? '\n' : ',\n'}`;
  }
  closeDocument() { return ']\n'; }
}

module.exports = { ReportExporter, CsvExporter, JsonExporter };
