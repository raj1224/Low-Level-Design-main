// =============================================================================
// DEPENDENCY INVERSION PRINCIPLE — the VIOLATION.
// "High-level modules should not depend on low-level modules. Both should
//  depend on abstractions."
//
// Here a high-level NotificationService directly OWNS a concrete SmtpEmailClient.
// It is welded to SMTP — you can't switch to SMS, and you can't unit-test it
// without sending real email.
//
// Build & run:
//   g++ -std=c++14 violates-dip.cpp -o violates
//   ./violates
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

class SmtpEmailClient {
public:
    void sendEmail(string to, string body) {
        cout << "  [SMTP] to " << to << ": " << body << endl;
    }
};

class NotificationService {
private:
    SmtpEmailClient client;   // hard-wired to SMTP forever — can't swap, can't fake
public:
    void notify(string user, string msg) {
        this->client.sendEmail(user, msg);
    }
};

int main() {
    NotificationService* svc = new NotificationService();
    svc->notify("aarav@mail.com", "Your order shipped");
    cout << "...but this service can ONLY ever send SMTP email - no SMS, hard to test." << endl;
    delete svc;
    return 0;
}
