/*
DEPENDENCY INVERSION PRINCIPLE (DIP) — FOLLOWS

"High-level modules and low-level modules should both
depend on abstractions."

JavaScript has no built-in interface keyword, so the
abstraction is represented by a contract: send(to, body).

NotificationService receives its client through the
constructor (dependency injection).
*/

class SmtpEmailClient {
    send(to, body) {
        console.log(`[SMTP] to ${to}: ${body}`);
    }
}

class SmsClient {
    send(to, body) {
        console.log(`[SMS]  to ${to}: ${body}`);
    }
}

class FakeMessageClient {
    constructor() {
        this.messages = [];
    }

    send(to, body) {
        this.messages.push({ to, body });
    }
}

class NotificationService {
    constructor(client) {
        if (!client || typeof client.send !== "function") {
            throw new TypeError(
                "client must provide send(to, body)"
            );
        }

        this.client = client;
    }

    notify(user, message) {
        this.client.send(user, message);
    }
}

const emailService = new NotificationService(
    new SmtpEmailClient()
);

const smsService = new NotificationService(
    new SmsClient()
);

emailService.notify(
    "aarav@mail.com",
    "Your order shipped"
);

smsService.notify(
    "+91-90000-00000",
    "Your OTP is 4827"
);

// A test can inject a fake client without sending real messages.
const fakeClient = new FakeMessageClient();
const testService = new NotificationService(fakeClient);

testService.notify("test@example.com", "Test message");

console.log(
    "Fake client captured:",
    fakeClient.messages.length,
    "message"
);

/*
EXPECTED DELIVERY OUTPUT:
[SMTP] to aarav@mail.com: Your order shipped
[SMS]  to +91-90000-00000: Your OTP is 4827

WHY THIS IS BETTER:
The same service can use SMTP, SMS, or a fake client.
No changes to NotificationService are required.

DIP vs Dependency Injection:
- DIP is the principle: depend on abstractions.
- Dependency injection is a technique: pass dependencies in.
*/
