/*
LISKOV SUBSTITUTION PRINCIPLE (LSP) — FOLLOWS

"Subtypes must be substitutable for their base type."

Separate the ability to withdraw from the general Account.
Only accounts that support withdrawal expose that capability.
JavaScript has no built-in interface keyword, so this example
uses a capability contract by convention.
*/

class Account {
    constructor(balance) {
        this.balance = balance;
    }

    getBalance() {
        return this.balance;
    }
}

class WithdrawableAccount extends Account {
    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error("Insufficient balance");
        }

        this.balance -= amount;
        return this.balance;
    }
}

class SavingsAccount extends WithdrawableAccount {}

class FixedDeposit extends Account {
    // No withdraw() method: this account is not withdrawable.
}

function payBill(source, amount) {
    if (typeof source.withdraw !== "function") {
        throw new TypeError(
            "payBill requires an account that supports withdrawal"
        );
    }

    source.withdraw(amount);
    console.log(`Bill paid. Balance: Rs ${source.getBalance()}`);
}

const savings = new SavingsAccount(5000);
payBill(savings, 1200);

// FixedDeposit cannot be passed to payBill because it does
// not provide the withdraw capability.
const fixedDeposit = new FixedDeposit(10000);

console.log(
    `Fixed deposit balance: Rs ${fixedDeposit.getBalance()}`
);

/*
WHY THIS IS BETTER:
- The general Account does not promise withdrawal.
- Only WithdrawableAccount promises withdrawal.
- A FixedDeposit is not forced to fake an unsupported method.

In statically typed languages, an interface can make this
restriction a compile-time check. In JavaScript, use clear
contracts and runtime validation where needed.
*/
