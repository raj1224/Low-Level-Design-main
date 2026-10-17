// =============================================================================
// INTERFACE SEGREGATION PRINCIPLE — the VIOLATION.
// "No client should be forced to depend on methods it does not use."
//
// One fat IMultiFunctionDevice declares print + scan + fax. A simple office
// printer is forced to implement scan() and fax() it doesn't have — so it
// throws. Callers can no longer trust the type.
//
// Build & run:
//   g++ -std=c++14 violates-isp.cpp -o violates
//   ./violates
// =============================================================================
#include <iostream>
#include <stdexcept>
#include <string>

using namespace std;

class IMultiFunctionDevice {
public:
    virtual void print(string doc) = 0;
    virtual void scan(string doc) = 0;
    virtual void fax(string doc) = 0;
    virtual ~IMultiFunctionDevice() {}
};

class SimplePrinter : public IMultiFunctionDevice {
public:
    void print(string doc) { cout << "  [print] " << doc << endl; }
    void scan(string doc) { throw logic_error("no scanner!"); }
    void fax(string doc) { throw logic_error("no fax!"); }
    // Forced to implement two capabilities it doesn't have. Landmines.
};

int main() {
    SimplePrinter* p = new SimplePrinter();
    p->print("invoice.pdf");
    cout << "Now asking the same printer to scan (it was FORCED to implement scan)..." << endl;
    try {
        p->scan("id-proof.jpg");
    } catch (exception& e) {
        cout << "  CRASH: " << e.what() << endl;
    }
    delete p;
    return 0;
}
