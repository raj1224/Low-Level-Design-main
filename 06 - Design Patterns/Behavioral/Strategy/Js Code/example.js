
/*
=============================================================================
// STRATEGY — define a family of interchangeable algorithms, put each in its own
// class, and make them swappable at run time. The "context" delegates the
// varying behaviour to a strategy object instead of hard-coding it.
//
// Real-world analogy: a navigation app. The ROUTE you want — fastest, shortest,
// or avoid-tolls — is a strategy you pick. The navigator's code stays identical;
// only the plugged-in strategy changes.
//
// Build & run:
//   node example.js
=============================================================================
*/

// ---------- Strategy interface: the common contract ----------

// JavaScript does not have a built-in interface keyword.
// Each strategy is expected to implement buildRoute(from, to).

class RouteStrategy {
    buildRoute(from, to) {
        throw new Error("buildRoute(from, to) must be implemented");
    }
}


// ---------- Concrete strategies: interchangeable algorithms ----------

class FastestRoute extends RouteStrategy {
    buildRoute(from, to) {
        return `${from} -> [highway, 2 tolls] -> ${to}  (20km, 42 min)`;
    }
}

class ShortestRoute extends RouteStrategy {
    buildRoute(from, to) {
        return `${from} -> [city roads] -> ${to}  (11 km, 55 min)`;
    }
}

class AvoidTollsRoute extends RouteStrategy {
    buildRoute(from, to) {
        return `${from} -> [no tolls] -> ${to}  (49 min)`;
    }
}

class NaturalRoute extends RouteStrategy {
    buildRoute(from, to) {
        return `${from} -> [rivers] [lakes] [mountains] -> ${to}`;
    }
}


// ---------- Context: holds a strategy, swappable any time ----------

class Navigator {
    constructor() {
        this.strategy = null;
    }

    // Sets or replaces the current strategy.
    // JavaScript uses garbage collection, so we do not manually delete
    // the previous strategy as we do with the C++ raw pointer example.
    setStrategy(strategy) {
        if (
            strategy !== null &&
            typeof strategy.buildRoute !== "function"
        ) {
            throw new TypeError(
                "Strategy must implement buildRoute(from, to)"
            );
        }

        this.strategy = strategy;
    }

    navigate(from, to) {
        if (this.strategy === null) {
            console.log("  no strategy set");
            return;
        }

        console.log(`  ${this.strategy.buildRoute(from, to)}`);
    }
}


// ---------- Main: demonstrate swapping strategies at run time ----------

function main() {
    const nav = new Navigator();

    console.log("Fastest:");
    nav.setStrategy(new FastestRoute());
    nav.navigate("Home", "Office");

    console.log("Shortest:");
    nav.setStrategy(new ShortestRoute());
    nav.navigate("Home", "Office");

    console.log("Avoid tolls (swapped at run time):");
    nav.setStrategy(new AvoidTollsRoute());
    nav.navigate("Home", "Office");

    console.log("Natural:");
    nav.setStrategy(new NaturalRoute());
    nav.navigate("Home", "Office");
}

main();
