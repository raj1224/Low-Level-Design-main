// =============================================================================
// SINGLETON — guarantee a class has exactly ONE instance and give the whole
// program a single access point to it. Used for genuinely shared resources:
// a logger, a config store, a connection pool.
//
// This shows the modern, correct C++ way: the "Meyers Singleton", a
// function-local static. Since C++11 the standard GUARANTEES it is initialized
// exactly once and thread-safely (the compiler inserts the synchronization) —
// so this is lazy AND thread-safe with zero locking code and no leak.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

class Logger {
private:
    int count;
    Logger() { this->count = 0; }    // private ctor => no outside construction

public:
    static Logger& instance() {
        static Logger inst;          // created once, thread-safely, on first call
        return inst;
    }

    void log(string msg) {
        this->count = this->count + 1;
        cout << "[LOG #" << this->count << "] " << msg << endl;
    }
    int messageCount() { return this->count; }

    // Forbid copy & assignment so a second instance can never come to exist.
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;
};

// A second, unrelated module logging through the SAME logger — no globals passed
// around, no second instance created.
void processPayment(double amount) {
    Logger::instance().log("charging Rs " + to_string((int)amount));
}

int main() {
    // Every access returns the SAME object.
    Logger& a = Logger::instance();
    Logger& b = Logger::instance();
    cout << "Same instance? " << (&a == &b ? "yes" : "no") << endl;

    Logger::instance().log("application started");
    processPayment(799);
    processPayment(1499);
    Logger::instance().log("application shutting down");

    cout << "Total messages through the one Logger: "
         << Logger::instance().messageCount() << endl;
    return 0;
}
