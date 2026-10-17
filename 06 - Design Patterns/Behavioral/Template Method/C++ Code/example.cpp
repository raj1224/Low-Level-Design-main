// =============================================================================
// TEMPLATE METHOD — define the SKELETON of an algorithm in a base class, and let
// subclasses override specific STEPS without changing the overall structure. The
// fixed sequence lives in one place; only the varying steps are subclassed.
//
// Domain: a CI build pipeline. Every build does: checkout -> install deps ->
// compile -> test -> (maybe) deploy, in that order. A Node project and a Java
// project differ only in HOW some steps run, not the order.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>

using namespace std;

class BuildPipeline {
protected:
    // Shared step (same for all): a concrete default in the base.
    void checkout() { cout << "  git checkout main" << endl; }

    // Steps that vary: pure virtual, supplied by subclasses.
    virtual void installDependencies() = 0;
    virtual void compile() = 0;
    virtual void test() = 0;

    // Hook: a step with a default the subclass MAY override.
    void deploy() { cout << "  deploy artifact to registry" << endl; }
    virtual bool deployable() { return false; }

public:
    // THE TEMPLATE METHOD: the fixed skeleton. Subclasses fill in steps but
    // cannot reorder them.
    void run() {
        this->checkout();
        this->installDependencies();   // step varies
        this->compile();               // step varies
        this->test();                  // step varies
        if (this->deployable()) this->deploy();   // optional hook
        cout << "  pipeline complete" << endl;
    }
    virtual ~BuildPipeline() {}
};

class NodePipeline : public BuildPipeline {
protected:
    void installDependencies() { cout << "  npm ci" << endl; }
    void compile() { cout << "  tsc (TypeScript -> JS)" << endl; }
    void test() { cout << "  jest" << endl; }
    bool deployable() { return true; }     // opt in to the deploy hook
};

class JavaPipeline : public BuildPipeline {
protected:
    void installDependencies() { cout << "  mvn dependency:resolve" << endl; }
    void compile() { cout << "  javac" << endl; }
    void test() { cout << "  junit" << endl; }
    // deployable() stays false -> deploy step skipped
};

int main() {
    cout << "Node pipeline:" << endl;
    BuildPipeline* node = new NodePipeline();
    node->run();

    cout << "Java pipeline:" << endl;
    BuildPipeline* java = new JavaPipeline();
    java->run();

    delete node;
    delete java;
    return 0;
}
