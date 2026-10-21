
// =============================================================================
// STATE — allow an object to alter its behaviour when its internal state
// changes; the object appears to change its class. Each state is a class; the
// context delegates to the current state, which also decides the next state.
// This replaces a tangle of if/else on a "status" field.
//
// Domain: a vending machine. Its behaviour for insertCoin()/selectProduct()
// depends entirely on whether it's idle, has a coin, or is sold out.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- State interface ----------
class State {
    insertCoin(m) {
        throw new Error("insertCoin() must be implemented");
    }

    selectProduct(m) {
        throw new Error("selectProduct() must be implemented");
    }

    name() {
        throw new Error("name() must be implemented");
    }
}

// ---------- Context ----------
class VendingMachine {
    constructor(stock) {
        this.stockValue = stock;
        this.state = new IdleState();
    }

    setState(s) {
        this.state = s;
    }

    insertCoin() {
        console.log(`[${this.state.name()}] `);
        this.state.insertCoin(this);
    }

    selectProduct() {
        console.log(`[${this.state.name()}] `);
        this.state.selectProduct(this);
    }

    stock() {
        return this.stockValue;
    }

    decrementStock() {
        this.stockValue = this.stockValue - 1;
    }
}

// ---------- Concrete states ----------
class IdleState extends State {
    insertCoin(m) {
        console.log("coin accepted");
        m.setState(new HasCoinState()); // Idle -> HasCoin
    }

    selectProduct(m) {
        console.log("insert a coin first");
    }

    name() {
        return "Idle";
    }
}

class HasCoinState extends State {
    insertCoin(m) {
        console.log("coin already inserted");
    }

    selectProduct(m) {
        m.decrementStock();
        console.log(`dispensing... (${m.stock()} left)`);

        if (m.stock() === 0) {
            m.setState(new SoldOutState());
        } else {
            m.setState(new IdleState());
        }
    }

    name() {
        return "HasCoin";
    }
}

class SoldOutState extends State {
    insertCoin(m) {
        console.log("machine sold out - coin returned");
    }

    selectProduct(m) {
        console.log("machine sold out");
    }

    name() {
        return "SoldOut";
    }
}

function main() {
    const m = new VendingMachine(2);

    m.selectProduct(); // Idle: needs a coin
    m.insertCoin();    // Idle -> HasCoin
    m.selectProduct(); // dispense, 1 left -> Idle
    m.insertCoin();    // Idle -> HasCoin
    m.selectProduct(); // dispense, 0 left -> SoldOut
    m.insertCoin();    // SoldOut: coin returned
}

main();
