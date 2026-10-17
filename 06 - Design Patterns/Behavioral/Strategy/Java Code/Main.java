// =============================================================================
// STRATEGY (Java twin of example.cpp) — a family of interchangeable algorithms,
// each in its own class, swapped at run time through a common interface.
//
// Domain: a navigation app whose route algorithm (fastest / shortest /
// avoid-tolls) is chosen at run time without changing the Navigator.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Strategy interface: the common contract ----------
interface RouteStrategy {
    String buildRoute(String from, String to);
}

// ---------- Concrete strategies: interchangeable algorithms ----------
class FastestRoute implements RouteStrategy {
    public String buildRoute(String from, String to) {
        return from + " -> [highway, 2 tolls] -> " + to + "  (42 min)";
    }
}

class ShortestRoute implements RouteStrategy {
    public String buildRoute(String from, String to) {
        return from + " -> [city roads] -> " + to + "  (11 km, 55 min)";
    }
}

class AvoidTollsRoute implements RouteStrategy {
    public String buildRoute(String from, String to) {
        return from + " -> [no tolls] -> " + to + "  (49 min)";
    }
}

// ---------- Context: holds a strategy, swappable any time ----------
class Navigator {
    private RouteStrategy strategy;

    void setStrategy(RouteStrategy s) {
        this.strategy = s;
    }
    void navigate(String from, String to) {
        if (this.strategy == null) {
            System.out.println("  no strategy set");
            return;
        }
        System.out.println("  " + this.strategy.buildRoute(from, to));
    }
}

public class Main {
    public static void main(String[] args) {
        Navigator nav = new Navigator();

        System.out.println("Fastest:");
        nav.setStrategy(new FastestRoute());
        nav.navigate("Home", "Office");

        System.out.println("Shortest:");
        nav.setStrategy(new ShortestRoute());
        nav.navigate("Home", "Office");

        System.out.println("Avoid tolls (swapped at run time):");
        nav.setStrategy(new AvoidTollsRoute());
        nav.navigate("Home", "Office");
    }
}
