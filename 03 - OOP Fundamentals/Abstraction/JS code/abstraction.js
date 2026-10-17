// =============================================================================
// ABSTRACTION — exposing WHAT an object can do while hiding HOW it does it.
//
// Domain: A checkout that accepts different payment methods.
// Checkout knows only that a payment method can pay(amount).
// It doesn't know the internal details of cards or UPI.
// =============================================================================

// Concrete class: CreditCard
class CreditCard {
  constructor(last4) {
    this.last4 = last4;
  }

  pay(amount) {
    // Hidden details: tokenize, contact card network, handle 3-D Secure...
    console.log(
      `  [CreditCard ****${this.last4}] authorizing Rs ${amount}`
    );

    return true;
  }

  name() {
    return "Credit Card";
  }
}

// Concrete class: UpiPayment
class UpiPayment {
  constructor(vpa) {
    this.vpa = vpa;
  }

  pay(amount) {
    // Hidden details: build collect request, poll PSP, await PIN...
    console.log(
      `  [UPI ${this.vpa}] collecting Rs ${amount}`
    );

    return true;
  }

  name() {
    return "UPI";
  }
}

// Client depends on the common interface (pay and name).
// It doesn't need to know which payment method is being used.
function checkout(method, amount) {
  console.log(`Paying via ${method.name()}...`);

  if (method.pay(amount)) {
    console.log("  -> success");
  }
}

// Main program
const methods = [
  new CreditCard("4242"),
  new UpiPayment("aarav@okbank")
];

for (const method of methods) {
  checkout(method, 799.0);
}