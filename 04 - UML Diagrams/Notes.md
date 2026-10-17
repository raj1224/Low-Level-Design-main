# 04 — UML Diagrams

UML (Unified Modeling Language) is how engineers **draw a design before (and while) coding it**. In LLD you mainly need three diagrams:

1. **Class diagram** — the static structure: classes and how they relate. (Most important.)
2. **Sequence diagram** — the dynamic flow: which object calls which, in what order.
3. **State diagram** — the lifecycle: the states an object moves through.

---

## Part A — Class diagrams

### A class

A class box has three compartments: **name**, **attributes**, **operations**. Visibility markers:

| Symbol | Meaning |
|---|---|
| `+` | public |
| `-` | private |
| `#` | protected |
| `~` | package / internal |

```mermaid
classDiagram
    class BankAccount {
        -string owner
        -long balancePaise
        +deposit(paise) void
        +withdraw(paise) void
        +balanceRupees() double
    }
```

An **interface** (abstract type) is marked with the `<<interface>>` stereotype:

```mermaid
classDiagram
    class PaymentMethod {
        <<interface>>
        +pay(amount) bool
        +name() string
    }
```

### The six relationships (know these cold)

This is the heart of reading/writing class diagrams. Each has a distinct arrow:

| Relationship | Reads as | Mermaid arrow | Ownership / strength |
|---|---|---|---|
| **Inheritance** (generalization) | "is-a" | `Base <|-- Derived` | solid line, hollow triangle |
| **Realization** (implements) | "implements interface" | `Iface <|.. Impl` | dashed line, hollow triangle |
| **Composition** | "owns / part-of (dies with)" | `Whole *-- Part` | strong — part can't outlive whole |
| **Aggregation** | "has-a (shared)" | `Whole o-- Part` | weak — part lives independently |
| **Association** | "knows / uses long-term" | `A --> B` | a persistent link/reference |
| **Dependency** | "uses temporarily" | `A ..> B` | transient (a parameter, a local) |

```mermaid
classDiagram
    direction LR
    class Vehicle
    class Car
    Vehicle <|-- Car : inheritance (is-a)

    class Repository {
        <<interface>>
    }
    class SqlRepository
    Repository <|.. SqlRepository : realization (implements)

    class House
    class Room
    House *-- Room : composition (room dies with house)

    class Team
    class Player
    Team o-- Player : aggregation (player outlives team)

    class Order
    class Customer
    Order --> Customer : association (order knows its customer)

    class OrderService
    class EmailSender
    OrderService ..> EmailSender : dependency (uses to send a receipt)
```

**Composition vs Aggregation — the one that trips everyone up:**
- **Composition** (`*--`): the part is *owned*; when the whole is destroyed, the part is too. A `Room` has no meaning without its `House`. In C++ this is usually a **by-value member** or a `unique_ptr`.
- **Aggregation** (`o--`): the part is *referenced* but lives on its own. A `Player` exists before and after being on a `Team`. In C++ this is usually a **raw pointer / reference / `shared_ptr`** to something owned elsewhere.

### Multiplicity

Numbers on the ends say *how many*:

| Notation | Meaning |
|---|---|
| `1` | exactly one |
| `0..1` | zero or one (optional) |
| `*` or `0..*` | zero or more |
| `1..*` | one or more |

```mermaid
classDiagram
    Customer "1" --> "0..*" Order : places
    Order "1" *-- "1..*" OrderLine : contains
    Order "*" --> "1" Address : ships to
```

Read it as: *one Customer places zero-or-more Orders; each Order is composed of one-or-more OrderLines; many Orders ship to one Address.*

---

## Part B — Sequence diagrams

A sequence diagram shows **objects talking over time**. Time flows **downward**; each participant has a vertical **lifeline**; arrows are **messages**.

| Element | Mermaid | Meaning |
|---|---|---|
| Synchronous call | `A->>B: method()` | A calls B and waits |
| Return | `B-->>A: result` | B returns to A (dashed) |
| Self-call | `A->>A: helper()` | object calls itself |
| Activation bar | `activate B` / `deactivate B` | B is doing work |
| Alternative | `alt / else / end` | a branch (if/else) |
| Loop | `loop ... end` | repetition |

