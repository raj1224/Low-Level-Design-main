'use strict';
// PROTOTYPE — clone pre-built document templates instead of constructing each
// document from scratch. A registry holds the prototypes; create() deep-clones
// one so edits never leak back into the template.
class Document {
  constructor(title, header, footer) {
    this.title = title;
    this.header = header;
    this.footer = footer;
    this.sections = [];
  }
  // Deep clone (copy the sections array too, so clones are independent).
  clone() {
    const d = new Document(this.title, this.header, this.footer);
    d.sections = this.sections.slice();
    return d;
  }
  setTitle(t) { this.title = t; }
  addSection(s) { this.sections.push(s); }
  print() {
    console.log(`  == ${this.title} ==\n  ${this.header}`);
    for (const s of this.sections) console.log(`    * ${s}`);
    console.log(`  ${this.footer}`);
  }
}

class TemplateRegistry {
  constructor() { this.prototypes = {}; }
  registerTemplate(key, proto) { this.prototypes[key] = proto; }
  create(key) { return this.prototypes[key].clone(); }
}

module.exports = { Document, TemplateRegistry };
