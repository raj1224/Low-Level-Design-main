// =============================================================================
// ABSTRACT FACTORY (Java twin of example.cpp) — each factory creates a matching
// FAMILY of products (Button + Checkbox), so the look stays consistent.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Abstract products ----------
interface Button { String render(); }
interface Checkbox { String render(); }

// ---------- Concrete products: Light family ----------
class LightButton implements Button {
    public String render() { return "[ Submit ]  (white bg, dark text)"; }
}
class LightCheckbox implements Checkbox {
    public String render() { return "[x] Remember me  (light)"; }
}

// ---------- Concrete products: Dark family ----------
class DarkButton implements Button {
    public String render() { return "[ Submit ]  (dark bg, light text)"; }
}
class DarkCheckbox implements Checkbox {
    public String render() { return "[x] Remember me  (dark)"; }
}

// ---------- Abstract factory: creates a matching family ----------
interface WidgetFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// ---------- Concrete factories ----------
class LightThemeFactory implements WidgetFactory {
    public Button createButton() { return new LightButton(); }
    public Checkbox createCheckbox() { return new LightCheckbox(); }
}
class DarkThemeFactory implements WidgetFactory {
    public Button createButton() { return new DarkButton(); }
    public Checkbox createCheckbox() { return new DarkCheckbox(); }
}

public class Main {
    // Client code depends only on the abstract factory + abstract products.
    static void renderLoginForm(WidgetFactory factory) {
        Button button = factory.createButton();
        Checkbox checkbox = factory.createCheckbox();
        System.out.println("  " + checkbox.render());
        System.out.println("  " + button.render());
    }

    public static void main(String[] args) {
        System.out.println("Light theme:");
        renderLoginForm(new LightThemeFactory());
        System.out.println("Dark theme:");
        renderLoginForm(new DarkThemeFactory());
    }
}
