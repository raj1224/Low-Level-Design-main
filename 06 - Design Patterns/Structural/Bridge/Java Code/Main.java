// =============================================================================
// BRIDGE (Java twin of example.cpp) — remotes (abstraction) and devices
// (implementation) vary independently, connected by a reference.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Implementor: the "how" hierarchy ----------
interface Device {
    void setPower(boolean on);
    void setVolume(int v);
    int volume();
    boolean isOn();
    String name();
}

class Television implements Device {
    private boolean on = false;
    private int vol = 20;
    public void setPower(boolean on) { this.on = on; }
    public void setVolume(int v) { this.vol = v < 0 ? 0 : (v > 100 ? 100 : v); }
    public int volume() { return this.vol; }
    public boolean isOn() { return this.on; }
    public String name() { return "TV"; }
}

class Radio implements Device {
    private boolean on = false;
    private int vol = 30;
    public void setPower(boolean on) { this.on = on; }
    public void setVolume(int v) { this.vol = v < 0 ? 0 : (v > 100 ? 100 : v); }
    public int volume() { return this.vol; }
    public boolean isOn() { return this.on; }
    public String name() { return "Radio"; }
}

// ---------- Abstraction: holds a bridge to a Device ----------
class RemoteControl {
    protected Device device;   // THE BRIDGE
    RemoteControl(Device device) { this.device = device; }
    protected void report() {
        System.out.println("  " + this.device.name() + " volume = " + this.device.volume());
    }
    void togglePower() {
        this.device.setPower(!this.device.isOn());
        System.out.println("  " + this.device.name() + " is now " + (this.device.isOn() ? "ON" : "OFF"));
    }
    void volumeUp() { this.device.setVolume(this.device.volume() + 10); report(); }
    void volumeDown() { this.device.setVolume(this.device.volume() - 10); report(); }
}

// ---------- Refined abstraction: extends behaviour, reuses any Device ----------
class AdvancedRemote extends RemoteControl {
    AdvancedRemote(Device device) { super(device); }
    void mute() {
        this.device.setVolume(0);
        System.out.println("  " + this.device.name() + " muted");
    }
}

public class Main {
    public static void main(String[] args) {
        Device tv = new Television();
        Device radio = new Radio();

        System.out.println("Basic remote + TV:");
        RemoteControl basic = new RemoteControl(tv);
        basic.togglePower();
        basic.volumeUp();

        System.out.println("Advanced remote + Radio (same remote class, different device):");
        AdvancedRemote adv = new AdvancedRemote(radio);
        adv.togglePower();
        adv.volumeUp();
        adv.mute();
    }
}
