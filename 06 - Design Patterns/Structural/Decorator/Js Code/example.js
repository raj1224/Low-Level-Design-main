
// =============================================================================
// DECORATOR — attach additional responsibilities to an object DYNAMICALLY by
// wrapping it in another object that shares the same interface. A flexible
// alternative to subclassing for extending behaviour.
//
// Domain: rich-text rendering. A plain Text can be wrapped with Bold, Italic and
// Underline decorators, in any order and combination, at runtime. Subclassing
// would need BoldItalic, BoldUnderline, BoldItalicUnderline... an explosion.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Component ----------
class Text {
    render() {
        throw new Error("render() must be implemented");
    }
}

// ---------- Concrete component ----------
class PlainText extends Text {
    constructor(s) {
        super();
        this.s = s;
    }

    render() {
        return this.s;
    }
}

// ---------- Base decorator: IS-A Text and HAS-A Text ----------
class TextDecorator extends Text {
    constructor(inner) {
        super();
        this.inner = inner; // the wrapped object
    }

    render() {
        return this.inner.render();
    }
}

// ---------- Concrete decorators: wrap render() and add their bit ----------
class Bold extends TextDecorator {
    render() {
        return "**" + this.inner.render() + "**";
    }
}

class Italic extends TextDecorator {
    render() {
        return "*" + this.inner.render() + "*";
    }
}

class Underline extends TextDecorator {
    render() {
        return "<u>" + this.inner.render() + "</u>";
    }
}

function main() {
    // Plain
    const t1 = new PlainText("Sale!");
    console.log("  " + t1.render());

    // Bold(Italic("Sale!")) — wrap at runtime, inside-out
    const t2 = new Bold(
        new Italic(
            new PlainText("Sale!")
        )
    );
    console.log("  " + t2.render());

    // Underline(Bold("50% OFF")) — different combo, no new class needed
    const t3 = new Underline(
        new Bold(
            new PlainText("50% OFF")
        )
    );
    console.log("  " + t3.render());

    // JavaScript has garbage collection, so explicit delete is not required.
}

main();
