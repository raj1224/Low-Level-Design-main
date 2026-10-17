# Abstraction

> **Section 03 — OOP Fundamentals** · Code: [C++](C++%20Code/abstraction.cpp) · [Java](Java%20Code/Abstraction.java)

**Abstraction** means the caller deals with a simplified, essential interface and is shielded from the implementation. In C++ we express it with an **abstract class** (a class with at least one pure-virtual `= 0` method); in Java with an `interface`.

---

## The example

`PaymentMethod` declares the essence — *"you can `pay(amount)`"* — and nothing else:

```cpp
class PaymentMethod {
public:
    virtual bool pay(double amount) = 0;   // WHAT, not HOW
    virtual string name() = 0;
    virtual ~PaymentMethod() {}
};
```

`CreditCard` and `UpiPayment` hide wildly different "how" (card networks vs UPI collect-requests) behind that one method. The `checkout()` function depends only on the abstraction, so adding a `Wallet` tomorrow requires **zero** changes to `checkout()`.

> **Encapsulation vs Abstraction** (often confused):
> - *Encapsulation* hides **data** (the private balance) to protect state.
> - *Abstraction* hides **implementation** (behind an interface) to reduce what the caller must know.
> They reinforce each other but solve different problems.

## How to run

**C++**
```powershell
cd "03 - OOP Fundamentals/Abstraction/C++ Code"
g++ -std=c++14 abstraction.cpp -o abstraction.exe ; .\abstraction.exe
```
**Java**
```powershell
cd "03 - OOP Fundamentals/Abstraction/Java Code"
javac Abstraction.java ; java Abstraction
```

### Expected output
```
Paying via Credit Card...
  [CreditCard ****4242] authorizing Rs 799
  -> success
Paying via UPI...
  [UPI aarav@okbank] collecting Rs 799
  -> success
```
> (Java prints `Rs 799.0` — display only.)
