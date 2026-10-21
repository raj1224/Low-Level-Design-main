
// =============================================================================
// BUILDER — construct a complex object step by step. The product can stay
// consistent with many optional fields, with no "telescoping constructor" mess.
//
// Domain: assembling a custom Computer. A few required parts (CPU, RAM) and many
// optional ones (GPU, SSD, liquid cooling, Wi-Fi). A constructor with 8
// parameters would be unreadable; a fluent builder makes intent obvious.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Product ----------
class Computer {
    constructor() {
        this.cpu = "";
        this.ramGB = 0;
        this.gpu = "";
        this.ssdGB = 256;
        this.liquidCooling = false;
        this.wifi = false;
    }

    summary() {
        console.log(
            `  Computer { CPU=${this.cpu}, RAM=${this.ramGB}GB` +
            `, GPU=${this.gpu || "integrated"}` +
            `, SSD=${this.ssdGB}GB` +
            `, liquidCooled=${this.liquidCooling ? "yes" : "no"}` +
            `, wifi=${this.wifi ? "yes" : "no"} }`
        );
    }
}

// ---------- Builder: fluent, chainable, validates at build() ----------
class ComputerBuilder {
    constructor(cpu, ramGB) {
        this.c = new Computer();
        this.c.cpu = cpu;
        this.c.ramGB = ramGB;
    }

    withGpu(gpu) {
        this.c.gpu = gpu;
        return this;
    }

    withSsd(gb) {
        this.c.ssdGB = gb;
        return this;
    }

    withLiquidCooling() {
        this.c.liquidCooling = true;
        return this;
    }

    withWifi() {
        this.c.wifi = true;
        return this;
    }

    build() {
        if (!this.c.cpu || this.c.ramGB <= 0) {
            throw new Error("CPU and RAM are required");
        }

        return this.c;
    }
}

function main() {
    // Read it like a sentence — each option is named, order doesn't matter.
    const office = new ComputerBuilder("Intel i5", 16)
        .withSsd(512)
        .withWifi()
        .build();

    const gaming = new ComputerBuilder("Ryzen 9", 64)
        .withGpu("RTX 4090")
        .withSsd(2000)
        .withLiquidCooling()
        .withWifi()
        .build();

    console.log("Office build:");
    office.summary();

    console.log("Gaming build:");
    gaming.summary();
}

main();
