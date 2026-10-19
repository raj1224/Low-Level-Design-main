/*
OPEN/CLOSED PRINCIPLE (OCP) — VIOLATION

"Software entities should be OPEN for extension,
CLOSED for modification."

This calculator uses growing if/else logic for coupon types.
Every new coupon requires editing this function.
*/

function finalPrice(cartTotal, coupon) {
    if (coupon === "FLAT100") {
        return Math.max(0, cartTotal - 100);
    } else if (coupon === "PERCENT10") {
        return cartTotal * 0.90;
    } else if (coupon === "PERCENT20") {
        return cartTotal * 0.80;
    }

    return cartTotal;
}

const cartTotal = 1000;

console.log(`Cart = Rs ${cartTotal}`);
console.log(`Flat Rs 100 -> Rs ${finalPrice(cartTotal, "FLAT100")}`);
console.log(`10% off -> Rs ${finalPrice(cartTotal, "PERCENT10")}`);
console.log(`20% off -> Rs ${finalPrice(cartTotal, "PERCENT20")}`);

/*
PROBLEM:
Adding a new coupon means modifying finalPrice().
That risks breaking existing, already-tested branches.
*/
