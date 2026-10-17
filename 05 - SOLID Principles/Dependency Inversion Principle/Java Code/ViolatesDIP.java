// =============================================================================
// DEPENDENCY INVERSION PRINCIPLE — the VIOLATION (Java twin of violates-dip.cpp).
// NotificationService owns a concrete SmtpEmailClient — welded to SMTP.
//
// Build & run:
//   javac ViolatesDIP.java
//   java ViolatesDIP
// =============================================================================
public class ViolatesDIP {

    static class SmtpEmailClient {
        void sendEmail(String to, String body) {
            System.out.println("  [SMTP] to " + to + ": " + body);
        }
    }

    static class NotificationService {
        private SmtpEmailClient client = new SmtpEmailClient();   // hard-wired forever
        void notify(String user, String msg) {
            this.client.sendEmail(user, msg);
        }
    }

    public static void main(String[] args) {
        NotificationService svc = new NotificationService();
        svc.notify("aarav@mail.com", "Your order shipped");
        System.out.println("...but this service can ONLY ever send SMTP email - no SMS, hard to test.");
    }
}
