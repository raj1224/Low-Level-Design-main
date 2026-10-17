
/*
============================================================
01 — WHAT IS LOW-LEVEL DESIGN (LLD)?
============================================================

In one line:

LLD is the blueprint of how the classes, objects, and their
interactions inside a single service/module are organized
so the code is correct, readable, extensible, and testable.
*/

/*
------------------------------------------------------------
1. THE 10,000-FT VIEW: WHERE LLD SITS
------------------------------------------------------------

When you build software, design happens at two altitudes:

High-Level Design (HLD) — the "what & where"
- Which services exist?
- Databases, caches, and queues
- APIs between services
- Scaling, sharding, and load balancing

Low-Level Design (LLD) — the "how" inside one service
- Classes and interfaces
- Relationships and responsibilities
- Design patterns
- Method contracts and data structures

HLD -> LLD -> Actual code

HLD answers:
"What are the moving boxes and how do they talk?"

LLD answers:
"How is the code inside organized?"

Analogy:
HLD is the city plan: where the hospital, power station,
and roads go.

LLD is the architectural blueprint of one building:
where the rooms, doors, plumbing, and load-bearing walls go.

You need both, but they are different drawings at
different zoom levels.
*/


// Mermaid diagram from the lesson:
//
// flowchart TB
//     subgraph HLD["High-Level Design (HLD) — the 'what & where'"]
//         A1[Which services exist?] --- A2[Databases, caches, queues]
//         A2 --- A3[APIs between services]
//         A3 --- A4[Scaling, sharding, load balancing]
//     end
//
//     subgraph LLD["Low-Level Design (LLD) — the 'how' inside one service"]
//         B1[Classes & interfaces] --- B2[Relationships & responsibilities]
//         B2 --- B3[Design patterns] --- B4[Method contracts & data structures]
//     end
//
//     HLD --> LLD
//     LLD --> CODE[Actual code]


/*
------------------------------------------------------------
2. HLD VS LLD, SIDE BY SIDE
------------------------------------------------------------

Aspect                  High-Level Design       Low-Level Design
-----------------------------------------------------------------
Scope                   Whole system            One service/module
Vocabulary              Services, DB, cache     Classes, interfaces,
                        queue, CDN, LB           objects, methods, patterns
Key question            Will it scale and       Will the code stay
                        stay available?          clean and extensible?
Typical diagram         Architecture/deployment  Class/sequence diagrams
Failure looks like      Outages, latency,       Spaghetti code,
                        data loss                ripple bugs
Interview format        "Design Instagram"      "Design a parking lot"

Both matter.
This course is entirely about Low-Level Design.
*/


/*
------------------------------------------------------------
3. WHAT IS IN AN LLD DELIVERABLE?
------------------------------------------------------------

When someone says "give me the LLD", they expect some
subset of the following:

1. A class model
   - Classes and interfaces
   - Fields and methods
   - Inheritance, composition, and association
   - Usually a UML class diagram

2. Interaction flows
   - How objects collaborate to satisfy a use case
   - Usually a UML sequence diagram
   - Example: user books a seat -> which objects call
     which methods, and in what order?

3. Responsibilities and contracts
   - What each class is responsible for
   - What each class is NOT responsible for
   - Preconditions and postconditions of key methods

4. Applied design patterns
   - Strategy for pricing
   - Observer for notifications
   - State for the booking lifecycle
   - Include the reasoning behind the choice

5. Key data structures and algorithms
   - Example: seats are stored in a
     HashMap<SeatId, SeatState>
   - Lock a seat with compare-and-set to avoid double-booking

6. Extensibility notes
   - Example: to add a new payment method, implement
     PaymentStrategy; nothing else changes.

You do not always produce all six formally,
but a good engineer can produce any of them on demand.
*/


