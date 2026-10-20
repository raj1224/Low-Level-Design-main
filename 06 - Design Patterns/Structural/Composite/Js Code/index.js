
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
//   node example.js
// =============================================================================

// ---------- Component: common interface for leaves AND composites ----------
class FileSystemNode {
    constructor(name) {
        this.name = name;
    }

    size() {
        throw new Error("size() must be implemented");
    }

    print(indent) {
        throw new Error("print() must be implemented");
    }

    getName() {
        return this.name;
    }
}

// ---------- Leaf ----------
class File extends FileSystemNode {
    constructor(name, bytes) {
        super(name);
        this.bytes = bytes;
    }

    size() {
        return this.bytes;
    }

    print(indent) {
        console.log(`${indent}- ${this.name} (${this.bytes} B)`);
    }
}

// ---------- Composite ----------
class Directory extends FileSystemNode {
    constructor(name) {
        super(name);
        this.children = [];
    }

    add(child) {
        this.children.push(child);
    }

    // A composite implements the operation by delegating to its children.
    size() {
        let total = 0;

        for (const child of this.children) {
            total += child.size();
        }

        return total;
    }

    print(indent) {
        console.log(
            `${indent}+ ${this.name}/ (${this.size()} B total)`
        );

        for (const child of this.children) {
            child.print(indent + "   ");
        }
    }
}

function main() {
    const root = new Directory("project");
    root.add(new File("README.md", 1200));

    const src = new Directory("src");
    src.add(new File("main.cpp", 800));
    src.add(new File("util.cpp", 1500));
    root.add(src);

    const assets = new Directory("assets");
    assets.add(new File("logo.png", 40000));
    root.add(assets);

    root.print("");

    // Uniform treatment: this call is identical for a file or the whole tree.
    console.log(`Total project size: ${root.size()} B`);

    // JavaScript garbage collection handles memory management.
}

main();
