
// =============================================================================
// PROTOTYPE — create new objects by CLONING an existing, fully-configured
// instance instead of constructing from scratch. Great when construction is
// expensive, or when you want to copy an object's exact runtime configuration.
//
// Domain: a drawing app. The user configures a shape (color, size) once, then
// stamps many copies. Each copy is produced by clone(), so we don't re-specify
// every property, and the client never names concrete classes.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Prototype interface ----------
class Shape {
    constructor() {
        this.color = "black";
    }

    clone() {
        throw new Error("clone() must be implemented");
    }

    describe() {
        throw new Error("describe() must be implemented");
    }

    setColor(color) {
        this.color = color;
    }
}

// ---------- Concrete prototypes ----------
class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    // Clone the current object, including its color and radius.
    clone() {
        const copy = new Circle(this.radius);
        copy.color = this.color;
        return copy;
    }

    describe() {
        return `${this.color} circle (r=${this.radius})`;
    }
}

class Rectangle extends Shape {
    constructor(w, h) {
        super();
        this.w = w;
        this.h = h;
    }

    clone() {
        const copy = new Rectangle(this.w, this.h);
        copy.color = this.color;
        return copy;
    }

    describe() {
        return `${this.color} rectangle (${this.w}x${this.h})`;
    }
}

// ---------- A registry of ready-made prototypes ----------
class ShapeRegistry {
    constructor() {
        this.prototypes = new Map();
    }

    registerPrototype(key, prototype) {
        this.prototypes.set(key, prototype);
    }

    create(key) {
        const prototype = this.prototypes.get(key);

        if (!prototype) {
            throw new Error(`Prototype "${key}" not found`);
        }

        return prototype.clone();
    }
}

function main() {
    const registry = new ShapeRegistry();

    // Configure prototypes ONCE.
    const redCircle = new Circle(10);
    redCircle.setColor("red");
    registry.registerPrototype("red-circle", redCircle);

    const blueRect = new Rectangle(4, 2);
    blueRect.setColor("blue");
    registry.registerPrototype("blue-rect", blueRect);

    // Stamp out copies — no need to re-specify color/size.
    const a = registry.create("red-circle");
    const b = registry.create("red-circle");
    const c = registry.create("blue-rect");

    b.setColor("green"); // tweak just this copy

    console.log(`  ${a.describe()}`);
    console.log(
        `  ${b.describe()}  (independent copy, recolored)`
    );
    console.log(`  ${c.describe()}`);
}

main();
