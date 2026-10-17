// =============================================================================
// LISKOV SUBSTITUTION PRINCIPLE — the VIOLATION (Java twin of violates-lsp.cpp).
// FixedDeposit "is-a" Account but throws on withdraw(); any code taking an
// Account becomes a runtime landmine.
//
// Build & run:
//   javac ViolatesLSP.java
//   java ViolatesLSP
// =============================================================================
public class ViolatesLSP {

    static class Account {
        protected double balance = 0;
        void deposit(double a) { this.balance += a; }
        void withdraw(double a) { this.balance -= a; }   // base PROMISES this works
        double getBalance() { return this.balance; }
    }

    static class FixedDeposit extends Account {
        void withdraw(double a) {
            // Breaks the base's promise — crashes any function written against Account.
            throw new UnsupportedOperationException("cannot withdraw from an FD before maturity");
        }
    }

    static void payBill(Account acc, double amt) {
        acc.withdraw(amt);
    }

    public static void main(String[] args) {
        Account sav = new Account();
        sav.deposit(5000);
        payBill(sav, 1200);
        System.out.println("Savings balance after bill: Rs " + sav.getBalance());

        Account fd = new FixedDeposit();
        fd.deposit(100000);
        System.out.println("Now paying a bill from the FD (typed as Account)...");
        try {
            payBill(fd, 100);   // compiles, then BOOM at runtime
        } catch (RuntimeException e) {
            System.out.println("  CRASH: " + e.getMessage());
        }
    }
}
