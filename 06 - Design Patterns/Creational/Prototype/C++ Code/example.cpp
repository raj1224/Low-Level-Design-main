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
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <map>
#include <string>

using namespace std;

// ---------- Prototype interface ----------
class Shape {
protected:
    string color;
public:
    Shape() { this->color = "black"; }
    virtual Shape* clone() = 0;        // the prototype operation
    virtual string describe() = 0;
    void setColor(string c) { this->color = c; }
    virtual ~Shape() {}
};

// ---------- Concrete prototypes ----------
class Circle : public Shape {
private:
    int radius;
public:
    Circle(int radius) { this->radius = radius; }
    // clone = copy-construct *this; the default copy copies every field
    // (color + radius), so the clone matches the original exactly.
    Shape* clone() { return new Circle(*this); }
    string describe() { return this->color + " circle (r=" + to_string(this->radius) + ")"; }
};

class Rectangle : public Shape {
private:
    int w;
    int h;
public:
    Rectangle(int w, int h) { this->w = w; this->h = h; }
    Shape* clone() { return new Rectangle(*this); }
    string describe() {
        return this->color + " rectangle (" + to_string(this->w) + "x" + to_string(this->h) + ")";
    }
};

// ---------- A registry of ready-made prototypes (a common companion) ----------
class ShapeRegistry {
private:
    map<string, Shape*> prototypes;
public:
    void registerPrototype(string key, Shape* proto) { this->prototypes[key] = proto; }
    Shape* create(string key) { return this->prototypes[key]->clone(); }   // clone, don't construct
    ~ShapeRegistry() {
        map<string, Shape*>::iterator it;
        for (it = this->prototypes.begin(); it != this->prototypes.end(); ++it) {
            delete it->second;
        }
    }
};

int main() {
    ShapeRegistry registry;

    // Configure prototypes ONCE.
    Circle* redCircle = new Circle(10);
    redCircle->setColor("red");
    registry.registerPrototype("red-circle", redCircle);

    Rectangle* blueRect = new Rectangle(4, 2);
    blueRect->setColor("blue");
    registry.registerPrototype("blue-rect", blueRect);

    // Stamp out copies — no need to re-specify color/size, no concrete names.
    Shape* a = registry.create("red-circle");
    Shape* b = registry.create("red-circle");
    Shape* c = registry.create("blue-rect");
    b->setColor("green");                       // tweak just this copy

    cout << "  " << a->describe() << endl;
    cout << "  " << b->describe() << "  (independent copy, recolored)" << endl;
    cout << "  " << c->describe() << endl;

    delete a;
    delete b;
    delete c;
    return 0;
}
