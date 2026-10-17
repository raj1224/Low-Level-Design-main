
/*
============================================================
04 — UML DIAGRAMS
============================================================

UML (Unified Modeling Language) is how engineers draw a
design before (and while) coding it.

In LLD, you mainly need three diagrams:

1. Class diagram
   - Static structure: classes and how they relate.
   - Most important.

2. Sequence diagram
   - Dynamic flow: which object calls which, in what order.

3. State diagram
   - Lifecycle: the states an object moves through.



/*
------------------------------------------------------------
PART A — CLASS DIAGRAMS
------------------------------------------------------------

A class box has three compartments:

1. Name
2. Attributes
3. Operations

Visibility markers:

+  = public
-  = private
#  = protected
~  = package / internal
*/


// Mermaid class diagram:
//
// classDiagram
//     class BankAccount {
//         -string owner
//         -long balancePaise
//         +deposit(paise) void
//         +withdraw(paise) void
//         +balanceRupees() double
//     }


/*
An interface (abstract type) is marked with the
<<interface>> stereotype.
*/


// Mermaid interface diagram:
//
// classDiagram
//     class PaymentMethod {
//         <<interface>>
//         +pay(amount) bool
//         +name() string
//     }


/*
------------------------------------------------------------
THE SIX RELATIONSHIPS
------------------------------------------------------------

This is the heart of reading/writing class diagrams.
Each relationship has a distinct arrow.

1. Inheritance (generalization)
   Reads as: "is-a"
   Mermaid: Base <|-- Derived
   Solid line, hollow triangle.

2. Realization (implements)
   Reads as: "implements interface"
   Mermaid: Iface <|.. Impl
   Dashed line, hollow triangle.

3. Composition
   Reads as: "owns / part-of (dies with)"
   Mermaid: Whole *-- Part
   Strong ownership: the part can't outlive the whole.

4. Aggregation
   Reads as: "has-a (shared)"
   Mermaid: Whole o-- Part
   Weak ownership: the part lives independently.

5. Association
   Reads as: "knows / uses long-term"
   Mermaid: A --> B
   A persistent link/reference.

6. Dependency
   Reads as: "uses temporarily"
   Mermaid: A ..> B
   Transient use, such as a parameter or local variable.
*/


// Mermaid diagram showing all six relationships:
//
// classDiagram
//     direction LR
//
//     class Vehicle
//     class Car
//     Vehicle <|-- Car : inheritance (is-a)
//
//     class Repository {
//         <<interface>>
//     }
//     class SqlRepository
//     Repository <|.. SqlRepository : realization (implements)
//
//     class House
//     class Room
//     House *-- Room : composition (room dies with house)
//
//     class Team
//     class Player
//     Team o-- Player : aggregation (player outlives team)
//
//     class Order
//     class Customer
//     Order --> Customer : association (order knows its customer)
//
//     class OrderService
//     class EmailSender
//     OrderService ..> EmailSender : dependency (uses to send a receipt)


/*
------------------------------------------------------------
COMPOSITION VS AGGREGATION
------------------------------------------------------------

This is the one that trips everyone up.

COMPOSITION (*--)
- The part is owned by the whole.
- When the whole is destroyed, the part is destroyed too.
- A Room has no meaning without its House.
- In C++, this is usually a by-value member or unique_ptr.

AGGREGATION (o--)
- The part is referenced but lives on its own.
- A Player exists before and after being on a Team.
- In C++, this is usually a raw pointer, reference, or
  shared_ptr to something owned elsewhere.

JavaScript note:
JavaScript does not have C++-style pointer ownership
or deterministic object destruction.

Composition and aggregation in JavaScript are therefore
usually represented by object references and ownership
conventions in the design.
*/


// Composition example: House owns its rooms.
class Room {
    constructor(name) {
        this.name = name;
    }
}

class House {
    constructor() {
        // These rooms are created and owned by this House.
        this.rooms = [
            new Room("Bedroom"),
            new Room("Kitchen"),
        ];
    }

