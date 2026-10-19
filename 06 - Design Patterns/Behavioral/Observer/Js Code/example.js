
// =============================================================================
// OBSERVER — define a one-to-many dependency so that when one object (the
// subject) changes state, all its dependents (observers) are notified
// automatically. The subject doesn't know the concrete observer types.
//
// Domain: a weather station. When a new reading arrives, every attached display
// (phone app, window dashboard) updates itself. Adding a display = adding an
// observer; the station code never changes.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Observer interface ----------
class Observer {
    update(tempC, humidity) {
        throw new Error("update(tempC, humidity) must be implemented");
    }
}

// ---------- Subject: manages observers and notifies them ----------
class WeatherStation {
    constructor() {
        this.observers = [];
        this.tempC = 0;
        this.humidity = 0;
    }

    notifyAll() {
        for (let i = 0; i < this.observers.length; i++) {
            this.observers[i].update(this.tempC, this.humidity);
            // Dynamic polymorphism: each observer runs its own update()
        }
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        for (let i = 0; i < this.observers.length; i++) {
            if (this.observers[i] === observer) {
                this.observers.splice(i, 1);
                return;
            }
        }
    }

    setMeasurements(tempC, humidity) {
        this.tempC = tempC;
        this.humidity = humidity;
        this.notifyAll(); // push the change to everyone
    }
}

// ---------- Concrete observers ----------
class PhoneDisplay extends Observer {
    constructor(owner) {
        super();
        this.owner = owner;
    }

    update(tempC, humidity) {
        console.log(
            `  [${this.owner}'s phone] ${tempC}C, ${humidity}% humidity`
        );
    }
}

class WindowDashboard extends Observer {
    update(tempC, humidity) {
        console.log(
            `  [window dashboard] temp=${tempC}C` +
            (tempC > 35 ? "  (heat alert!)" : "")
        );
    }
}

function main() {
    const station = new WeatherStation();
    const phone = new PhoneDisplay("Aarav");
    const window = new WindowDashboard();

    station.subscribe(phone);
    station.subscribe(window);

    console.log("Reading 1:");
    station.setMeasurements(31.5, 60);

    console.log("Reading 2 (Aarav closed the app -> unsubscribed):");
    station.unsubscribe(phone);
    station.setMeasurements(37.0, 45);
}

main();
