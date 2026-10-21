
// =============================================================================
// VISITOR — represent an operation to perform on the elements of an object
// structure. Visitor lets you add NEW operations to a class hierarchy WITHOUT
// modifying the element classes — the new operation lives in a visitor class.
//
// Domain: a vector-graphics document of Shapes (Circle, Rectangle). We want to
// add operations — total area, export to SVG — without editing the shape classes
// each time. Each operation is a Visitor.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Visitor interface: one visit() per concrete element ----------
class ShapeVisitor {
    visitCircle(c) {
        throw new Error("visitCircle() must be implemented");
    }

    visitRectangle(r) {
        throw new Error("visitRectangle() must be implemented");
    }
}

// ---------- Element interface ----------
class Shape {
    accept(v) {
        throw new Error("accept() must be implemented");
    }
}

// ---------- Concrete elements: each dispatches to the right visit() ----------
class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    accept(v) {
        v.visitCircle(this);
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    accept(v) {
        v.visitRectangle(this);
    }
}

// ---------- Concrete visitors: add operations without touching the shapes ----------
class AreaVisitor extends ShapeVisitor {
    constructor() {
        super();
        this.totalArea = 0;
    }

    visitCircle(c) {
        this.totalArea += 3.14159 * c.radius * c.radius;
    }

    visitRectangle(r) {
        this.totalArea += r.width * r.height;
    }

    total() {
        return this.totalArea;
    }
}

class SvgExportVisitor extends ShapeVisitor {
    visitCircle(c) {
        console.log(`  <circle r="${c.radius}"/>`);
    }

    visitRectangle(r) {
        console.log(`  <rect w="${r.width}" h="${r.height}"/>`);
    }
}

function main() {
    const doc = [
        new Circle(2.0),
        new Rectangle(3.0, 4.0),
        new Circle(1.0)
    ];

    const area = new AreaVisitor();

    for (const shape of doc) {
        shape.accept(area);
    }

    console.log(`Total area: ${area.total()}`);

    console.log("SVG export:");

    const svg = new SvgExportVisitor();

    for (const shape of doc) {
        shape.accept(svg);
    }

    // To add a "bounding box" operation, write ONE new visitor — no shape edits.
}

main();
