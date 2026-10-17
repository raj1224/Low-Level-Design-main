// =============================================================================
// INTERFACE SEGREGATION PRINCIPLE — the FIX (Java twin of follows-isp.cpp).
// Three small interfaces; a device implements ONLY what it really supports.
//
// Build & run:
//   javac FollowsISP.java
//   java FollowsISP
// =============================================================================
public class FollowsISP {

    interface Printer { void print(String doc); }
    interface Scanner { void scan(String doc); }
    interface Fax     { void fax(String doc); }

    // A basic printer implements ONLY Printer. It cannot lie about scanning.
    static class OfficePrinter implements Printer {
        public void print(String doc) { System.out.println("  [print] " + doc); }
    }

    // A high-end machine composes exactly the capabilities it really has.
    static class AllInOnePrinter implements Printer, Scanner, Fax {
        public void print(String doc) { System.out.println("  [print] " + doc); }
        public void scan(String doc)  { System.out.println("  [scan]  " + doc); }
        public void fax(String doc)   { System.out.println("  [fax]   " + doc); }
    }

    // Each client asks for exactly the interface it needs — nothing more.
    static void printDocument(Printer p, String doc) { p.print(doc); }
    static void archive(Scanner s, String doc) { s.scan(doc); }

    public static void main(String[] args) {
        OfficePrinter basic = new OfficePrinter();
        printDocument(basic, "invoice.pdf");
        // archive(basic, ...) won't compile — basic has no Scanner capability. Good.

        AllInOnePrinter combo = new AllInOnePrinter();
        printDocument(combo, "contract.pdf");
        archive(combo, "id-proof.jpg");
    }
}
