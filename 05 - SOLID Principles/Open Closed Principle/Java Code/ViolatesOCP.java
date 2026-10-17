// =============================================================================
// OPEN/CLOSED PRINCIPLE — the VIOLATION (Java twin of violates-ocp.cpp).
// A growing if/else over coupon strings; every new coupon edits this function.
//
// Build & run:
//   javac ViolatesOCP.java
//   java ViolatesOCP
// =============================================================================
public class ViolatesOCP {

    static double finalPrice(String coupon, double cart) {
        if (coupon.equals("FLAT100"))        return cart - 100;
        else if (coupon.equals("PERCENT10")) return cart * 0.90;
        else if (coupon.equals("FESTIVE"))   return cart * 0.80;
        return cart;
    }

    public static void main(String[] args) {
        double cart = 1000;
        System.out.println("Cart = Rs " + cart);
        System.out.println("  FLAT100   ->  Rs " + finalPrice("FLAT100", cart));
        System.out.println("  PERCENT10 ->  Rs " + finalPrice("PERCENT10", cart));
        System.out.println("  FESTIVE   ->  Rs " + finalPrice("FESTIVE", cart));
        System.out.println("Every new coupon type means editing finalPrice() again.");
    }
}
