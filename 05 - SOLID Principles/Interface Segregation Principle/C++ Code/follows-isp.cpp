// =============================================================================
// INTERFACE SEGREGATION PRINCIPLE — the FIX.
// Three small, focused interfaces — Printer, Scanner, Fax. A device implements
// ONLY what it actually supports, so it can never be forced to fake a method.
//
// Build & run:
//   g++ -std=c++14 follows-isp.cpp -o follows
//   ./follows
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

class Printer {
public:
    virtual void print(string doc) = 0;
    virtual ~Printer() {}
};

class Scanner {
public:
    virtual void scan(string doc) = 0;
    virtual ~Scanner() {}
};

class Fax {
public:
    virtual void fax(string doc) = 0;
    virtual ~Fax() {}
};

// A basic printer implements ONLY Printer. It cannot lie about scanning.
class OfficePrinter : public Printer {
public:
    void print(string doc) { cout << "  [print] " << doc << endl; }
};

// A high-end machine composes exactly the capabilities it really has.
class AllInOnePrinter : public Printer, public Scanner, public Fax {
public:
    void print(string doc) { cout << "  [print] " << doc << endl; }
    void scan(string doc) { cout << "  [scan]  " << doc << endl; }
    void fax(string doc) { cout << "  [fax]   " << doc << endl; }
};

// Each client asks for exactly the interface it needs — nothing more.
void printDocument(Printer* p, string doc) { p->print(doc); }
void archive(Scanner* s, string doc) { s->scan(doc); }

int main() {
    OfficePrinter* basic = new OfficePrinter();
    printDocument(basic, "invoice.pdf");
    // archive(basic, ...) won't compile — basic has no Scanner capability. Good.

    AllInOnePrinter* combo = new AllInOnePrinter();
    printDocument(combo, "contract.pdf");
    archive(combo, "id-proof.jpg");

    delete basic;
    delete combo;
    return 0;
}
