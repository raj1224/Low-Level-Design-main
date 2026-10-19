/*
OPEN/CLOSED PRINCIPLE (OCP) — FOLLOWS

"Software entities should be OPEN for extension,
CLOSED for modification."

Use one discount policy per coupon. The calculator depends
on the policy interface (the apply method), not on coupon names.
This is an example of the Strategy pattern.
*/

class FlatOff {
    constructor(amount) {
        this.amount = amount;
    }

    name() {
        return `Flat Rs ${this.amount}`;
    }

    apply(cartTotal) {
        return Math.max(0, cartTotal - this.amount);
    }
}

class PercentOff {
    constructor(percent) {
        this.percent = percent;
    }

    name() {
        return `${this.percent}% off`;
    }

    apply(cartTotal) {
        return cartTotal * (1 - this.percent / 100);
    }
}

class CappedPercentOff {
    constructor(percent, maxDiscount) {
        this.percent = percent;
        this.maxDiscount = maxDiscount;
    }

    name() {
        return `${this.percent}% off (max Rs ${this.maxDiscount})`;
    }

    apply(cartTotal) {
        const discount = Math.min(
            cartTotal * this.percent / 100,
            this.maxDiscount
        );

        return cartTotal - discount;
    }
}

class DiscountCalculator {
    finalPrice(cartTotal, policy) {
        return policy.apply(cartTotal);
    }
}

const cartTotal = 1000;
const calculator = new DiscountCalculator();

const policies = [
    new FlatOff(100),
    new PercentOff(10),
    new CappedPercentOff(20, 150),
];

console.log(`Cart = Rs ${cartTotal}`);

for (const policy of policies) {
    console.log(
        `  ${policy.name()} -> Rs ${calculator.finalPrice(cartTotal, policy)}`
    );
}

/*
EXPECTED OUTPUT:
Cart = Rs 1000
  Flat Rs 100 -> Rs 900
  10% off -> Rs 900
  20% off (max Rs 150) -> Rs 850

WHY THIS IS BETTER:
Add a new policy class without modifying DiscountCalculator.
*/
