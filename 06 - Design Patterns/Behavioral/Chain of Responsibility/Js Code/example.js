
/*
=============================================================================
// CHAIN OF RESPONSIBILITY — pass a request along a chain of handlers. Each
// handler either handles (part of) the request or forwards it to the next. The
// sender doesn't know which handler will deal with it.
//
// Domain: an ATM cash dispenser. To dispense an amount it uses the fewest notes:
// a Rs 2000 handler takes as many 2000s as it can, passes the remainder to the
// Rs 500 handler, then Rs 100. Adding a Rs 200 note = inserting one handler.
//
// Build & run:
//   node example.js
=============================================================================
*/

// ---------- Handler ----------
class NoteDispenser {
    constructor(denomination) {
        this.denom = denomination;
        this.next = null;
    }

    setNext(next) {
        this.next = next;
    }

    dispense(amount) {
        const count = Math.floor(amount / this.denom);
        const remainder = amount % this.denom;

        if (count > 0) {
            console.log(`  dispense ${count} x Rs ${this.denom}`);
        }

        if (remainder > 0) {
            if (this.next !== null) {
                this.next.dispense(remainder); // forward the rest
            } else {
                console.log(
                    `  cannot dispense remaining Rs ${remainder}`
                );
            }
        }
    }
}

function main() {
    // Build the chain: 2000 -> 500 -> 100
    const h2000 = new NoteDispenser(2000);
    const h500 = new NoteDispenser(500);
    const h100 = new NoteDispenser(100);

    h2000.setNext(h500);
    h500.setNext(h100);

    const amounts = [5600, 2000, 750];

    for (let i = 0; i < amounts.length; i++) {
        console.log(`Withdraw Rs ${amounts[i]}:`);
        h2000.dispense(amounts[i]); // always enter at the head
    }
}

main();
