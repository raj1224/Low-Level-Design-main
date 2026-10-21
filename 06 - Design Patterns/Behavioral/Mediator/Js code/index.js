
// =============================================================================
// MEDIATOR — define an object that centralizes how a set of objects interact.
// Instead of every object referencing every other (an n-to-n mess), they all
// talk to ONE mediator. This loosens coupling and puts coordination in one place.
//
// Domain: air-traffic control. Aircraft never talk to each other directly — they
// request actions via the control tower (mediator), which coordinates the single
// runway so two planes don't land at once.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Mediator interface ----------
class ControlTower {
    requestLanding(who) {
        throw new Error("requestLanding() must be implemented");
    }

    runwayCleared(who) {
        throw new Error("runwayCleared() must be implemented");
    }
}

// ---------- Colleague ----------
class Aircraft {
    constructor(id, tower) {
        this.id = id;
        this.tower = tower;
    }

    getId() {
        return this.id;
    }

    requestLanding() {
        console.log(`${this.id}: requesting permission to land`);
        this.tower.requestLanding(this); // talk to mediator, not other planes
    }

    leaveRunway() {
        console.log(`${this.id}: taxied off the runway`);
        this.tower.runwayCleared(this);
    }

    // Called by the mediator:
    land() {
        console.log(`  ${this.id}: CLEARED -> landing`);
    }

    hold() {
        console.log(`  ${this.id}: HOLD (runway busy)`);
    }
}

// ---------- Concrete mediator: owns the coordination logic ----------
class AirportControlTower extends ControlTower {
    constructor() {
        super();
        this.runwayBusy = false;
        this.queue = [];
    }

    requestLanding(who) {
        if (this.runwayBusy) {
            who.hold();
            this.queue.push(who); // serialize access to the runway
        } else {
            this.runwayBusy = true;
            who.land();
        }
    }

    runwayCleared(who) {
        this.runwayBusy = false;

        if (this.queue.length > 0) {
            const next = this.queue.shift();
            this.runwayBusy = true;
            next.land();
        }
    }
}

function main() {
    const tower = new AirportControlTower();

    const a = new Aircraft("AI-101", tower);
    const b = new Aircraft("MH-202", tower);
    const c = new Aircraft("UK-303", tower);

    a.requestLanding(); // runway free -> lands
    b.requestLanding(); // busy -> holds
    c.requestLanding(); // busy -> holds

    console.log("...time passes...");

    a.leaveRunway(); // frees runway -> next queued plane (b) lands
    b.leaveRunway(); // -> c lands
}

main();
