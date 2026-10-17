# Interface Segregation Principle (ISP)

> **Section 05 — SOLID** · the **I** · Code: [C++](C++%20Code/) · [Java](Java%20Code/)

> *"No client should be forced to depend on methods it does not use."* Prefer many small, focused interfaces over one fat one.

| C++ | Java | Shows |
|---|---|---|
| `violates-isp.cpp` | `ViolatesISP.java` | one fat `IMultiFunctionDevice` (print+scan+fax) |
| `follows-isp.cpp` | `FollowsISP.java` | three small interfaces `Printer` / `Scanner` / `Fax` |

---

## The smell

One fat `IMultiFunctionDevice` declares `print` + `scan` + `fax`. A `SimplePrinter` is forced to implement `scan()`/`fax()` it doesn't have — so it throws. Callers can no longer trust the type.

## The fix

Three small interfaces — `Printer`, `Scanner`, `Fax`. A basic printer implements only `Printer`; an all-in-one composes all three. Each client function asks for exactly the capability it needs.

> **ISP and LSP are cousins:** a fat interface *forces* classes to fake methods (an LSP violation). Slim, role-based interfaces remove the temptation entirely — the same idea behind the `Withdrawable` fix in LSP.

## How to run

**C++**
```powershell
cd "05 - SOLID Principles/Interface Segregation Principle/C++ Code"
g++ -std=c++14 violates-isp.cpp -o violates.exe ; .\violates.exe
g++ -std=c++14 follows-isp.cpp  -o follows.exe  ; .\follows.exe
```
**Java**
```powershell
cd "05 - SOLID Principles/Interface Segregation Principle/Java Code"
javac ViolatesISP.java ; java ViolatesISP
javac FollowsISP.java  ; java FollowsISP
```

### Expected output (`follows`)
```
  [print] invoice.pdf
  [print] contract.pdf
  [scan]  id-proof.jpg
```
