/*
SINGLE RESPONSIBILITY PRINCIPLE (SRP) — VIOLATION

"A class should have only ONE reason to change."

This Order class has several responsibilities:
1. Model an order and calculate its total.
2. Save the order to a database.
3. Format the receipt.
4. Email the receipt.

Changing database code, receipt layout, or email delivery
could require editing this same class.
*/

class Order {
    constructor(customerEmail, lines) {
        this.customerEmail = customerEmail;
        this.lines = lines;
    }

    total() {
        return this.lines.reduce(
            (sum, line) => sum + line.price * line.quantity,
            0
        );
    }

    saveToDatabase() {
        // Placeholder for database logic.
        console.log("[DB] Saving order...");
    }

    formatReceipt() {
        // Receipt formatting is another responsibility.
        return `Receipt for ${this.customerEmail}\nTotal: Rs ${this.total()}`;
    }

    emailReceipt() {
        // Email delivery is yet another responsibility.
        console.log(`[Email] Sending:\n${this.formatReceipt()}`);
    }
}

const order = new Order("aarav@example.com", [
    { name: "Keyboard", price: 800, quantity: 1 },
    { name: "Mouse", price: 200, quantity: 1 },
]);

order.saveToDatabase();
console.log(order.formatReceipt());
order.emailReceipt();

/*
PROBLEM:
The Order class has multiple reasons to change.
It is harder to test and maintain each responsibility in isolation.
*/
