// =============================================================================
// CHAIN OF RESPONSIBILITY (Java twin of example.cpp) — an ATM dispenses notes by
// passing the remainder down a 2000 -> 500 -> 100 chain of handlers.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================
class NoteDispenser {
    private int denom;
    private NoteDispenser next = null;
    NoteDispenser(int denomination) { this.denom = denomination; }
    void setNext(NoteDispenser next) { this.next = next; }

    void dispense(int amount) {
        int count = amount / this.denom;
        int remainder = amount % this.denom;
        if (count > 0)
            System.out.println("  dispense " + count + " x Rs " + this.denom);
        if (remainder > 0) {
            if (this.next != null) this.next.dispense(remainder);   // forward the rest
            else System.out.println("  cannot dispense remaining Rs " + remainder);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        NoteDispenser h2000 = new NoteDispenser(2000);
        NoteDispenser h500 = new NoteDispenser(500);
        NoteDispenser h100 = new NoteDispenser(100);
        h2000.setNext(h500);
        h500.setNext(h100);

        int[] amounts = { 5600, 2000, 750 };
        for (int amount : amounts) {
            System.out.println("Withdraw Rs " + amount + ":");
            h2000.dispense(amount);                  // always enter at the head
        }
    }
}
