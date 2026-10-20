
/* =============================================================================
 * TEMPLATE METHOD — define the SKELETON of an algorithm in a base class, and let
 * subclasses override specific STEPS without changing the overall structure.
 * The fixed sequence lives in one place; only the varying steps are subclassed.
 *
 * Domain: a CI build pipeline. Every build does: checkout -> install deps ->
 * compile -> test -> (maybe) deploy, in that order. A Node project and a Java
 * project differ only in HOW some steps run, not the order.
 *
 * Build & run:
 *   node example.js
 * =============================================================================
 */

class BuildPipeline {
    // Shared step (same for all): a concrete default in the base.
    checkout() {
        console.log("  git checkout main");
    }

    // Steps that vary: subclasses must implement these methods.
    installDependencies() {
        throw new Error("installDependencies() must be implemented");
    }

    compile() {
        throw new Error("compile() must be implemented");
    }

    test() {
        throw new Error("test() must be implemented");
    }

    // Hook: a step with a default the subclass MAY override.
    deploy() {
        console.log("  deploy artifact to registry");
    }

    deployable() {
        return false;
    }

    // THE TEMPLATE METHOD: the fixed skeleton.
    // Subclasses provide steps but should not change their order.
    run() {
        this.checkout();
        this.installDependencies(); // step varies
        this.compile();              // step varies
        this.test();                 // step varies

        if (this.deployable()) {
            this.deploy();           // optional hook
        }

        console.log("  pipeline complete");
    }
}

class NodePipeline extends BuildPipeline {
    installDependencies() {
        console.log("  npm ci");
    }

    compile() {
        console.log("  tsc (TypeScript -> JS)");
    }

    test() {
        console.log("  jest");
    }

    deployable() {
        return true; // opt in to the deploy hook
    }
}

class JavaPipeline extends BuildPipeline {
    installDependencies() {
        console.log("  mvn dependency:resolve");
    }

    compile() {
        console.log("  javac");
    }

    test() {
        console.log("  junit");
    }

    // deployable() stays false -> deploy step skipped
}

function main() {
    console.log("Node pipeline:");
    const node = new NodePipeline();
    node.run();

    console.log("Java pipeline:");
    const java = new JavaPipeline();
    java.run();
}

main();
