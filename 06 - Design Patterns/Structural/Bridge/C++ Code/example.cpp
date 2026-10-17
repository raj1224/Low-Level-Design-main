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
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Implementor: the "how" hierarchy ----------
class Device {
public:
    virtual void setPower(bool on) = 0;
    virtual void setVolume(int v) = 0;
    virtual int volume() = 0;
    virtual bool isOn() = 0;
    virtual string name() = 0;
    virtual ~Device() {}
};

class Television : public Device {
private:
    bool on;
    int vol;
public:
    Television() { this->on = false; this->vol = 20; }
    void setPower(bool on) { this->on = on; }
    void setVolume(int v) { this->vol = v < 0 ? 0 : (v > 100 ? 100 : v); }
    int volume() { return this->vol; }
    bool isOn() { return this->on; }
    string name() { return "TV"; }
};

class Radio : public Device {
private:
    bool on;
    int vol;
public:
    Radio() { this->on = false; this->vol = 30; }
    void setPower(bool on) { this->on = on; }
    void setVolume(int v) { this->vol = v < 0 ? 0 : (v > 100 ? 100 : v); }
    int volume() { return this->vol; }
    bool isOn() { return this->on; }
    string name() { return "Radio"; }
};

// ---------- Abstraction: the "what" hierarchy, holding a bridge to a Device ----
class RemoteControl {
protected:
    Device* device;   // THE BRIDGE
    void report() {
        cout << "  " << this->device->name() << " volume = " << this->device->volume() << endl;
    }
public:
    RemoteControl(Device* device) { this->device = device; }
    virtual ~RemoteControl() {}
    void togglePower() {
        this->device->setPower(!this->device->isOn());
        cout << "  " << this->device->name() << " is now "
             << (this->device->isOn() ? "ON" : "OFF") << endl;
    }
    void volumeUp() { this->device->setVolume(this->device->volume() + 10); this->report(); }
    void volumeDown() { this->device->setVolume(this->device->volume() - 10); this->report(); }
};

// ---------- Refined abstraction: extends behaviour, reuses any Device ----------
class AdvancedRemote : public RemoteControl {
public:
    AdvancedRemote(Device* device) : RemoteControl(device) {}
    void mute() {
        this->device->setVolume(0);
        cout << "  " << this->device->name() << " muted" << endl;
    }
};

int main() {
    Television* tv = new Television();
    Radio* radio = new Radio();

    cout << "Basic remote + TV:" << endl;
    RemoteControl* basic = new RemoteControl(tv);
    basic->togglePower();
    basic->volumeUp();

    cout << "Advanced remote + Radio (same remote class, different device):" << endl;
    AdvancedRemote* adv = new AdvancedRemote(radio);
    adv->togglePower();
    adv->volumeUp();
    adv->mute();

    delete basic;
    delete adv;
    delete tv;
    delete radio;
    return 0;
}