    showRooms() {
        this.rooms.forEach((room) => {
            console.log(room.name);
        });
    }
}

const house = new House();
house.showRooms();

// Output:
// Bedroom
// Kitchen


// Aggregation example: Players can exist independently
// of a Team and can be shared between different contexts.
class Player {
    constructor(name) {
        this.name = name;
    }
}

class Team {
    constructor(name, players = []) {
        this.name = name;

        // Team references players; it does not create them.
        this.players = players;
    }

    showPlayers() {
        console.log(
            `${this.name}:`,
            this.players.map((player) => player.name)
        );
    }
}

const player1 = new Player("Aman");
const player2 = new Player("Rahul");

const team = new Team("Team A", [player1, player2]);
team.showPlayers();

// Output:
// Team A: [ 'Aman', 'Rahul' ]

// player1 and player2 also exist independently of the Team.


/*
------------------------------------------------------------
MULTIPLICITY
------------------------------------------------------------

Numbers on the ends of relationships say "how many?"

1       = exactly one
0..1    = zero or one (optional)
*       = zero or more
0..*    = zero or more
1..*    = one or more
*/


// Mermaid multiplicity diagram:
//
// classDiagram
//     Customer "1" --> "0..*" Order : places
//     Order "1" *-- "1..*" OrderLine : contains
//     Order "*" --> "1" Address : ships to


/*
Read it as:

- One Customer places zero or more Orders.
- Each Order is composed of one or more OrderLines.
- Many Orders ship to one Address.
*/


/*
------------------------------------------------------------
PART B — SEQUENCE DIAGRAMS
------------------------------------------------------------

A sequence diagram shows objects talking over time.

- Time flows downward.
- Each participant has a vertical lifeline.
- Arrows represent messages.

Elements:

1. Synchronous call
   Mermaid: A->>B: method()
   Meaning: A calls B and waits.

2. Return
   Mermaid: B-->>A: result
   Meaning: B returns to A (dashed arrow).

3. Self-call
   Mermaid: A->>A: helper()
   Meaning: an object calls itself.

4. Activation bar
   Mermaid: activate B / deactivate B
   Meaning: B is doing work.

5. Alternative
   Mermaid: alt / else / end
   Meaning: a branch, such as if/else.

6. Loop
   Mermaid: loop ... end
   Meaning: repetition.
*/


/*
EXAMPLE: A USER BOOKS A MOVIE SEAT

This is the exact flow you'll implement in the
BookMyShow system (section 07).
*/


// Mermaid sequence diagram:
//
// sequenceDiagram
//     actor User
//     participant C as BookingController
//     participant S as ShowService
//     participant L as SeatLockManager
//     participant P as PaymentService
//
//     User->>C: bookSeat(showId, seatId)
//     activate C
//     C->>S: getSeat(showId, seatId)
//     S-->>C: seat (AVAILABLE)
//     C->>L: tryLock(showId, seatId, userId)
//
//     alt seat free
//         L-->>C: locked
//         C->>P: charge(user, amount)
//
//         alt payment ok
//             P-->>C: success
//             C->>S: confirm(seatId)
//             C-->>User: Booking CONFIRMED
//         else payment failed
//             P-->>C: failure
//             C->>L: release(seatId)
//             C-->>User: Payment failed, seat released
//         end
//
//     else already locked
//         L-->>C: lock denied
//         C-->>User: Seat unavailable
//     end
//
//     deactivate C


/*
Notice how the diagram makes the edge cases explicit:

1. Seat is already locked.
2. Payment fails.
3. Failed payment causes the seat lock to be released.

That's the real value: a sequence diagram forces you to
think through failure paths before you write the bug.
*/


/*
------------------------------------------------------------
A SIMPLIFIED JAVASCRIPT SEQUENCE-FLOW EXAMPLE
------------------------------------------------------------

This example demonstrates the same basic flow in code.

It is illustrative, not a production booking system.
Real booking systems also need database transactions,
concurrency protection, lock expiration, and idempotency.
*/


