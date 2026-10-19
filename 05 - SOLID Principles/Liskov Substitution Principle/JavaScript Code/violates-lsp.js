/*
LISKOV SUBSTITUTION PRINCIPLE (LSP) — VIOLATION

"Subtypes must be substitutable for their base type."

Every Account has withdraw(), but a FixedDeposit account
cannot be withdrawn before maturity. It throws at runtime,
breaking code that expects any Account to be withdrawable.
*/

class Account {
    constructor(balance) {
        this.balance = balance;
    }

    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error("Insufficient balance");
        }

        this.balance -= amount;
        return this.balance;
    }
}

class SavingsAccount extends Account {}

class FixedDeposit extends Account {
    withdraw() {
        throw new Error(
            "Cannot withdraw from an FD before maturity"
        );
    }
}

function payBill(account, amount) {
    account.withdraw(amount);
    console.log(`Bill paid. Balance: Rs ${account.balance}`);
}

const savings = new SavingsAccount(5000);
payBill(savings, 1200);

const fixedDeposit = new FixedDeposit(10000);

console.log("Now paying a bill from the FD (typed as Account)...");

try {
    payBill(fixedDeposit, 100);
} catch (error) {
    console.log(`CRASH: ${error.message}`);
}

/*
PROBLEM:
FixedDeposit is an Account, but it cannot honour the
withdraw() behaviour promised by the base class.
The error appears at runtime.
*/
