// =============================================================================
// SINGLE RESPONSIBILITY PRINCIPLE — the FIX (Java twin of follows-srp.cpp).
// One class per responsibility: Order models data; OrderRepository persists;
// ReceiptFormatter presents; EmailService notifies.
//
// Build & run:
//   javac FollowsSRP.java
//   java FollowsSRP
// =============================================================================
import java.util.ArrayList;
import java.util.List;

public class FollowsSRP {

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

    // (1) Pure domain model — changes only if the meaning of an order does.
    static class Order {
        private List<Line> lines = new ArrayList<Line>();
        void addLine(Line l) {
            this.lines.add(l);
        }
        double total() {
            double t = 0;
            for (Line l : this.lines) {
                t += l.price * l.qty;
            }
            return t;
        }
        List<Line> getLines() {
            return this.lines;
        }
    }

    // (2) Persistence — changes only if the storage mechanism changes.
    static class OrderRepository {
        void save(Order o) {
            System.out.println("  [DB] saved order, total = Rs " + (long) o.total());
        }
    }

    // (3) Presentation — changes only if the receipt layout changes.
    static class ReceiptFormatter {
        String format(Order o) {
            StringBuilder s = new StringBuilder("  RECEIPT\n");
            for (Line l : o.getLines()) {
                s.append("    ").append(l.item).append(" x").append(l.qty).append("\n");
            }
            s.append("    TOTAL: Rs ").append((long) o.total());
            return s.toString();
        }
    }

    // (4) Notification — changes only if the delivery channel changes.
    static class EmailService {
        void send(String body) {
            System.out.println("  [EMAIL] sending:\n" + body);
        }
    }

    public static void main(String[] args) {
        Order order = new Order();
        order.addLine(new Line("USB-C Cable", 299, 2));
        order.addLine(new Line("Phone Case", 499, 1));

        OrderRepository repo = new OrderRepository();
        ReceiptFormatter formatter = new ReceiptFormatter();
        EmailService email = new EmailService();

        repo.save(order);                       // each collaborator does exactly ONE job
        email.send(formatter.format(order));    // and can be swapped / tested on its own
    }
}
