
// =============================================================================
// FACTORY METHOD — define an interface for creating an object, but let
// subclasses decide which concrete class to instantiate.
//
// Domain: a logistics company plans deliveries. Road logistics moves goods by
// Truck, sea logistics by Ship. The planning algorithm is identical; only the
// *kind of transport created* differs — so the creation step is a "factory
// method" that each subclass overrides.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Product interface ----------
class Transport {
    deliver() {
        throw new Error("deliver() must be implemented");
    }
}

// ---------- Concrete products ----------
class Truck extends Transport {
    deliver() {
        return "Delivering by land in a truck";
    }
}

class Ship extends Transport {
    deliver() {
        return "Delivering by sea in a container ship";
    }
}

// ---------- Creator: declares the factory method ----------
class Logistics {
    // THE factory method — subclasses decide the concrete Transport.
    createTransport() {
        throw new Error("createTransport() must be implemented");
    }

    // The creator's real work uses the product via its interface only.
    planDelivery() {
        const t = this.createTransport(); // deferred to the subclass
        console.log("  " + t.deliver());
    }
}

// ---------- Concrete creators ----------
class RoadLogistics extends Logistics {
    createTransport() {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    createTransport() {
        return new Ship();
    }
}

// The client picks a creator; the rest of the code is creator-agnostic.
function logisticsFor(mode) {
    if (mode === "sea") {
        return new SeaLogistics();
    }

    return new RoadLogistics();
}

function main() {
    const modes = ["road", "sea"];

    for (let i = 0; i < modes.length; i++) {
        console.log(`${modes[i]} logistics:`);

        const logistics = logisticsFor(modes[i]);
        logistics.planDelivery();
    }
}

main();
