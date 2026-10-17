// =============================================================================
// COMPOSITE (Java twin of example.cpp) — a File (leaf) and a Directory
// (composite) share one interface, so size()/print() work uniformly on a single
// file or the whole tree.
//
// Build & run:
//   javac Main.java
//   java Main
// =============================================================================
import java.util.ArrayList;
import java.util.List;

// ---------- Component: common interface for leaves AND composites ----------
abstract class FileSystemNode {
    protected String name;
    FileSystemNode(String name) { this.name = name; }
    abstract int size();                       // bytes
    abstract void print(String indent);
    String getName() { return this.name; }
}

// ---------- Leaf ----------
class FileNode extends FileSystemNode {
    private int bytes;
    FileNode(String name, int bytes) { super(name); this.bytes = bytes; }
    int size() { return this.bytes; }
    void print(String indent) {
        System.out.println(indent + "- " + this.name + " (" + this.bytes + " B)");
    }
}

// ---------- Composite ----------
class Directory extends FileSystemNode {
    private List<FileSystemNode> children = new ArrayList<FileSystemNode>();
    Directory(String name) { super(name); }
    void add(FileSystemNode child) { this.children.add(child); }
    int size() {
        int total = 0;
        for (FileSystemNode c : this.children) total += c.size();
        return total;
    }
    void print(String indent) {
        System.out.println(indent + "+ " + this.name + "/ (" + size() + " B total)");
        for (FileSystemNode c : this.children) c.print(indent + "   ");
    }
}

public class Main {
    public static void main(String[] args) {
        Directory root = new Directory("project");
        root.add(new FileNode("README.md", 1200));

        Directory src = new Directory("src");
        src.add(new FileNode("main.cpp", 800));
        src.add(new FileNode("util.cpp", 1500));
        root.add(src);

        Directory assets = new Directory("assets");
        assets.add(new FileNode("logo.png", 40000));
        root.add(assets);

        root.print("");
        System.out.println("Total project size: " + root.size() + " B");
    }
}
