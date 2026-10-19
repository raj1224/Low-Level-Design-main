
// =============================================================================
// SINGLETON — guarantee a class has exactly ONE instance and give the whole
// program a single access point to it. Used for genuinely shared resources:
// a logger, a config store, a connection pool.
//
// This JavaScript implementation uses a private static field and a private
// constructor. The same Logger instance is returned on every call.
//
// Build & run:
//   node example.js
// =============================================================================

class Logger {
    static #instance = null;

    #count;

    constructor(secret) {
        if (secret !== Logger.#instance) {
            throw new Error(
                "Use Logger.instance() to get the Logger instance"
            );
        }

        this.#count = 0;
    }

    static instance() {
        if (Logger.#instance === null) {
            // Created once, on the first call
            Logger.#instance = Object.create(Logger.prototype);
            Logger.#instance.#count = 0;
        }

        return Logger.#instance;
    }

    log(msg) {
        this.#count = this.#count + 1;
        console.log(`[LOG #${this.#count}] ${msg}`);
    }

    messageCount() {
        return this.#count;
    }
}

// A second, unrelated module logging through the SAME logger — no globals passed
// around, no second instance created.
function processPayment(amount) {
    Logger.instance().log(`charging Rs ${Math.trunc(amount)}`);
}

function main() {
    // Every access returns the SAME object.
    const a = Logger.instance();
    const b = Logger.instance();

    console.log("Same instance?", a === b ? "yes" : "no");

    Logger.instance().log("application started");
    processPayment(799);
    processPayment(1499);
    Logger.instance().log("application shutting down");

    console.log(
        "Total messages through the one Logger:",
        Logger.instance().messageCount()
    );
}

main();
