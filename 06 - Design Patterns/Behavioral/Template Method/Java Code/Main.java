// =============================================================================
// TEMPLATE METHOD (Java twin of example.cpp) — BuildPipeline.run() is the fixed
// (final) skeleton; subclasses fill in the language-specific steps.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================
abstract class BuildPipeline {
    // Shared step (same for all).
    protected void checkout() { System.out.println("  git checkout main"); }

    // Steps that vary.
    protected abstract void installDependencies();
    protected abstract void compile();
    protected abstract void test();

    // Hook with a default the subclass MAY override.
    protected void deploy() { System.out.println("  deploy artifact to registry"); }
    protected boolean deployable() { return false; }

    // THE TEMPLATE METHOD: final so subclasses can't reorder the steps.
    public final void run() {
        checkout();
        installDependencies();
        compile();
        test();
        if (deployable()) deploy();
        System.out.println("  pipeline complete");
    }
}

class NodePipeline extends BuildPipeline {
    protected void installDependencies() { System.out.println("  npm ci"); }
    protected void compile() { System.out.println("  tsc (TypeScript -> JS)"); }
    protected void test() { System.out.println("  jest"); }
    protected boolean deployable() { return true; }     // opt in to the deploy hook
}

class JavaPipeline extends BuildPipeline {
    protected void installDependencies() { System.out.println("  mvn dependency:resolve"); }
    protected void compile() { System.out.println("  javac"); }
    protected void test() { System.out.println("  junit"); }
    // deployable() stays false -> deploy step skipped
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Node pipeline:");
        new NodePipeline().run();
        System.out.println("Java pipeline:");
        new JavaPipeline().run();
    }
}
