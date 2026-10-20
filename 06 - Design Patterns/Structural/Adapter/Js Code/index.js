
// =============================================================================
// ADAPTER — convert the interface of an existing class into another interface a
// client expects. Lets classes work together that otherwise couldn't because of
// incompatible interfaces.
//
// Domain: a weather dashboard is coded against ITemperatureSensor::celsius().
// We must integrate a third-party thermometer we cannot modify, whose only
// method returns Fahrenheit. An Adapter wraps it and speaks Celsius.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Target: the interface the client already expects ----------
class ITemperatureSensor {
    celsius() {
        throw new Error("celsius() must be implemented");
    }

    id() {
        throw new Error("id() must be implemented");
    }
}

// ---------- Adaptee: third-party code we cannot change (returns Fahrenheit) ----
class LegacyFahrenheitThermometer {
    constructor(serial, f) {
        this.serial = serial;
        this.fahrenheit = f;
    }

    readFahrenheit() {
        return this.fahrenheit;
    } // incompatible unit + name

    serialNumber() {
        return this.serial;
    }
}

// ---------- Adapter: implements the Target by delegating to the Adaptee ----------
class FahrenheitSensorAdapter extends ITemperatureSensor {
    constructor(dev) {
        super();
        this.device = dev; // object adapter (composition)
    }

    celsius() {
        // the conversion
        return (this.device.readFahrenheit() - 32.0) * 5.0 / 9.0;
    }

    id() {
        return this.device.serialNumber();
    }
}

// The dashboard knows ONLY the target interface — it never sees Fahrenheit.
function showReading(sensor) {
    console.log(`  sensor ${sensor.id()}: ${sensor.celsius()} C`);
}

function main() {
    // Adapt a legacy Fahrenheit device into the expected Celsius interface:
    const legacy = new LegacyFahrenheitThermometer("TH-1007", 98.6);
    const adapted = new FahrenheitSensorAdapter(legacy);

    console.log("Weather dashboard (works only in Celsius):");
    showReading(adapted); // 98.6 F -> 37 C, dashboard none the wiser

    // JavaScript has garbage collection, so explicit delete is not required.
}

main();
