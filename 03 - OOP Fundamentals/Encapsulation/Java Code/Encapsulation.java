// =============================================================================
// ENCAPSULATION (Java twin of encapsulation.cpp) — private data + guarding
// methods so the invariant (balance >= 0) can never be broken from outside.
//
// Build & run:
//   javac Encapsulation.java
//   java Encapsulation
// =============================================================================
public class Encapsulation {

    static class BankAccount {
        private String owner;
        private long balancePaise;   // paise (integer) to avoid float drift on money

        BankAccount(String owner, long openingPaise) {
            this.owner = owner;
            this.balancePaise = 0;
            // Route the opening balance through deposit() so validation lives once.
            if (openingPaise > 0) deposit(openingPaise);
        }

        // Commands: the only ways to change state, each guarding the invariant.
        void deposit(long paise) {
            if (paise <= 0) throw new IllegalArgumentException("deposit must be positive");
            this.balancePaise += paise;
        }

        void withdraw(long paise) {
            if (paise <= 0) throw new IllegalArgumentException("withdrawal must be positive");
            if (paise > this.balancePaise) throw new IllegalStateException("insufficient funds");
            this.balancePaise -= paise;   // the only place the balance ever decreases
        }

        // Queries: read-only views. We expose rupees, not the raw field.
        double balanceRupees() { return this.balancePaise / 100.0; }
        String getOwner() { return this.owner; }
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("Aarav", 500000);   // Rs 5000.00
        System.out.println(acc.getOwner() + "'s balance: Rs " + acc.balanceRupees());

        acc.deposit(150000);
        acc.withdraw(200000);
        System.out.println("After +1500, -2000:      Rs " + acc.balanceRupees());

        // The invariant is enforced no matter how the object is misused:
        try {
            acc.withdraw(99999900);   // way more than we have
        } catch (RuntimeException e) {
            System.out.println("Blocked bad withdraw:    " + e.getMessage());
        }

        System.out.println("Final balance (still >=0): Rs " + acc.balanceRupees());
    }
}
