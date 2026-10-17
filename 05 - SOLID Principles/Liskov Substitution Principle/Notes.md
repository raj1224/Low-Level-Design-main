# Liskov Substitution Principle (LSP)

> **Section 05 — SOLID** · the **L** · Code: [C++](C++%20Code/) · [Java](Java%20Code/)

> *"Subtypes must be substitutable for their base type."* Code that works with the base must keep working when handed a subclass — no surprises, no thrown "not supported".

| C++ | Java | Shows |
|---|---|---|
| `violates-lsp.cpp` | `ViolatesLSP.java` | a `FixedDeposit` that throws on `withdraw()` |
| `follows-lsp.cpp` | `FollowsLSP.java` | a `Withdrawable` capability interface |

---

## The smell

Every `Account` exposes `withdraw()`, but a `FixedDeposit` can't be withdrawn before maturity, so it overrides `withdraw()` to **throw**. Any function written against `Account` — like `payBill(Account, amt)` — becomes a runtime landmine: it compiles, then **crashes** when handed an FD.

## The fix

Split the hierarchy by **capability**. Only accounts that genuinely support withdrawal implement a `Withdrawable` interface, and `payBill` asks for `Withdrawable`. Now handing it an FD is a **compile-time** error, not a production incident:

```cpp
void payBill(Withdrawable* source, double amt) { source->withdraw(amt); }
// payBill(fixedDeposit, 100);  // won't compile — FD isn't Withdrawable
```

> **How to spot it:** a subclass that **throws "not supported"**, returns `null`, or quietly does nothing for a method the base promised. The inheritance is a lie — restructure it. (This is the same idea as the Interface Segregation fix.)

## How to run

**C++**
```powershell
cd "05 - SOLID Principles/Liskov Substitution Principle/C++ Code"
g++ -std=c++14 violates-lsp.cpp -o violates.exe ; .\violates.exe
g++ -std=c++14 follows-lsp.cpp  -o follows.exe  ; .\follows.exe
```
**Java**
```powershell
cd "05 - SOLID Principles/Liskov Substitution Principle/Java Code"
javac ViolatesLSP.java ; java ViolatesLSP
javac FollowsLSP.java  ; java FollowsLSP
```

### Expected output (`violates`)
```
Savings balance after bill: Rs 3800
Now paying a bill from the FD (typed as Account)...
  CRASH: cannot withdraw from an FD before maturity
```
The `follows` version makes that same mistake **fail to compile** instead of crashing.
