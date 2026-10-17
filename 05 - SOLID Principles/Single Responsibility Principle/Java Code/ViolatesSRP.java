// =============================================================================
// SINGLE RESPONSIBILITY PRINCIPLE — the VIOLATION (Java twin of violates-srp.cpp).
//
// Order does FOUR unrelated jobs: total, persistence, receipt formatting and
// email. Four reasons to change live in one class.
//
// Build & run:
//   javac ViolatesSRP.java
//   java ViolatesSRP
// =============================================================================
import java.util.ArrayList;
import java.util.List;

public class ViolatesSRP {

    static class Line {
        String item;
        double price;
        int qty;
        Line(String item, double price, int qty) {
            this.item = item;
            this.price = price;
            this.qty = qty;
        }
    }

    // ONE "god class" with four responsibilities glued together.
    static class Order {
        List<Line> lines = new ArrayList<Line>();

        double total() {
            double t = 0;
            for (Line l : this.lines) {
                t += l.price * l.qty;
            }
            return t;
        }

        void saveToDatabase() {
            System.out.println("  [DB] INSERT INTO orders ... total = Rs " + (long) total());
        }

        String formatReceipt() {
            StringBuilder s = new StringBuilder("  RECEIPT\n");
            for (Line l : this.lines) {
                s.append("    ").append(l.item).append(" x").append(l.qty).append("\n");
            }
            s.append("    TOTAL: Rs ").append((long) total());
            return s.toString();
        }

        void emailReceipt() {
            System.out.println("  [EMAIL] sending receipt:\n" + formatReceipt());
        }
    }

    public static void main(String[] args) {
        Order order = new Order();
        order.lines.add(new Line("USB-C Cable", 299, 2));
        order.lines.add(new Line("Phone Case", 499, 1));

        order.saveToDatabase();
        order.emailReceipt();
    }
}
