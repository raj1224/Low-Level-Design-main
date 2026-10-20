
// =============================================================================
// INTERPRETER — given a language, define a representation for its grammar plus an
// interpreter that evaluates sentences. Each grammar rule becomes a class;
// evaluating = walking the resulting tree.
//
// Domain: a tiny arithmetic evaluator. We build (3 + (10 - 4)) * 2 as a tree of
// Expression objects and evaluate it. This is how calculators, rule engines, and
// query languages work internally.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Abstract expression ----------
class Expression {
    interpret() {
        throw new Error("interpret() must be implemented");
    }

    toString() {
        throw new Error("toString() must be implemented");
    }
}

// ---------- Terminal expression: a literal number ----------
class Number extends Expression {
    constructor(v) {
        super();
        this.v = v;
    }

    interpret() {
        return this.v;
    }

    toString() {
        return String(this.v);
    }
}

// ---------- Non-terminal expressions: combine sub-expressions ----------
class Add extends Expression {
    constructor(l, r) {
        super();
        this.l = l;
        this.r = r;
    }

    interpret() {
        return this.l.interpret() + this.r.interpret();
    }

    toString() {
        return `(${this.l.toString()} + ${this.r.toString()})`;
    }
}

class Subtract extends Expression {
    constructor(l, r) {
        super();
        this.l = l;
        this.r = r;
    }

    interpret() {
        return this.l.interpret() - this.r.interpret();
    }

    toString() {
        return `(${this.l.toString()} - ${this.r.toString()})`;
    }
}

class Multiply extends Expression {
    constructor(l, r) {
        super();
        this.l = l;
        this.r = r;
    }

    interpret() {
        return this.l.interpret() * this.r.interpret();
    }

    toString() {
        return `(${this.l.toString()} * ${this.r.toString()})`;
    }
}

function main() {
    // Build the tree for: (3 + (10 - 4)) * 2
    const expr = new Multiply(
        new Add(
            new Number(3),
            new Subtract(
                new Number(10),
                new Number(4)
            )
        ),
        new Number(2)
    );

    console.log(`  expression: ${expr.toString()}`);
    console.log(`  result:     ${expr.interpret()}`);

    // JavaScript garbage collection handles memory management.
}

main();
