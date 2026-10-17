# Inheritance

> **Section 03 — OOP Fundamentals** · Code: [C++](C++%20Code/inheritance.cpp) · [Java](Java%20Code/Inheritance.java)

**Inheritance** lets a subclass reuse a base class and specialize it — an **"is-a"** relationship. Every `FullTimeEmployee`, `Contractor`, and `Manager` **is-a** `Employee`, sharing identity (`name`, `id`) but each computing `monthlySalary()` differently.

---

## Reuse, then specialize

`Manager` extends `FullTimeEmployee` and *reuses* the base computation before adding its bonus:

```cpp
double monthlySalary() {
    return FullTimeEmployee::monthlySalary() + this->bonus;   // reuse, then specialize
}
```
(Java: `super.monthlySalary() + this.bonus`.)

> ⚠️ **The #1 inheritance mistake: using it just to share code.** If "B is-a A" doesn't read as a true fact, don't inherit — **compose** instead (hold an A as a member). A `Stack` is *not* a `Vector` even though it could reuse one. We formalize this with the **Liskov Substitution Principle** in section 05. Rule of thumb: **inherit for "is-a", compose for "has-a".**

## How to run

**C++**
```powershell
cd "03 - OOP Fundamentals/Inheritance/C++ Code"
g++ -std=c++14 inheritance.cpp -o inheritance.exe ; .\inheritance.exe
```
**Java**
```powershell
cd "03 - OOP Fundamentals/Inheritance/Java Code"
javac Inheritance.java ; java Inheritance
```

### Expected output
```
1  Aarav  (Full-time)  ->  Rs 90000
2  Bhavna  (Contractor)  ->  Rs 192000
3  Chetan  (Manager)  ->  Rs 150000
Total monthly payroll: Rs 432000
```
> (Java prints the salaries as `90000.0` etc. — display only.)
