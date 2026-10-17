// =============================================================================
// ADAPTER (Java twin of example.cpp) — wrap a Fahrenheit-only legacy thermometer
// so it satisfies the Celsius interface the dashboard expects.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Target: the interface the client already expects ----------
interface ITemperatureSensor {
    double celsius();
    String id();
}

// ---------- Adaptee: third-party code we cannot change (returns Fahrenheit) ----
class LegacyFahrenheitThermometer {
    private String serial;
    private double fahrenheit;
    LegacyFahrenheitThermometer(String serial, double f) {
        this.serial = serial;
        this.fahrenheit = f;
    }
    double readFahrenheit() { return this.fahrenheit; }
    String serialNumber() { return this.serial; }
}

// ---------- Adapter: implements the Target by delegating to the Adaptee ----------
class FahrenheitSensorAdapter implements ITemperatureSensor {
    private LegacyFahrenheitThermometer device;   // object adapter (composition)
    FahrenheitSensorAdapter(LegacyFahrenheitThermometer dev) { this.device = dev; }
    public double celsius() { return (this.device.readFahrenheit() - 32.0) * 5.0 / 9.0; }
    public String id() { return this.device.serialNumber(); }
}

public class Main {
    static void showReading(ITemperatureSensor sensor) {
        System.out.println("  sensor " + sensor.id() + ": " + sensor.celsius() + " C");
    }
    public static void main(String[] args) {
        LegacyFahrenheitThermometer legacy = new LegacyFahrenheitThermometer("TH-1007", 98.6);
        ITemperatureSensor adapted = new FahrenheitSensorAdapter(legacy);
        System.out.println("Weather dashboard (works only in Celsius):");
        showReading(adapted);
    }
}