Here's *"a user books a movie seat"* — the exact flow you'll implement in the BookMyShow system (section 07):

```mermaid
sequenceDiagram
    actor User
    participant C as BookingController
    participant S as ShowService
    participant L as SeatLockManager
    participant P as PaymentService

    User->>C: bookSeat(showId, seatId)
    activate C
    C->>S: getSeat(showId, seatId)
    S-->>C: seat (AVAILABLE)
    C->>L: tryLock(showId, seatId, userId)
    alt seat free
        L-->>C: locked
        C->>P: charge(user, amount)
        alt payment ok
            P-->>C: success
            C->>S: confirm(seatId)
            C-->>User: Booking CONFIRMED
        else payment failed
            P-->>C: failure
            C->>L: release(seatId)
            C-->>User: Payment failed, seat released
        end
    else already locked
        L-->>C: lock denied
        C-->>User: Seat unavailable
    end
    deactivate C
```

Notice how the diagram makes the **edge cases explicit** (seat already locked, payment failure → release the lock). That's the real value: a sequence diagram forces you to think through failure paths *before* you write the bug.

---

## Part C — State diagrams

A state diagram shows the **lifecycle** of one object: the states it can be in and the events that move it between them. This maps directly onto the **State pattern** (section 06).

An **Order's** lifecycle:

```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Paid: payment success
    Created --> Cancelled: user cancels / payment fails
    Paid --> Shipped: dispatch
    Shipped --> Delivered: courier delivers
    Delivered --> [*]
    Paid --> Refunded: return approved
    Cancelled --> [*]
    Refunded --> [*]
```

If you can draw this, you can implement it: each state becomes a class, each arrow becomes a method that returns the next state. Illegal transitions (e.g. `Delivered → Created`) simply don't exist — the diagram *is* the spec.

---

## Part D — A worked domain (putting it together)

Designing the **movie-booking** domain produces all three diagrams from the same nouns and verbs:

```mermaid
classDiagram
    class Movie {
        +string title
        +int durationMins
    }
    class Theatre {
        +string name
        +addScreen(Screen) void
    }
    class Screen {
        +int number
    }
    class Show {
        +DateTime startTime
        +seatsFor() List~Seat~
    }
    class Seat {
        +string id
        +SeatType type
        +SeatState state
    }
    class Booking {
        +confirm() void
    }
    class User {
        +string name
    }

    Theatre "1" *-- "1..*" Screen : has
    Screen "1" --> "0..*" Show : schedules
    Show "1" --> "1" Movie : plays
    Show "1" *-- "1..*" Seat : contains
    User "1" --> "0..*" Booking : makes
    Booking "1" --> "1..*" Seat : reserves
```

From these **nouns** (`Movie`, `Show`, `Seat`, `Booking`) you get the class diagram; from the **verb** "book a seat" you get the sequence diagram (Part B); from the **seat's lifecycle** (`Available → Locked → Booked`) you get a state diagram. This is the standard recipe:

> **Recipe:** nouns → classes/attributes; verbs → methods & sequence flows; lifecycles → state diagrams.

---

## A note on the other UML diagrams

UML has ~14 diagram types. For LLD you rarely need more than the three above, but you should *recognize* these:

- **Use-case diagram** — actors and the goals they pursue (very high level).
- **Activity diagram** — a flowchart of a process (like a sequence diagram but workflow-focused).
- **Component / Deployment diagram** — these are **HLD** tools (services, servers).

If an interviewer says "draw the design," they almost always mean a **class diagram** plus maybe **one sequence diagram** for the trickiest flow. That's what the rest of this course uses everywhere.

---

## Key takeaways

- **Class diagram** = static structure; master the **six relationships** and **multiplicity**.
- **Composition (`*--`, owned, dies-with) vs Aggregation (`o--`, shared, lives-on)** is the most-tested distinction.
- **Sequence diagram** = the dynamic call flow; use it to surface **edge/failure cases** early.
- **State diagram** = an object's lifecycle; it translates 1:1 into the **State pattern**.
- Keep diagrams in **Mermaid**, in the repo, next to the code, so they never rot.

➡️ Next: **[05 — SOLID Principles]**
