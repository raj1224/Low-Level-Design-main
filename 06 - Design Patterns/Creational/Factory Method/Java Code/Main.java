// =============================================================================
// FACTORY METHOD (Java twin of example.cpp) — subclasses decide which concrete
// product to create; the creator's algorithm stays the same.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Product interface ----------
interface Transport {
    String deliver();
}

// ---------- Concrete products ----------
class Truck implements Transport {
    public String deliver() { return "Delivering by land in a truck"; }
}

class Ship implements Transport {
    public String deliver() { return "Delivering by sea in a container ship"; }
}

// ---------- Creator: declares the factory method ----------
abstract class Logistics {
    // THE factory method — subclasses decide the concrete Transport.
    abstract Transport createTransport();

    // The creator's real work uses the product via its interface only.
    void planDelivery() {
        Transport t = createTransport();   // deferred to the subclass
        System.out.println("  " + t.deliver());
    }
}

// ---------- Concrete creators ----------
class RoadLogistics extends Logistics {
    Transport createTransport() { return new Truck(); }
}

class SeaLogistics extends Logistics {
    Transport createTransport() { return new Ship(); }
}

public class Main {
    static Logistics logisticsFor(String mode) {
        if (mode.equals("sea")) return new SeaLogistics();
        return new RoadLogistics();
    }

    public static void main(String[] args) {
        for (String mode : new String[] { "road", "sea" }) {
            System.out.println(mode + " logistics:");
            logisticsFor(mode).planDelivery();
        }
    }
}
