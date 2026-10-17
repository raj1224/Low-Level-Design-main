// =============================================================================
// SINGLE RESPONSIBILITY PRINCIPLE — the VIOLATION.
// "A class should have only ONE reason to change."
//
// Below, Order does FOUR unrelated jobs at once:
//   (1) computes the total, (2) saves itself to a database,
//   (3) formats a printed receipt, and (4) emails the customer.
// Four reasons to change are welded into one class — editing the email format
// risks breaking total calculation, and none of it can be tested in isolation.
//
// Build & run:
//   g++ -std=c++14 violates-srp.cpp -o violates
//   ./violates
// =============================================================================
#include <iostream>
#include <string>
#include <vector>

using namespace std;

struct Line {
    string item;
    double price;
    int qty;
};

// ONE "god class" with four responsibilities glued together.
class Order {
public:
    vector<Line> lines;

    // Responsibility 1: pricing rules.
    double total() {
        double t = 0;
        for (int i = 0; i < (int)this->lines.size(); i++) {
            t += this->lines[i].price * this->lines[i].qty;
        }
        return t;
    }

    // Responsibility 2: persistence (changes whenever the database changes).
    void saveToDatabase() {
        cout << "  [DB] INSERT INTO orders ... total = Rs " << (long)this->total() << endl;
    }

    // Responsibility 3: presentation (changes whenever the receipt layout does).
    string formatReceipt() {
        string s = "  RECEIPT\n";
        for (int i = 0; i < (int)this->lines.size(); i++) {
            s += "    " + this->lines[i].item + " x" + to_string(this->lines[i].qty) + "\n";
        }
        s += "    TOTAL: Rs " + to_string((long)this->total());
        return s;
    }

    // Responsibility 4: notification (changes whenever the email provider does).
    void emailReceipt() {
        cout << "  [EMAIL] sending receipt:\n" << this->formatReceipt() << endl;
    }
};

int main() {
    Order* order = new Order();
    order->lines.push_back({"USB-C Cable", 299, 2});
    order->lines.push_back({"Phone Case", 499, 1});

    // One object doing everything: pricing, DB, formatting AND email.
    order->saveToDatabase();
    order->emailReceipt();

    delete order;
    return 0;
}
