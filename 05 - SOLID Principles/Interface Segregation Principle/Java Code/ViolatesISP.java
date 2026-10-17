// =============================================================================
// INTERFACE SEGREGATION PRINCIPLE — the VIOLATION (Java twin of violates-isp.cpp).
// One fat interface forces SimplePrinter to implement scan()/fax() it lacks.
//
// Build & run:
//   javac ViolatesISP.java
//   java ViolatesISP
// =============================================================================
public class ViolatesISP {

    interface IMultiFunctionDevice {
        void print(String doc);
        void scan(String doc);
        void fax(String doc);
    }

    static class SimplePrinter implements IMultiFunctionDevice {
        public void print(String doc) { System.out.println("  [print] " + doc); }
        public void scan(String doc) { throw new UnsupportedOperationException("no scanner!"); }
        public void fax(String doc)  { throw new UnsupportedOperationException("no fax!"); }
    }

    public static void main(String[] args) {
        SimplePrinter p = new SimplePrinter();
        p.print("invoice.pdf");
        System.out.println("Now asking the same printer to scan (it was FORCED to implement scan)...");
        try {
            p.scan("id-proof.jpg");
        } catch (RuntimeException e) {
            System.out.println("  CRASH: " + e.getMessage());
        }
    }
}