class ShowService {
    constructor() {
        this.seats = new Map([
            ["A1", "AVAILABLE"],
        ]);
    }

    getSeat(seatId) {
        return this.seats.get(seatId);
    }

    confirm(seatId) {
        this.seats.set(seatId, "BOOKED");
    }
}

class SeatLockManager {
    constructor() {
        this.lockedSeats = new Set();
    }

    tryLock(seatId, userId) {
        if (this.lockedSeats.has(seatId)) {
            return false;
        }

        this.lockedSeats.add(seatId);
        console.log(`${seatId} locked by ${userId}`);

        return true;
    }

    release(seatId) {
        this.lockedSeats.delete(seatId);
        console.log(`${seatId} lock released`);
    }
}

class PaymentService {
    constructor(paymentShouldSucceed = true) {
        this.paymentShouldSucceed = paymentShouldSucceed;
    }

    charge(user, amount) {
        console.log(`Charging ${user} Rs.${amount}`);

        if (this.paymentShouldSucceed) {
            return true;
        }

        return false;
    }
}

class BookingController {
    constructor(showService, lockManager, paymentService) {
        this.showService = showService;
        this.lockManager = lockManager;
        this.paymentService = paymentService;
    }

    bookSeat(showId, seatId, userId, amount) {
        console.log(`Booking show ${showId}, seat ${seatId}`);

        const seat = this.showService.getSeat(seatId);

        if (seat !== "AVAILABLE") {
            return "Seat unavailable";
        }

        const locked = this.lockManager.tryLock(seatId, userId);

        if (!locked) {
            return "Seat unavailable";
        }

        const paymentSuccessful = this.paymentService.charge(
            userId,
            amount
        );

        if (paymentSuccessful) {
            this.showService.confirm(seatId);
            return "Booking CONFIRMED";
        }

        this.lockManager.release(seatId);
        return "Payment failed, seat released";
    }
}


// Successful booking demo:
const showService = new ShowService();
const lockManager = new SeatLockManager();
const paymentService = new PaymentService(true);

const bookingController = new BookingController(
    showService,
    lockManager,
    paymentService
);

console.log(
    bookingController.bookSeat("SHOW1", "A1", "user123", 250)
);

// Expected result:
// Booking CONFIRMED


/*
------------------------------------------------------------
PART C — STATE DIAGRAMS
------------------------------------------------------------

A state diagram shows the lifecycle of one object:

- The states it can be in.
- The events that move it between states.

This maps directly onto the State pattern (section 06).

Example: an Order's lifecycle.
*/


// Mermaid state diagram:
//
// stateDiagram-v2
//     [*] --> Created
//     Created --> Paid: payment success
//     Created --> Cancelled: user cancels / payment fails
//     Paid --> Shipped: dispatch
//     Shipped --> Delivered: courier delivers
//     Delivered --> [*]
//     Paid --> Refunded: return approved
//     Cancelled --> [*]
//     Refunded --> [*]


/*
If you can draw this, you can implement it:

- Each state can become a class.
- Each arrow can become a method that returns the next state.
- Illegal transitions, such as Delivered -> Created,
  simply don't exist in the intended design.

The diagram is the specification.

Important:
A state diagram does not require every state to be
implemented as a separate class. That is one possible
implementation, especially when applying the State pattern.
*/


/*
------------------------------------------------------------
JAVASCRIPT EXAMPLE: ORDER LIFECYCLE
------------------------------------------------------------
*/


class Order {
    constructor() {
        this.state = "Created";
    }

    pay() {
        if (this.state !== "Created") {
            throw new Error(
                `Cannot pay for an order in state: ${this.state}`
            );
        }

        this.state = "Paid";
    }

