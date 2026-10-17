
// =============================================================================
// ENCAPSULATION — bundling data with the methods that guard it, and hiding the
// internals behind a controlled interface so the object's rules ("invariants")
// can never be violated.
//
// Domain: a bank account. The ONE rule we must never break: balance >= 0.
// Because `balancePaise` is private, the ONLY way to change it is through
// methods that enforce that rule — no outside code can corrupt the state.
//
// Run:
//   node encapsulation.js
// =============================================================================

class BankAccount {
  // Private properties: class ke bahar directly access nahi kar sakte
  #owner;
  #balancePaise;

  constructor(owner, openingPaise) {
    this.#owner = owner;
    this.#balancePaise = 0;

    // Opening balance ko bhi deposit() se validate karte hain
    // taaki validation ka logic ek hi jagah rahe (DRY principle)
    if (openingPaise > 0) {
      this.deposit(openingPaise);
    }
  }

  // --- Commands: state change karne ke methods
  // Har method account ke rules ko enforce karta hai

  deposit(paise) {
    // Deposit amount positive hona chahiye
    if (paise <= 0) {
      throw new Error("deposit must be positive");
    }

    // Valid amount ko balance mein add karo
    this.#balancePaise += paise;
  }

  withdraw(paise) {
    // Withdrawal amount positive hona chahiye
    if (paise <= 0) {
      throw new Error("withdrawal must be positive");
    }

    // Account mein sufficient balance hona chahiye
    if (paise > this.#balancePaise) {
      throw new Error("insufficient funds");
    }

    // Balance sirf validation ke baad decrease hota hai
    this.#balancePaise -= paise;
  }

  // --- Queries: read-only views
  // Raw paise ke bajaye balance rupees mein return karte hain

  balanceRupees() {
    return this.#balancePaise / 100;
  }

  getOwner() {
    return this.#owner;
  }
}

// =============================================================================
// MAIN PROGRAM
// =============================================================================

// Account create karo: Aarav ke paas starting mein Rs 5000 hain
// 500000 paise = Rs 5000.00
const acc = new BankAccount("Aarav", 500000);

console.log(
  `${acc.getOwner()}'s balance: Rs ${acc.balanceRupees().toFixed(2)}`
);

// Rs 1500 deposit karo aur Rs 2000 withdraw karo
acc.deposit(150000);
acc.withdraw(200000);

console.log(
  `After +1500, -2000:      Rs ${acc.balanceRupees().toFixed(2)}`
);

// Invariant enforce hota hai, chahe koi object ko misuse karne ki koshish kare
try {
  acc.withdraw(99999900); // Available balance se bahut zyada
} catch (error) {
  console.log(`Blocked bad withdraw:    ${error.message}`);
}

// Failed withdrawal ke baad bhi balance negative nahi hua
console.log(
  `Final balance (still >=0): Rs ${acc.balanceRupees().toFixed(2)}`
);
