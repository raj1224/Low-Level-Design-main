// =============================================================================
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

public:
    Logger() { this->count = 0; }
    

    void log(string msg) {
        this->count = this->count + 1;
        cout << "[LOG #" << this->count << "] " << msg << endl;
    }
    int messageCount() { return this->count; }

};


int main() {
    Logger* logger1 = new Logger();
    Logger* logger2 = new Logger();
    cout<<(logger1 == logger2)<<endl;
    return 0;
}
