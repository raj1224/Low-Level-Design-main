// =============================================================================
// DEPENDENCY INVERSION PRINCIPLE — the FIX (Java twin of follows-dip.cpp).
// Both sides depend on the IMessageClient abstraction, injected via the
// constructor (dependency injection).
//
// Build & run:
//   javac FollowsDIP.java
//   java FollowsDIP
// =============================================================================
public class FollowsDIP {

    // The abstraction both sides agree on.
    interface IMessageClient {
        void send(String to, String body);
    }

    // Low-level details — interchangeable.
    static class SmtpEmailClient implements IMessageClient {
        public void send(String to, String body) {
            System.out.println("  [SMTP] to " + to + ": " + body);
        }
    }

    static class SmsClient implements IMessageClient {
        public void send(String to, String body) {
            System.out.println("  [SMS]  to " + to + ": " + body);
        }
    }

    // High-level policy depends on the ABSTRACTION, injected via the constructor.
    static class NotificationService {
        private IMessageClient client;
        NotificationService(IMessageClient client) { this.client = client; }
        void notify(String user, String msg) { this.client.send(user, msg); }
    }

    public static void main(String[] args) {
        IMessageClient email = new SmtpEmailClient();
        IMessageClient sms = new SmsClient();

        // Swap the detail without touching NotificationService at all:
        NotificationService viaEmail = new NotificationService(email);
        NotificationService viaSms = new NotificationService(sms);

        viaEmail.notify("aarav@mail.com", "Your order shipped");
        viaSms.notify("+91-90000-00000", "Your OTP is 4827");
        System.out.println("Same service, swapped transport - and a test could inject a fake client.");
    }
}