    cancel() {
        if (this.state !== "Created") {
            throw new Error(
                `Cannot cancel an order in state: ${this.state}`
            );
        }

        this.state = "Cancelled";
    }

    ship() {
        if (this.state !== "Paid") {
            throw new Error(
                `Cannot ship an order in state: ${this.state}`
            );
        }

        this.state = "Shipped";
    }

    deliver() {
        if (this.state !== "Shipped") {
            throw new Error(
                `Cannot deliver an order in state: ${this.state}`
            );
        }

        this.state = "Delivered";
    }

    refund() {
        if (this.state !== "Paid") {
            throw new Error(
                `Cannot refund an order in state: ${this.state}`
            );
        }

        this.state = "Refunded";
    }
}


// Demo:
const order = new Order();

console.log(order.state); // Created

order.pay();
console.log(order.state); // Paid

order.ship();
console.log(order.state); // Shipped

order.deliver();
console.log(order.state); // Delivered

// This is an illegal transition and will throw an error:
// order.pay();


/*
------------------------------------------------------------
PART D — A WORKED DOMAIN: MOVIE BOOKING
------------------------------------------------------------

Designing the movie-booking domain produces all three
diagrams from the same nouns and verbs.
*/


// Mermaid class diagram:
//
// classDiagram
//     class Movie {
//         +string title
//         +int durationMins
//     }
//
//     class Theatre {
//         +string name
//         +addScreen(Screen) void
//     }
//
//     class Screen {
//         +int number
//     }
//
//     class Show {
//         +DateTime startTime
//         +seatsFor() List~Seat~
//     }
//
//     class Seat {
//         +string id
//         +SeatType type
//         +SeatState state
//     }
//
//     class Booking {
//         +confirm() void
//     }
//
//     class User {
//         +string name
//     }
//
//     Theatre "1" *-- "1..*" Screen : has
//     Screen "1" --> "0..*" Show : schedules
//     Show "1" --> "1" Movie : plays
//     Show "1" *-- "1..*" Seat : contains
//     User "1" --> "0..*" Booking : makes
//     Booking "1" --> "1..*" Seat : reserves


/*
From these nouns, you get the class diagram:

- Movie
- Show
- Seat
- Booking
- Theatre
- Screen
- User

From the verb "book a seat", you get the sequence
diagram (Part B).

From the seat's lifecycle:

Available -> Locked -> Booked

you get a state diagram.

STANDARD RECIPE:

Nouns       -> Classes and attributes
Verbs       -> Methods and sequence flows
Lifecycles  -> State diagrams
*/


/*
------------------------------------------------------------
A NOTE ON THE OTHER UML DIAGRAMS
------------------------------------------------------------

UML has approximately 14 diagram types.

For LLD, you rarely need more than the three above,
but you should recognize these:

1. Use-case diagram
   - Actors and the goals they pursue.
   - Very high level.

2. Activity diagram
   - A flowchart of a process.
   - Similar to a sequence diagram but workflow-focused.

3. Component / Deployment diagram
   - HLD tools.
   - Services and servers.

If an interviewer says "draw the design", they almost
always mean a class diagram plus maybe one sequence
diagram for the trickiest flow.

That's what the rest of this course uses everywhere.
*/


/*
============================================================
KEY TAKEAWAYS
============================================================

1. CLASS DIAGRAM
   - Static structure.
   - Master the six relationships and multiplicity.

2. COMPOSITION VS AGGREGATION
   - Composition (*--): owned, dies with the whole.
   - Aggregation (o--): shared, lives independently.
   - This is the most-tested distinction.

3. SEQUENCE DIAGRAM
   - Dynamic call flow.
   - Use it to surface edge/failure cases early.

4. STATE DIAGRAM
   - An object's lifecycle.
   - It can translate into the State pattern.

5. KEEP DIAGRAMS IN MERMAID
   - Store them in the repository, next to the code,
     so they never rot.

============================================================
NEXT: 05 — SOLID PRINCIPLES
============================================================
*/
