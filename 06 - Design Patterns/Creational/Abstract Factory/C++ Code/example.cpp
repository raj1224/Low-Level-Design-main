// =============================================================================
// ABSTRACT FACTORY — create FAMILIES of related objects without specifying their
// concrete classes, guaranteeing the products in a family match.
//
// Domain: a cross-platform UI toolkit. A "Light" theme and a "Dark" theme each
// produce a matching Button + Checkbox. The client builds a form using a factory
// and is guaranteed a consistent look — you can't mix a light button with a dark
// checkbox.
//
// Factory Method makes ONE product; Abstract Factory makes a whole FAMILY.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>

using namespace std;

// ---------- Abstract products ----------
class Button {
public:
    virtual string render() = 0;
    virtual ~Button() {}
};
class Checkbox {
public:
    virtual string render() = 0;
    virtual ~Checkbox() {}
};

// ---------- Concrete products: Light family ----------
class LightButton : public Button {
public:
    string render() { return "[ Submit ]  (white bg, dark text)"; }
};
class LightCheckbox : public Checkbox {
public:
    string render() { return "[x] Remember me  (light)"; }
};

// ---------- Concrete products: Dark family ----------
class DarkButton : public Button {
public:
    string render() { return "[ Submit ]  (dark bg, light text)"; }
};
class DarkCheckbox : public Checkbox {
public:
    string render() { return "[x] Remember me  (dark)"; }
};

// ---------- Abstract factory: creates a matching family ----------
class WidgetFactory {
public:
    virtual Button* createButton() = 0;
    virtual Checkbox* createCheckbox() = 0;
    virtual ~WidgetFactory() {}
};

// ---------- Concrete factories ----------
class LightThemeFactory : public WidgetFactory {
public:
    Button* createButton() { return new LightButton(); }
    Checkbox* createCheckbox() { return new LightCheckbox(); }
};
class DarkThemeFactory : public WidgetFactory {
public:
    Button* createButton() { return new DarkButton(); }
    Checkbox* createCheckbox() { return new DarkCheckbox(); }
};

// Client code depends only on the abstract factory + abstract products.
void renderLoginForm(WidgetFactory* factory) {
    Button* button = factory->createButton();
    Checkbox* checkbox = factory->createCheckbox();
    cout << "  " << checkbox->render() << endl;
    cout << "  " << button->render() << endl;
    delete button;
    delete checkbox;
}

int main() {
    WidgetFactory* light = new LightThemeFactory();
    WidgetFactory* dark = new DarkThemeFactory();

    cout << "Light theme:" << endl;
    renderLoginForm(light);
    cout << "Dark theme:" << endl;
    renderLoginForm(dark);

    delete light;
    delete dark;
    return 0;
}
