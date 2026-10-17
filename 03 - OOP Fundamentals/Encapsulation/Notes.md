# Encapsulation

> **Section 03 — OOP Fundamentals** · Code: [C++](C++%20Code/encapsulation.cpp) · [Java](Java%20Code/Encapsulation.java)

**Encapsulation** = keep an object's data **private** and expose only methods that change it in *legal* ways. The payoff: the object can **never** reach an invalid state, no matter how careless the calling code is.

---

## The example

A `BankAccount` keeps `balancePaise` private. The invariant *"balance ≥ 0"* is enforced inside `withdraw()`, so no external code can push the balance negative:

```cpp
void withdraw(long long paise) {
    if (paise <= 0)                  throw invalid_argument("withdrawal must be positive");
    if (paise > this->balancePaise)  throw runtime_error("insufficient funds");
    this->balancePaise -= paise;     // the only place balance ever decreases
}
```

Two pro details worth copying:
- Money is stored as an **integer count of paise**, not a `double` — floating point silently loses precision on money.
- Even the constructor's opening balance is routed through `deposit()`, so validation lives in exactly **one** place.

> **Encapsulation ≠ "a getter and setter for every field."** A setter that blindly writes the field gives up the whole benefit. Expose *operations* (`deposit`, `withdraw`), not raw fields.

## How to run

**C++**
```powershell
cd "03 - OOP Fundamentals/Encapsulation/C++ Code"
g++ -std=c++14 encapsulation.cpp -o encapsulation.exe ; .\encapsulation.exe
```
**Java**
```powershell
cd "03 - OOP Fundamentals/Encapsulation/Java Code"
javac Encapsulation.java ; java Encapsulation
```

### Expected output
```
Aarav's balance: Rs 5000
After +1500, -2000:      Rs 4500
Blocked bad withdraw:    insufficient funds
Final balance (still >=0): Rs 4500
```
> Java prints the rupee amounts as `5000.0` / `4500.0` (whole `double`) — same value, just a display difference.
