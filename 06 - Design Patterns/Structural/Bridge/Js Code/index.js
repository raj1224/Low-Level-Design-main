
// =============================================================================
// BRIDGE — decouple an abstraction from its implementation so the two can vary
// INDEPENDENTLY. You end up with two separate hierarchies connected by a
// "bridge" (a reference), instead of one exploding hierarchy.
//
// Domain: remote controls (the abstraction) operate devices (the implementation).
// Without Bridge you'd need BasicTVRemote, AdvancedTVRemote, BasicRadioRemote...
// (M x N classes). With Bridge: M remotes + N devices, combined at runtime.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Implementor: the "how" hierarchy ----------
class Device {
    setPower(on) {
        throw new Error("setPower() must be implemented");
    }

    setVolume(v) {
        throw new Error("setVolume() must be implemented");
    }

    volume() {
        throw new Error("volume() must be implemented");
    }

    isOn() {
        throw new Error("isOn() must be implemented");
    }

    name() {
        throw new Error("name() must be implemented");
    }
}

class Television extends Device {
    constructor() {
        super();
        this.on = false;
        this.vol = 20;
    }

    setPower(on) {
        this.on = on;
    }

    setVolume(v) {
        this.vol = Math.max(0, Math.min(100, v));
    }

    volume() {
        return this.vol;
    }

    isOn() {
        return this.on;
    }

    name() {
        return "TV";
    }
}

class Radio extends Device {
    constructor() {
        super();
        this.on = false;
        this.vol = 30;
    }

    setPower(on) {
        this.on = on;
    }

    setVolume(v) {
        this.vol = Math.max(0, Math.min(100, v));
    }

    volume() {
        return this.vol;
    }

    isOn() {
        return this.on;
    }

    name() {
        return "Radio";
    }
}

// ---------- Abstraction: the "what" hierarchy, holding a bridge to a Device ----
class RemoteControl {
    constructor(device) {
        this.device = device; // THE BRIDGE
    }

    report() {
        console.log(
            `  ${this.device.name()} volume = ${this.device.volume()}`
        );
    }

    togglePower() {
        this.device.setPower(!this.device.isOn());

        console.log(
            `  ${this.device.name()} is now ${
                this.device.isOn() ? "ON" : "OFF"
            }`
        );
    }

    volumeUp() {
        this.device.setVolume(this.device.volume() + 10);
        this.report();
    }

    volumeDown() {
        this.device.setVolume(this.device.volume() - 10);
        this.report();
    }
}

// ---------- Refined abstraction: extends behaviour, reuses any Device ----------
class AdvancedRemote extends RemoteControl {
    constructor(device) {
        super(device);
    }

    mute() {
        this.device.setVolume(0);
        console.log(`  ${this.device.name()} muted`);
    }
}

function main() {
    const tv = new Television();
    const radio = new Radio();

    console.log("Basic remote + TV:");
    const basic = new RemoteControl(tv);
    basic.togglePower();
    basic.volumeUp();

    console.log(
        "Advanced remote + Radio (same remote class, different device):"
    );
    const adv = new AdvancedRemote(radio);
    adv.togglePower();
    adv.volumeUp();
    adv.mute();

    // JavaScript has garbage collection, so explicit delete is not required.
}

main();
