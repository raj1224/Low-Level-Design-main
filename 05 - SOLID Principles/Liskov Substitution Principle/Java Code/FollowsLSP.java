// =============================================================================
// LISKOV SUBSTITUTION PRINCIPLE — the FIX (Java twin of follows-lsp.cpp).
// Split by capability: only accounts that can really withdraw implement
// Withdrawable, and payBill() asks for exactly that. An FD won't compile there.
//
// Build & run:
//   javac FollowsLSP.java
//   java FollowsLSP
// =============================================================================
public class FollowsLSP {

    static class Account {
        protected double balance = 0;
        void deposit(double a) { this.balance += a; }
        double getBalance() { return this.balance; }
    }

    // A separate capability. Only accounts that can really do this implement it.
    interface Withdrawable {
        void withdraw(double amount);
    }

    static class SavingsAccount extends Account implements Withdrawable {
        public void withdraw(double amount) {
            if (amount > this.balance) throw new IllegalStateException("insufficient funds");
            this.balance -= amount;
        }
    }

    // An FD IS-A Account, but is simply NOT Withdrawable — the type says so.
    static class FixedDepositAccount extends Account {
        private int maturityMonths;
        FixedDepositAccount(int months) { this.maturityMonths = months; }
        int getMaturityMonths() { return this.maturityMonths; }
    }

    static void payBill(Withdrawable source, double amt) {
        source.withdraw(amt);
    }

    public static void main(String[] args) {
        SavingsAccount sav = new SavingsAccount();
        sav.deposit(5000);
        payBill(sav, 1200);                       // fine — Savings IS Withdrawable
        System.out.println("Savings balance after bill: Rs " + sav.getBalance());

        FixedDepositAccount fd = new FixedDepositAccount(12);
        fd.deposit(100000);
        System.out.println("FD balance: Rs " + fd.getBalance()
                + " (matures in " + fd.getMaturityMonths() + " months)");
        // payBill(fd, 100);  // <-- would NOT compile: FixedDepositAccount isn't Withdrawable
        System.out.println("Compiler refuses payBill(fd, ...): the LSP trap is gone.");
    }
}
