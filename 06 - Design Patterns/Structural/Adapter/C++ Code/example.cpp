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
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Target: the interface the client already expects ----------
class ITemperatureSensor {
public:
    virtual double celsius() = 0;
    virtual string id() = 0;
    virtual ~ITemperatureSensor() {}
};

// ---------- Adaptee: third-party code we cannot change (returns Fahrenheit) ----
class LegacyFahrenheitThermometer {
private:
    string serial;
    double fahrenheit;
public:
    LegacyFahrenheitThermometer(string serial, double f) {
        this->serial = serial;
        this->fahrenheit = f;
    }
    double readFahrenheit() { return this->fahrenheit; }   // incompatible unit + name
    string serialNumber() { return this->serial; }
};

// ---------- Adapter: implements the Target by delegating to the Adaptee ----------
class FahrenheitSensorAdapter : public ITemperatureSensor {
private:
    LegacyFahrenheitThermometer* device;   // object adapter (composition)
public:
    FahrenheitSensorAdapter(LegacyFahrenheitThermometer* dev) {
        this->device = dev;
    }
    double celsius() {
        return (this->device->readFahrenheit() - 32.0) * 5.0 / 9.0;   // the conversion
    }
    string id() { return this->device->serialNumber(); }
    ~FahrenheitSensorAdapter() { delete this->device; }
};

// The dashboard knows ONLY the target interface — it never sees Fahrenheit.
void showReading(ITemperatureSensor* sensor) {
    cout << "  sensor " << sensor->id() << ": " << sensor->celsius() << " C" << endl;
}

int main() {
    // Adapt a legacy Fahrenheit device into the expected Celsius interface:
    LegacyFahrenheitThermometer* legacy = new LegacyFahrenheitThermometer("TH-1007", 98.6);
    ITemperatureSensor* adapted = new FahrenheitSensorAdapter(legacy);

    cout << "Weather dashboard (works only in Celsius):" << endl;
    showReading(adapted);          // 98.6 F -> 37 C, dashboard none the wiser

    delete adapted;                // the adapter deletes the wrapped legacy device
    return 0;
}
