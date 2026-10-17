# Low-Level Design (LLD) — A Complete, Hands-On Course

A from-scratch course on **Low-Level Design**, taught through **real-world systems** (not `Animal → Dog → Cat` toys). Every concept is shown in **three languages so the design — not the syntax — is the lesson**:

- **C++** and **Java** for the foundations, SOLID, design patterns and the giant-system LLDs (sections 1–7).
- **Node.js** for the same giant systems re-built on a JavaScript stack (section 8) and for design patterns inside real projects (section 9).

Every chapter ships **runnable, verified code** plus a **`Notes.md`** with the theory and **Mermaid** class/sequence/state diagrams that render right inside VS Code and GitHub.

> **Why three languages?** Your job's stack might be C++, Java, *or* Node. LLD — SOLID, patterns, how you decompose a system — is the **same** everywhere; only the syntax changes. Sections 8–9 prove it by re-implementing the same designs in Node.

---

## Syllabus

| # | Section | What you'll learn | Code |
|---|---------|-------------------|------|
| 01 | [What is LLD?](01%20-%20What%20is%20LLD/Notes.md) | LLD vs HLD, what an LLD deliverable is | — |
| 02 | [Why LLD? (life without it)](02%20-%20Why%20LLD/Notes.md) | The "build WhatsApp with no design" horror story | — |
| 03 | [OOP Fundamentals](03%20-%20OOP%20Fundamentals/Notes.md) | The 4 pillars, with runnable demos | C++ · Java |
| 04 | [UML Diagrams](04%20-%20UML%20Diagrams/Notes.md) | Class, sequence & state diagrams (Mermaid) | — |
| 05 | [SOLID Principles](05%20-%20SOLID%20Principles/Notes.md) | Each principle as **violated → fixed** | C++ · Java |
| 06 | [Design Patterns](06%20-%20Design%20Patterns/Notes.md) | The 23 GoF patterns, one canonical example each | C++ · Java |
| 07 | [LLD of Giant Systems](07%20-%20LLD%20of%20Giant%20Systems/Notes.md) | Full multi-file designs (Swiggy, BookMyShow, Uber…) + interview classics | C++ · Java |
| 08 | [Giant Systems in Node.js](08%20-%20Giant%20Systems%20in%20Node.js/Notes.md) | The section-07 systems re-built on a Node stack | Node.js |
| 09 | [Design Patterns in Real Projects](09%20-%20Design%20Patterns%20in%20Real%20Projects/Notes.md) | Each pattern applied to a production-flavoured Node project | Node.js |

**Recommended path:** top to bottom. Each section assumes the previous ones.

---

## Folder structure

Every chapter in sections **1–7** has the same shape:

```
<NN - Section>/<Chapter>/
├── C++ Code/      # the chapter in C++   (g++ -std=c++14)
├── Java Code/     # the same design in Java (javac / java)
└── Notes.md       # theory + Mermaid diagrams + how to run
```

- **SOLID** chapters carry **two** programs per language — one that *violates* the principle and one that *follows* it (`violates-*.cpp` / `follows-*.cpp`).
- **Giant systems** are multi-file: C++ headers `#include`-d into one `main.cpp`; Java as one class per file with a `Main.java`.
- **Sections 8 & 9** contain **Node.js only** (`src/` + `Notes.md`) — that's the whole point of those sections.
- Theory-only sections (01, 02, 04) are just a `Notes.md`.

> **Note on folder names:** they contain spaces (and `C++ Code` contains a `+`). In a terminal, **quote the path** — every command below already does.

---

## Toolchain

This course is verified against:

| Tool | Version | Install |
|------|---------|---------|
| **g++** | MinGW GCC **6.3.0** (compiled with `-std=c++14`) | [MSYS2](https://www.msys2.org/) / [MinGW-w64](https://www.mingw-w64.org/) |
| **JDK** | Eclipse Temurin **21** | `winget install EclipseAdoptium.Temurin.21.JDK` |
| **Node.js** | **v22** (pure CommonJS, zero dependencies) | [nodejs.org](https://nodejs.org/) |

```powershell
g++ --version ; javac -version ; node --version
```

> **Why C++14?** The repo is pinned to a real, older toolchain (MinGW 6.3) so *every* example compiles on a typical student machine. Newer compilers work too — keep the `-std=c++14` flag.

---

## How to run the code

**C++ — a single-file chapter** (sections 3, 5, 6)
```powershell
cd "06 - Design Patterns/Behavioral/Strategy/C++ Code"
g++ -std=c++14 example.cpp -o example.exe ; .\example.exe
```

**C++ — a multi-file system** (section 7; `main.cpp` includes the headers)
```powershell
cd "07 - LLD of Giant Systems/Interview Classics/Parking Lot/C++ Code"
g++ -std=c++14 main.cpp -o app.exe ; .\app.exe
```

**Java** (compile everything in the folder, run the class with `main`)
```powershell
cd "07 - LLD of Giant Systems/Interview Classics/Parking Lot/Java Code"
javac *.java ; java Main
```
> SOLID chapters: run each program separately, e.g. `javac ViolatesSRP.java ; java ViolatesSRP`.

**Node.js** (sections 8 & 9; zero dependencies)
```powershell
cd "09 - Design Patterns in Real Projects/Adapter - Payment Gateways"
node src/index.js
```

There is **no build system to install** — no CMake, no npm packages. Just `g++`, `javac`, and `node`.

---

## Conventions

- **C++**: a deliberately beginner-friendly teaching style — `using namespace std;`, `this->` in constructors, generous real-world comments, abstract methods via `= 0`, a `virtual` destructor on every base class. Small demos use raw `new`/`delete` so memory is visible; the larger systems in section 07 use **smart pointers** (`unique_ptr`/`shared_ptr`) for safety.
- **Java**: one public class per file, standard naming, mirroring the C++ design class-for-class.
- **Node.js**: ES6 classes, `require`/`module.exports`, JSDoc, a demo guarded by `if (require.main === module)`.
- **Diagrams**: [Mermaid](https://mermaid.js.org/) in `Notes.md`. Install *Markdown Preview Mermaid Support* in VS Code if a preview shows raw text.
- **Output across languages**: where C++ prints a whole `double` as `799`, Java prints `799.0` — a display difference only, not a logic one. The designs and the meaningful output are identical.

Happy designing. Start with **[01 — What is LLD?](01%20-%20What%20is%20LLD/Notes.md)**.
