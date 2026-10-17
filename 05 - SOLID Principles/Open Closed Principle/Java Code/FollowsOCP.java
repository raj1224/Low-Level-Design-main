// =============================================================================
// OPEN/CLOSED PRINCIPLE — the FIX (Java twin of follows-ocp.cpp).
// A DiscountPolicy interface (Strategy). A new coupon = a new class; finalPrice
// never changes again.
//
// Build & run:
//   javac FollowsOCP.java
//   java FollowsOCP
// =============================================================================
public class FollowsOCP {

    interface DiscountPolicy {
        double apply(double cart);
        String name();
    }

    static class FlatOff implements DiscountPolicy {
        private double amt;
        FlatOff(double amt) { this.amt = amt; }
        public double apply(double cart) { return cart > this.amt ? cart - this.amt : 0; }
        public String name() { return "Flat Rs " + (int) this.amt; }
    }

    static class PercentOff implements DiscountPolicy {
        private double pct;
        PercentOff(double pct) { this.pct = pct; }
        public double apply(double cart) { return cart * (1.0 - this.pct / 100.0); }
        public String name() { return (int) this.pct + "% off"; }
    }

    // NEW requirement next quarter? Just add this class. Nothing above changes.
    static class CappedPercentOff implements DiscountPolicy {
        private double pct;
        private double cap;
        CappedPercentOff(double pct, double cap) { this.pct = pct; this.cap = cap; }
        public double apply(double cart) {
            double off = cart * this.pct / 100.0;
            if (off > this.cap) off = this.cap;
            return cart - off;
        }
        public String name() {
            return (int) this.pct + "% off (max Rs " + (int) this.cap + ")";
        }
    }

    static double finalPrice(DiscountPolicy policy, double cart) {
        return policy.apply(cart);
    }

    public static void main(String[] args) {
        double cart = 1000;
        DiscountPolicy[] coupons = {
            new FlatOff(100), new PercentOff(10), new CappedPercentOff(20, 150)
        };
        System.out.println("Cart = Rs " + cart);
        for (DiscountPolicy c : coupons) {
            System.out.println("  " + c.name() + "  ->  Rs " + finalPrice(c, cart));
        }
    }
}
