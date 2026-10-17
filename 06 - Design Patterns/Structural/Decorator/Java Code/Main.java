// =============================================================================
// DECORATOR (Java twin of example.cpp) — wrap a Text in Bold/Italic/Underline
// decorators at runtime, in any combination, without subclass explosion.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================

// ---------- Component ----------
interface Text {
    String render();
}

// ---------- Concrete component ----------
class PlainText implements Text {
    private String s;
    PlainText(String s) { this.s = s; }
    public String render() { return this.s; }
}

// ---------- Base decorator: IS-A Text and HAS-A Text ----------
abstract class TextDecorator implements Text {
    protected Text inner;   // the wrapped object
    TextDecorator(Text inner) { this.inner = inner; }
}

// ---------- Concrete decorators: wrap render() and add their bit ----------
class Bold extends TextDecorator {
    Bold(Text inner) { super(inner); }
    public String render() { return "**" + this.inner.render() + "**"; }
}
class Italic extends TextDecorator {
    Italic(Text inner) { super(inner); }
    public String render() { return "*" + this.inner.render() + "*"; }
}
class Underline extends TextDecorator {
    Underline(Text inner) { super(inner); }
    public String render() { return "<u>" + this.inner.render() + "</u>"; }
}

public class Main {
    public static void main(String[] args) {
        Text t1 = new PlainText("Sale!");
        System.out.println("  " + t1.render());

        Text t2 = new Bold(new Italic(new PlainText("Sale!")));
        System.out.println("  " + t2.render());

        Text t3 = new Underline(new Bold(new PlainText("50% OFF")));
        System.out.println("  " + t3.render());
    }
}
