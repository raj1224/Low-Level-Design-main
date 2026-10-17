// =============================================================================
// DECORATOR — attach additional responsibilities to an object DYNAMICALLY by
// wrapping it in another object that shares the same interface. A flexible
// alternative to subclassing for extending behaviour.
//
// Domain: rich-text rendering. A plain Text can be wrapped with Bold, Italic and
// Underline decorators, in any order and combination, at runtime. Subclassing
// would need BoldItalic, BoldUnderline, BoldItalicUnderline... an explosion.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Component ----------
class Text {
public:
    virtual string render() = 0;
    virtual ~Text() {}
};

// ---------- Concrete component ----------
class PlainText : public Text {
private:
    string s;
public:
    PlainText(string s) { this->s = s; }
    string render() { return this->s; }
};

// ---------- Base decorator: IS-A Text and HAS-A Text ----------
class TextDecorator : public Text {
protected:
    Text* inner;   // the wrapped object
public:
    TextDecorator(Text* inner) { this->inner = inner; }
    virtual ~TextDecorator() { delete this->inner; }
};

// ---------- Concrete decorators: wrap render() and add their bit ----------
class Bold : public TextDecorator {
public:
    Bold(Text* inner) : TextDecorator(inner) {}
    string render() { return "**" + this->inner->render() + "**"; }
};
class Italic : public TextDecorator {
public:
    Italic(Text* inner) : TextDecorator(inner) {}
    string render() { return "*" + this->inner->render() + "*"; }
};
class Underline : public TextDecorator {
public:
    Underline(Text* inner) : TextDecorator(inner) {}
    string render() { return "<u>" + this->inner->render() + "</u>"; }
};

int main() {
    // Plain
    Text* t1 = new PlainText("Sale!");
    cout << "  " << t1->render() << endl;

    // Bold(Italic("Sale!")) — wrap at runtime, inside-out
    Text* t2 = new Bold(new Italic(new PlainText("Sale!")));
    cout << "  " << t2->render() << endl;

    // Underline(Bold("50% OFF")) — different combo, no new class needed
    Text* t3 = new Underline(new Bold(new PlainText("50% OFF")));
    cout << "  " << t3->render() << endl;

    delete t1;
    delete t2;   // each decorator deletes its inner, all the way down
    delete t3;
    return 0;
}
