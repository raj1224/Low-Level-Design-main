// =============================================================================
// POLYMORPHISM — "many forms" (Java twin of polymorphism.cpp).
//
//   1. STATIC (compile-time): method overloading & generics. The compiler picks
//      the correct version from the argument types.
//   2. DYNAMIC (run-time): an abstract base + overrides. The correct method is
//      chosen at run time from the REAL object behind a base-class reference.
//
// Real-world analogy: you press "send". Email, SMS and Push all understand
// "send", but each performs it in its own way.
//
// Build & run:
//   javac Polymorphism.java
//   java Polymorphism
// =============================================================================
import java.util.ArrayList;
import java.util.List;

// ---------- DYNAMIC polymorphism: abstract base + overrides ----------
// Every channel MUST provide send(), but each does it differently.
abstract class Notifier {
    public abstract void send(String msg);
}

class EmailNotifier extends Notifier {
    public void send(String msg) { System.out.println("  [EMAIL] " + msg); }
}

class SmsNotifier extends Notifier {
    public void send(String msg) { System.out.println("  [SMS]   " + msg); }
}

class PushNotifier extends Notifier {
    public void send(String msg) { System.out.println("  [PUSH]  " + msg); }
}

public class Polymorphism {

    // ---------- STATIC polymorphism: overloading (compiler chooses by type) ----------
    static String asLabel(int n)    { return "int(" + n + ")"; }
    static String asLabel(double d) { return "double(" + d + ")"; }
    static String asLabel(String s) { return "string(\"" + s + "\")"; }

    // Generics are static polymorphism too: one source, works for any
    // Comparable type, resolved by the compiler.
    static <T extends Comparable<T>> T maxOf(T a, T b) {
        return (a.compareTo(b) >= 0) ? a : b;
    }

    // Written ONCE against the base type; works for every Notifier subclass.
    static void broadcast(List<Notifier> channels, String msg) {
        for (Notifier c : channels) {
            c.send(msg);   // resolved at RUN TIME to the real type
        }
    }

    public static void main(String[] args) {
        System.out.println("Static polymorphism (overloading):");
        System.out.println("  " + asLabel(42));
        System.out.println("  " + asLabel(3.14));
        System.out.println("  " + asLabel("hello"));
        System.out.println("  maxOf(3, 9)     = " + maxOf(3, 9));
        System.out.println("  maxOf(2.5, 1.5) = " + maxOf(2.5, 1.5));
        System.out.println();

        System.out.println("Dynamic polymorphism (virtual dispatch):");
        List<Notifier> channels = new ArrayList<Notifier>();
        channels.add(new EmailNotifier());
        channels.add(new SmsNotifier());
        channels.add(new PushNotifier());

        broadcast(channels, "Your OTP is 4827");
        // No manual cleanup in Java — the garbage collector reclaims the objects.
    }
}
