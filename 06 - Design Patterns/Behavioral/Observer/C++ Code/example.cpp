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
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>
#include <vector>

using namespace std;

// ---------- Observer interface ----------
class Observer {
public:
    virtual void update(double tempC, double humidity) = 0;
    virtual ~Observer() {}
};

// ---------- Subject: manages observers and notifies them ----------
class WeatherStation {
private:
    vector<Observer*> observers;
    double tempC;
    double humidity;
    void notifyAll() {
        for (int i = 0; i < (int)this->observers.size(); i++)
            this->observers[i]->update(this->tempC, this->humidity);//dyanmic poly
    }
public:
    WeatherStation() { this->tempC = 0; this->humidity = 0; }
    void subscribe(Observer* o) { this->observers.push_back(o); }
    void unsubscribe(Observer* o) {
        for (int i = 0; i < (int)this->observers.size(); i++) {
            if (this->observers[i] == o) { this->observers.erase(this->observers.begin() + i); return; }
        }
    }
    void setMeasurements(double tempC, double humidity) {
        this->tempC = tempC;
        this->humidity = humidity;
        this->notifyAll();                         // push the change to everyone
    }
};

// ---------- Concrete observers ----------
class PhoneDisplay : public Observer {
private:
    string owner;
public:
    PhoneDisplay(string owner) { this->owner = owner; }
    void update(double tempC, double humidity) {
        cout << "  [" << this->owner << "'s phone] " << tempC << "C, "
             << humidity << "% humidity" << endl;
    }
};

class WindowDashboard : public Observer {
public:
    void update(double tempC, double humidity) {
        cout << "  [window dashboard] temp=" << tempC << "C"
             << (tempC > 35 ? "  (heat alert!)" : "") << endl;
    }
};


int main() {
    WeatherStation station;
    PhoneDisplay phone("Aarav");
    WindowDashboard window;

    station.subscribe(&phone);
    station.subscribe(&window);

    cout << "Reading 1:" << endl;
    station.setMeasurements(31.5, 60);

    cout << "Reading 2 (Aarav closed the app -> unsubscribed):" << endl;
    station.unsubscribe(&phone);
    station.setMeasurements(37.0, 45);
    return 0;
}