/*
------------------------------------------------------------
4. WHAT DOES GOOD LLD OPTIMIZE FOR?
------------------------------------------------------------

LLD is the craft of arranging code so that these
properties hold:

1. Correctness
   - Does the right thing, including edge cases.
   - Examples: double-booking, payment failure,
     concurrent access.

2. Readability
   - A new teammate understands a class without
     reading the entire codebase.

3. Maintainability
   - A bug fix touches one place, not twenty.

4. Extensibility
   - New features can be added without rewriting
     existing code.
   - This relates to the Open/Closed Principle,
     covered in section 05.

5. Testability
   - You can unit-test a class in isolation because
     dependencies are injected instead of hard-wired.

6. Reusability
   - Well-separated pieces get reused instead
     of being copy-pasted.

Notice that none of these is "runs fast" or
"scales to a billion users".

Those are HLD/performance concerns.

LLD is about the health of the code itself.
*/


/*
------------------------------------------------------------
5. THE MENTAL MODEL THIS COURSE BUILDS
------------------------------------------------------------

Everything downstream is a tool in service of
the properties above.

OOP -> SOLID -> Design Patterns -> Real Systems

UML diagrams communicate the design across these stages.

1. OOP
   Gives you the raw materials:
   encapsulation, abstraction, inheritance, polymorphism.

2. SOLID
   Gives you the principles for arranging those
   materials well.

3. Design patterns
   Named, reusable solutions to recurring problems,
   built on OOP + SOLID.

4. UML
   Helps communicate the design before or while coding.

5. Real systems
   Combine all of the above under real requirements.
*/


// Mermaid diagram from the lesson:
//
// flowchart LR
//     OOP[OOP pillars] --> SOLID[SOLID principles]
//     SOLID --> DP[Design patterns]
//     DP --> SYS[Real systems]
//     UML[UML diagrams] -.communicates.-> OOP
//     UML -.communicates.-> DP
//     UML -.communicates.-> SYS


/*
------------------------------------------------------------
6. A TINY TASTE: RIDE PRICING
------------------------------------------------------------

Suppose you are asked to compute the price of a ride.

A first instinct might be to write a function with
if/else conditions for every ride type.

The original C++ example:

double price(string type) {
    if (type == "normal") return base();
    else if (type == "premium") return base() * 1.5;
    else if (type == "pool")   return base() * 0.8;
    // ... every new ride type edits this function forever
}

JavaScript equivalent:
*/


function base() {
    return 100;
}

function price(type) {
    if (type === "normal") {
        return base();
    } else if (type === "premium") {
        return base() * 1.5;
    } else if (type === "pool") {
        return base() * 0.8;
    }

    // ... every new ride type edits this function forever
    throw new Error(`Unknown ride type: ${type}`);
}


// Example usage:
console.log(price("normal"));  // 100
console.log(price("premium")); // 150
console.log(price("pool"));    // 80


/*
LLD says:

That if/else will grow without bound, and every edit
risks breaking the other ride types.

The Strategy pattern replaces it with one small class
per ride type.

Adding a new type then means adding a class,
without changing the existing pricing logic.

You will learn exactly how and when in section 06.

But that instinct — "this if/else is a design smell" —
IS low-level design thinking.
*/


/*
------------------------------------------------------------
7. WHEN DO YOU ACTUALLY DO LLD?
------------------------------------------------------------

1. Before coding a non-trivial feature
   - Sketch the classes and one sequence diagram first.

2. In code review
   - Example: "This class is doing three jobs; split it."

3. In interviews
   - The machine-coding/LLD round asks you to design
     and often code a system in 60–90 minutes.
   - Examples: parking lot, Splitwise, BookMyShow.

4. Continuously
   - Every time you choose where a method belongs,
     you are doing LLD.
*/


/*
============================================================
KEY TAKEAWAYS
============================================================

1. LLD = how the code inside one service/module is structured.
   HLD = how services fit together at scale.

2. Good LLD optimizes for:
   - Correctness
   - Readability
   - Maintainability
   - Extensibility
   - Testability
   - Reusability

   It does not primarily optimize for raw speed.

3. The toolchain is:

   OOP -> SOLID -> Design Patterns

   Communicated with UML and proven on real systems.

============================================================
NEXT:
02 — Why LLD? (and what happens without it)
============================================================
*/
