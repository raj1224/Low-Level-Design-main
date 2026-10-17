// =============================================================================
// CHAIN OF RESPONSIBILITY — pass a request along a chain of handlers. Each
// handler either handles (part of) the request or forwards it to the next. The
// sender doesn't know which handler will deal with it.
//
// Domain: an ATM cash dispenser. To dispense an amount it uses the fewest notes:
// a Rs 2000 handler takes as many 2000s as it can, passes the remainder to the
// Rs 500 handler, then Rs 100. Adding a Rs 200 note = inserting one handler.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>

using namespace std;

// ---------- Handler ----------
class NoteDispenser {
private:
    int denom;
    NoteDispenser* next;
public:
    NoteDispenser(int denomination) {
        this->denom = denomination;
        this->next = nullptr;
    }
    void setNext(NoteDispenser* next) { this->next = next; }

    void dispense(int amount) {
        int count = amount / this->denom;
        int remainder = amount % this->denom;
        if (count > 0)
            cout << "  dispense " << count << " x Rs " << this->denom << endl;
        if (remainder > 0) {
            if (this->next != nullptr) this->next->dispense(remainder);   // forward the rest
            else cout << "  cannot dispense remaining Rs " << remainder << endl;
        }
    }
    virtual ~NoteDispenser() {}
};

int main() {
    // Build the chain: 2000 -> 500 -> 100
    NoteDispenser* h2000 = new NoteDispenser(2000);
    NoteDispenser* h500 = new NoteDispenser(500);
    NoteDispenser* h100 = new NoteDispenser(100);
    h2000->setNext(h500);
    h500->setNext(h100);

    int amounts[] = { 5600, 2000, 750 };
    for (int i = 0; i < 3; i++) {
        cout << "Withdraw Rs " << amounts[i] << ":" << endl;
        h2000->dispense(amounts[i]);          // always enter at the head
    }

    delete h2000;
    delete h500;
    delete h100;
    return 0;
}
