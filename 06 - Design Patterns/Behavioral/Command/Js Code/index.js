
// =============================================================================
// COMMAND — encapsulate a request as an object. This lets you parameterize an
// invoker with different requests, queue or log them, and support UNDO.
//
// Domain: a smart-home remote. Pressing a button executes a Command (turn the
// light on, set the fan speed). Because each action is an object that knows how
// to execute() AND undo() itself, the remote gets undo for free.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Receivers: the objects that do the real work ----------
class Light {
    constructor() {
        this.on = false;
    }

    turnOn() {
        this.on = true;
        console.log("  light ON");
    }

    turnOff() {
        this.on = false;
        console.log("  light OFF");
    }

    isOn() {
        return this.on;
    }
}

class Fan {
    constructor() {
        this.speedValue = 0;
    }

    setSpeed(s) {
        this.speedValue = s;
        console.log(`  fan speed = ${s}`);
    }

    speed() {
        return this.speedValue;
    }
}

// ---------- Command interface ----------
class Command {
    execute() {
        throw new Error("execute() must be implemented");
    }

    undo() {
        throw new Error("undo() must be implemented");
    }
}

// ---------- Concrete commands: bind a receiver + remember how to reverse ----------
class LightOnCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
        this.prev = false;
    }

    execute() {
        this.prev = this.light.isOn();
        this.light.turnOn();
    }

    undo() {
        if (this.prev) {
            this.light.turnOn();
        } else {
            this.light.turnOff();
        }
    }
}

class FanSpeedCommand extends Command {
    constructor(fan, speed) {
        super();
        this.fan = fan;
        this.speed = speed;
        this.prev = 0;
    }

    execute() {
        this.prev = this.fan.speed();
        this.fan.setSpeed(this.speed);
    }

    undo() {
        this.fan.setSpeed(this.prev);
    }
}

// ---------- Invoker: triggers commands and keeps an undo history ----------
class RemoteControl {
    constructor() {
        this.history = [];
    }

    press(cmd) {
        cmd.execute();
        this.history.push(cmd); // remember for undo
    }

    undoLast() {
        if (this.history.length === 0) {
            console.log("  nothing to undo");
            return;
        }

        console.log("  [undo]");
        const cmd = this.history.pop();
        cmd.undo();
    }
}

function main() {
    const light = new Light();
    const fan = new Fan();
    const remote = new RemoteControl();

    remote.press(new LightOnCommand(light));
    remote.press(new FanSpeedCommand(fan, 3));
    remote.press(new FanSpeedCommand(fan, 5));

    console.log("Undo twice:");
    remote.undoLast(); // fan 5 -> 3
    remote.undoLast(); // fan 3 -> 0
}

main();
