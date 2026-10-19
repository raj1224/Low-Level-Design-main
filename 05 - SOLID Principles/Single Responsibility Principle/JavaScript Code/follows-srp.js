/*
SINGLE RESPONSIBILITY PRINCIPLE (SRP) — FOLLOWS

"A class should have only ONE reason to change."

Separate order modelling, persistence, receipt formatting,
and email delivery into focused classes.
*/

class Order {
    constructor(customerEmail, lines) {
        this.customerEmail = customerEmail;
        this.lines = lines;
    }

    addLine(line) {
        this.lines.push(line);
    }

    total() {
        return this.lines.reduce(
            (sum, line) => sum + line.price * line.quantity,
            0
        );
    }

    getLines() {
        return [...this.lines];
    }
}

class OrderRepository {
    save(order) {
        // Replace this with real database persistence.
        console.log("[DB] Saving order...");
        console.log(`[DB] Stored total: Rs ${order.total()}`);
    }
}

class ReceiptFormatter {
    format(order) {
        const items = order.getLines()
            .map((line) => `${line.name} x${line.quantity}`)
            .join(", ");

        return [
            `Receipt for ${order.customerEmail}`,
            `Items: ${items}`,
            `Total: Rs ${order.total()}`,
        ].join("\n");
    }
}

class EmailService {
    send(to, body) {
        // Replace this with a real email provider.
        console.log(`[Email] To: ${to}\n${body}`);
    }
}

const order = new Order("aarav@example.com", [
    { name: "Keyboard", price: 800, quantity: 1 },
    { name: "Mouse", price: 200, quantity: 1 },
]);

const repository = new OrderRepository();
const formatter = new ReceiptFormatter();
const emailService = new EmailService();

repository.save(order);

const receipt = formatter.format(order);
console.log(receipt);
emailService.send(order.customerEmail, receipt);

/*
WHY THIS IS BETTER:
- Order models the order and calculates its total.
- OrderRepository handles persistence.
- ReceiptFormatter handles receipt layout.
- EmailService handles email delivery.
Each class has one focused reason to change.
*/
