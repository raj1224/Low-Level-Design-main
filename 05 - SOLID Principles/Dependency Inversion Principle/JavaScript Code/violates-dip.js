/*
DEPENDENCY INVERSION PRINCIPLE (DIP) — VIOLATION

"High-level modules and low-level modules should both
depend on abstractions."

NotificationService directly creates SmtpEmailClient.
It is welded to SMTP, making it harder to switch to SMS
or to test without sending a real email.
*/

class SmtpEmailClient {
    send(to, body) {
        console.log(`[SMTP] to ${to}: ${body}`);
    }
}

class NotificationService {
    constructor() {
        // Hard-coded concrete dependency.
        this.client = new SmtpEmailClient();
    }

    notify(user, message) {
        this.client.send(user, message);
    }
}

const notificationService = new NotificationService();

notificationService.notify(
    "aarav@mail.com",
    "Your order shipped"
);

/*
PROBLEM:
NotificationService chooses its own delivery mechanism.
Switching to SMS or injecting a fake for tests requires
changing the service's implementation.
*/
