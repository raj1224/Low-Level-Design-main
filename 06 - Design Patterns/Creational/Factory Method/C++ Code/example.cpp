// =============================================================================
// FACTORY METHOD — define an interface for creating an object, but let
// subclasses decide which concrete class to instantiate.
//
// Domain: a logistics company plans deliveries. Road logistics moves goods by
// Truck, sea logistics by Ship. The planning algorithm is identical; only the
// *kind of transport created* differs — so the creation step is a "factory
// method" that each subclass overrides.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Product interface ----------
class Transport {
public:
    virtual string deliver() = 0;
    virtual ~Transport() {}
};

// ---------- Concrete products ----------
class Truck : public Transport {
public:
    string deliver() { return "Delivering by land in a truck"; }
};

class Ship : public Transport {
public:
    string deliver() { return "Delivering by sea in a container ship"; }
};

// ---------- Creator: declares the factory method ----------
class Logistics {
public:
    // THE factory method — subclasses decide the concrete Transport.
    virtual Transport* createTransport() = 0;

    // The creator's real work uses the product via its interface only.
    void planDelivery() {
        Transport* t = this->createTransport();   // deferred to the subclass
        cout << "  " << t->deliver() << endl;
        delete t;
    }

    virtual ~Logistics() {}
};

// ---------- Concrete creators ----------
class RoadLogistics : public Logistics {
public:
    Transport* createTransport() { return new Truck(); }
};

class SeaLogistics : public Logistics {
public:
    Transport* createTransport() { return new Ship(); }
};

// The client picks a creator; the rest of the code is creator-agnostic.
Logistics* logisticsFor(string mode) {
    if (mode == "sea") return new SeaLogistics();
    return new RoadLogistics();
}

int main() {
    string modes[] = { "road", "sea" };
    for (int i = 0; i < 2; i++) {
        cout << modes[i] << " logistics:" << endl;
        Logistics* l = logisticsFor(modes[i]);
        l->planDelivery();
        delete l;
    }
    return 0;
}
