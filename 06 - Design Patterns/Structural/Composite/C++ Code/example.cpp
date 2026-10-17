// =============================================================================
// COMPOSITE — compose objects into TREE structures and let clients treat
// individual objects (leaves) and groups (composites) UNIFORMLY through one
// interface.
//
// Domain: a file system. A File has a size; a Directory contains files and other
// directories. size() and a tree print work the same way whether you call them
// on a single file or the whole root — no "is this a folder?" checks in clients.
//
// Build & run:
//   g++ -std=c++14 example.cpp -o example
//   ./example
// =============================================================================
#include <iostream>
#include <string>
#include <vector>

using namespace std;

// ---------- Component: common interface for leaves AND composites ----------
class FileSystemNode {
protected:
    string name;
public:
    FileSystemNode(string name) { this->name = name; }
    virtual int size() = 0;                       // bytes
    virtual void print(string indent) = 0;
    string getName() { return this->name; }
    virtual ~FileSystemNode() {}
};

// ---------- Leaf ----------
class File : public FileSystemNode {
private:
    int bytes;
public:
    File(string name, int bytes) : FileSystemNode(name) { this->bytes = bytes; }
    int size() { return this->bytes; }
    void print(string indent) {
        cout << indent << "- " << this->name << " (" << this->bytes << " B)" << endl;
    }
};

// ---------- Composite ----------
class Directory : public FileSystemNode {
private:
    vector<FileSystemNode*> children;
public:
    Directory(string name) : FileSystemNode(name) {}
    void add(FileSystemNode* child) { this->children.push_back(child); }
    // A composite implements the operation by delegating to its children.
    int size() {
        int total = 0;
        for (int i = 0; i < (int)this->children.size(); i++) total += this->children[i]->size();
        return total;
    }
    void print(string indent) {
        cout << indent << "+ " << this->name << "/ (" << this->size() << " B total)" << endl;
        for (int i = 0; i < (int)this->children.size(); i++) this->children[i]->print(indent + "   ");
    }
    ~Directory() {
        for (int i = 0; i < (int)this->children.size(); i++) delete this->children[i];
    }
};

int main() {
    Directory* root = new Directory("project");
    root->add(new File("README.md", 1200));

    Directory* src = new Directory("src");
    src->add(new File("main.cpp", 800));
    src->add(new File("util.cpp", 1500));
    root->add(src);

    Directory* assets = new Directory("assets");
    assets->add(new File("logo.png", 40000));
    root->add(assets);

    root->print("");
    // Uniform treatment: this call is identical for a file or the whole tree.
    cout << "Total project size: " << root->size() << " B" << endl;

    delete root;   // recursively deletes the whole tree
    return 0;
}
