
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
//   node example.js
// =============================================================================

// ---------- Abstract products ----------
class Button {
    render() {
        throw new Error("Button render() must be implemented");
    }
}

class Checkbox {
    render() {
        throw new Error("Checkbox render() must be implemented");
    }
}

// ---------- Concrete products: Light family ----------
class LightButton extends Button {
    render() {
        return "[ Submit ]  (white bg, dark text)";
    }
}

class LightCheckbox extends Checkbox {
    render() {
        return "[x] Remember me  (light)";
    }
}

// ---------- Concrete products: Dark family ----------
class DarkButton extends Button {
    render() {
        return "[ Submit ]  (dark bg, light text)";
    }
}

class DarkCheckbox extends Checkbox {
    render() {
        return "[x] Remember me  (dark)";
    }
}

// ---------- Abstract factory: creates a matching family ----------
class WidgetFactory {
    createButton() {
        throw new Error("createButton() must be implemented");
    }

    createCheckbox() {
        throw new Error("createCheckbox() must be implemented");
    }
}

// ---------- Concrete factories ----------
class LightThemeFactory extends WidgetFactory {
    createButton() {
        return new LightButton();
    }

    createCheckbox() {
        return new LightCheckbox();
    }
}

class DarkThemeFactory extends WidgetFactory {
    createButton() {
        return new DarkButton();
    }

    createCheckbox() {
        return new DarkCheckbox();
    }
}

// Client code depends only on the abstract factory + abstract products.
function renderLoginForm(factory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();

    console.log("  " + checkbox.render());
    console.log("  " + button.render());
}

function main() {
    const light = new LightThemeFactory();
    const dark = new DarkThemeFactory();

    console.log("Light theme:");
    renderLoginForm(light);

    console.log("Dark theme:");
    renderLoginForm(dark);
}

main();
