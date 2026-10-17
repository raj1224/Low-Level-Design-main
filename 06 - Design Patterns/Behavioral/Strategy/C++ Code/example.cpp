// =============================================================================
// STRATEGY — define a family of interchangeable algorithms, put each in its own
// class, and make them swappable at run time. The "context" delegates the
// varying behaviour to a strategy object instead of hard-coding it.
//
// Real-world analogy: a navigation app. The ROUTE you want — fastest, shortest,
// or avoid-tolls — is a strategy you pick. The navigator's code stays identical;
// only the plugged-in strategy changes.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Strategy interface: the common contract ----------
class RouteStrategy {
public:
    virtual string buildRoute(const string& from, const string& to) = 0;
    virtual ~RouteStrategy() {}
};

// ---------- Concrete strategies: interchangeable algorithms ----------
class FastestRoute : public RouteStrategy {
public:
    string buildRoute(const string& from, const string& to) {
        return from + " -> [highway, 2 tolls] -> " + to + "  (20km, 42 min)";
    }
};

class ShortestRoute : public RouteStrategy {
public:
    string buildRoute(const string& from, const string& to) {
        return from + " -> [city roads] -> " + to + "  (11 km, 55 min)";
    }
};

class AvoidTollsRoute : public RouteStrategy {
public:
    string buildRoute(const string& from, const string& to) {
        return from + " -> [no tolls] -> " + to + "  (49 min)";
    }
};

class NaturalRoute : public RouteStrategy {
public:
    string buildRoute(const string& from, const string& to){
        return from + " -> [rivers] [lakes] [mountains] -> " + to;
    }
};

// ---------- Context: holds a strategy, swappable any time ---------- 
class Navigator {
private:
    RouteStrategy* strategy;
public:
    Navigator() {
        this->strategy = nullptr;
    }
    // Takes ownership of the strategy and frees the previous one (if any).
    void setStrategy(RouteStrategy* s) {
        if (this->strategy != nullptr) delete this->strategy;
        this->strategy = s;
    }
    void navigate(const string& from, const string& to) {
        if (this->strategy == nullptr) {
            cout << "  no strategy set" << endl;
            return;
        }
        cout << "  " << this->strategy->buildRoute(from, to) << endl;
    }
    ~Navigator() {
        if (this->strategy != nullptr) delete this->strategy;
    }
};

int main() {
    Navigator* nav = new Navigator();

    cout << "Fastest:" << endl;
    nav->setStrategy(new FastestRoute());
    nav->navigate("Home", "Office");

    cout << "Shortest:" << endl;
    nav->setStrategy(new ShortestRoute());
    nav->navigate("Home", "Office");

    cout << "Avoid tolls (swapped at run time):" << endl;
    nav->setStrategy(new AvoidTollsRoute());
    nav->navigate("Home", "Office");

    delete nav;   // Navigator's destructor frees the last strategy
    return 0;
}
