// =============================================================================
// ABSTRACTION (Java twin of abstraction.cpp) — the caller depends only on the
// PaymentMethod interface (the WHAT); each implementation hides its own HOW.
//
// Build & run:
//   javac Abstraction.java
//   java Abstraction
// =============================================================================
import java.util.ArrayList;
import java.util.List;

// The abstraction: WHAT you can do, not HOW.
interface PaymentMethod {
    boolean pay(double amount);
    String name();
}

class CreditCard implements PaymentMethod {
    private String last4;
    CreditCard(String last4) { this.last4 = last4; }
    public boolean pay(double amount) {
        // (hidden detail) tokenize, contact the card network, handle 3-D Secure...
        System.out.println("  [CreditCard ****" + this.last4 + "] authorizing Rs " + amount);
        return true;
    }
    public String name() { return "Credit Card"; }
}

class UpiPayment implements PaymentMethod {
    private String vpa;
    UpiPayment(String vpa) { this.vpa = vpa; }
    public boolean pay(double amount) {
        // (hidden detail) build a collect request, poll the PSP, await the PIN...
        System.out.println("  [UPI " + this.vpa + "] collecting Rs " + amount);
        return true;
    }
    public String name() { return "UPI"; }
}

public class Abstraction {
    // The client depends ONLY on the abstraction. Add a Wallet tomorrow and this
    // method never changes.
    static void checkout(PaymentMethod method, double amount) {
        System.out.println("Paying via " + method.name() + "...");
        if (method.pay(amount)) {
            System.out.println("  -> success");
        }
    }

    public static void main(String[] args) {
        List<PaymentMethod> methods = new ArrayList<PaymentMethod>();
        methods.add(new CreditCard("4242"));
        methods.add(new UpiPayment("aarav@okbank"));

        for (PaymentMethod m : methods) {
            checkout(m, 799.0);
        }
    }
}
