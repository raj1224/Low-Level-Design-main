// =============================================================================
// PROTOTYPE (Java twin of example.cpp) — clone a configured instance instead of
// constructing from scratch. Each concrete shape provides a copy constructor.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================
import java.util.HashMap;
import java.util.Map;

// ---------- Prototype interface ----------
abstract class Shape {
    protected String color = "black";
    abstract Shape cloneShape();        // the prototype operation
    abstract String describe();
    void setColor(String c) { this.color = c; }
}

// ---------- Concrete prototypes ----------
class Circle extends Shape {
    private int radius;
    Circle(int radius) { this.radius = radius; }
    Circle(Circle other) { this.radius = other.radius; this.color = other.color; }   // copy ctor
    Shape cloneShape() { return new Circle(this); }
    String describe() { return this.color + " circle (r=" + this.radius + ")"; }
}

class Rectangle extends Shape {
    private int w;
    private int h;
    Rectangle(int w, int h) { this.w = w; this.h = h; }
    Rectangle(Rectangle other) { this.w = other.w; this.h = other.h; this.color = other.color; }
    Shape cloneShape() { return new Rectangle(this); }
    String describe() { return this.color + " rectangle (" + this.w + "x" + this.h + ")"; }
}

// ---------- A registry of ready-made prototypes ----------
class ShapeRegistry {
    private Map<String, Shape> prototypes = new HashMap<String, Shape>();
    void registerPrototype(String key, Shape proto) { this.prototypes.put(key, proto); }
    Shape create(String key) { return this.prototypes.get(key).cloneShape(); }   // clone, don't construct
}

public class Main {
    public static void main(String[] args) {
        ShapeRegistry registry = new ShapeRegistry();

        // Configure prototypes ONCE.
        Circle redCircle = new Circle(10);
        redCircle.setColor("red");
        registry.registerPrototype("red-circle", redCircle);

        Rectangle blueRect = new Rectangle(4, 2);
        blueRect.setColor("blue");
        registry.registerPrototype("blue-rect", blueRect);

        // Stamp out copies — no need to re-specify color/size, no concrete names.
        Shape a = registry.create("red-circle");
        Shape b = registry.create("red-circle");
        Shape c = registry.create("blue-rect");
        b.setColor("green");                       // tweak just this copy

        System.out.println("  " + a.describe());
        System.out.println("  " + b.describe() + "  (independent copy, recolored)");
        System.out.println("  " + c.describe());
    }
}
