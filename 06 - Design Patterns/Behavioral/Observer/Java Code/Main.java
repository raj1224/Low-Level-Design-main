// =============================================================================
// OBSERVER (Java twin of example.cpp) — a weather station notifies every
// attached display when a new reading arrives.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================
import java.util.ArrayList;
import java.util.List;

// ---------- Observer interface ----------
interface Observer {
    void update(double tempC, double humidity);
}

// ---------- Subject ----------
class WeatherStation {
    private List<Observer> observers = new ArrayList<Observer>();
    private double tempC = 0;
    private double humidity = 0;

    void subscribe(Observer o) { this.observers.add(o); }
    void unsubscribe(Observer o) { this.observers.remove(o); }

    void setMeasurements(double tempC, double humidity) {
        this.tempC = tempC;
        this.humidity = humidity;
        notifyObservers();                         // push the change to everyone
    }
    // (named notifyObservers, not notifyAll — Object.notifyAll() is final.)
    private void notifyObservers() {
        for (Observer o : this.observers) o.update(this.tempC, this.humidity);
    }
}

// ---------- Concrete observers ----------
class PhoneDisplay implements Observer {
    private String owner;
    PhoneDisplay(String owner) { this.owner = owner; }
    public void update(double tempC, double humidity) {
        System.out.println("  [" + this.owner + "'s phone] " + tempC + "C, " + humidity + "% humidity");
    }
}

class WindowDashboard implements Observer {
    public void update(double tempC, double humidity) {
        System.out.println("  [window dashboard] temp=" + tempC + "C" + (tempC > 35 ? "  (heat alert!)" : ""));
    }
}

public class Main {
    public static void main(String[] args) {
        WeatherStation station = new WeatherStation();
        PhoneDisplay phone = new PhoneDisplay("Aarav");
        WindowDashboard window = new WindowDashboard();

        station.subscribe(phone);
        station.subscribe(window);

        System.out.println("Reading 1:");
        station.setMeasurements(31.5, 60);

        System.out.println("Reading 2 (Aarav closed the app -> unsubscribed):");
        station.unsubscribe(phone);
        station.setMeasurements(37.0, 45);
    }
}
