// =============================================================================
// SINGLETON (Java twin of example.cpp) — one instance, one access point. Here
// the instance is created eagerly in a static field (thread-safe by classloader
// guarantees) and the constructor is private.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================
class Logger {
    private static final Logger INSTANCE = new Logger();   // created once by the classloader
    private int count = 0;

    private Logger() {}                                     // private ctor => no outside construction

    static Logger instance() { return INSTANCE; }

    void log(String msg) {
        this.count = this.count + 1;
        System.out.println("[LOG #" + this.count + "] " + msg);
    }
    int messageCount() { return this.count; }
}

public class Main {
    // A second, unrelated module logging through the SAME logger.
    static void processPayment(double amount) {
        Logger.instance().log("charging Rs " + (int) amount);
    }

    public static void main(String[] args) {
        // Every access returns the SAME object.
        Logger a = Logger.instance();
        Logger b = Logger.instance();
        System.out.println("Same instance? " + (a == b ? "yes" : "no"));

        Logger.instance().log("application started");
        processPayment(799);
        processPayment(1499);
        Logger.instance().log("application shutting down");

        System.out.println("Total messages through the one Logger: "
                + Logger.instance().messageCount());
    }
}
