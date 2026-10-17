// =============================================================================
// DEPENDENCY INVERSION PRINCIPLE — the FIX.
// Both the high-level policy (NotificationService) and the low-level details
// (Smtp/Sms clients) depend on an IMessageClient abstraction, INJECTED from
// outside (dependency injection). The dependency arrow now points at the
// abstraction — the "inversion."
//
// Build & run:
//   g++ -std=c++14 follows-dip.cpp -o follows
//   ./follows
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// The abstraction both sides agree on.
class IMessageClient {
public:
    virtual void send(string to, string body) = 0;
    virtual ~IMessageClient() {}
};

// Low-level details — interchangeable.
class SmtpEmailClient : public IMessageClient {
public:
    void send(string to, string body) {
        cout << "  [SMTP] to " << to << ": " << body << endl;
    }
};

class SmsClient : public IMessageClient {
public:
    void send(string to, string body) {
        cout << "  [SMS]  to " << to << ": " << body << endl;
    }
};

// High-level policy depends on the ABSTRACTION, injected via the constructor.
class NotificationService {
private:
    IMessageClient* client;
public:
    NotificationService(IMessageClient* client) {
        this->client = client;
    }
    void notify(string user, string msg) {
        this->client->send(user, msg);
    }
};

int main() {
    SmtpEmailClient* email = new SmtpEmailClient();
    SmsClient* sms = new SmsClient();

    // Swap the detail without touching NotificationService at all:
    NotificationService* viaEmail = new NotificationService(email);
    NotificationService* viaSms = new NotificationService(sms);

    viaEmail->notify("aarav@mail.com", "Your order shipped");
    viaSms->notify("+91-90000-00000", "Your OTP is 4827");
    cout << "Same service, swapped transport - and a test could inject a fake client." << endl;

    delete viaEmail;
    delete viaSms;
    delete email;
    delete sms;
    return 0;
}
