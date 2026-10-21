
// =============================================================================
// PROXY — provide a surrogate/placeholder for another object to control access
// to it. The proxy implements the SAME interface as the real object, so clients
// can't tell the difference — but it can add lazy-loading, access control,
// caching, or logging around the real call.
//
// Domain: a document viewer shows many high-resolution images. Loading every
// image up front is wasteful. A VIRTUAL proxy defers the expensive load until
// the image is actually displayed for the first time.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Subject: the shared interface ----------
class Image {
    display() {
        throw new Error("display() must be implemented");
    }
}

// ---------- Real subject: expensive to create ----------
class HighResImage extends Image {
    constructor(file) {
        super();
        this.file = file;
        this.loadFromDisk(); // the costly operation
    }

    loadFromDisk() {
        console.log(
            `  [disk] loading large image ${this.file} ... done`
        );
    }

    display() {
        console.log(`  showing ${this.file}`);
    }
}

// ---------- Virtual proxy: same interface, defers the real load ----------
class ImageProxy extends Image {
    constructor(file) {
        super();
        this.file = file;
        this.real = null; // null until first display()
    }

    display() {
        if (this.real === null) {
            this.real = new HighResImage(this.file);
        }

        this.real.display();
    }
}

function main() {
    console.log(
        "Opening document with 3 images (note: no disk loads yet):"
    );

    const img1 = new ImageProxy("photo1.png");
    const img2 = new ImageProxy("photo2.png");
    const img3 = new ImageProxy("photo3.png"); // never viewed

    console.log("\nUser scrolls to image 1:");
    img1.display(); // loads now

    console.log("User scrolls back to image 1 again:");
    img1.display(); // already loaded — no second disk hit

    console.log("User scrolls to image 2:");
    img2.display(); // loads now

    console.log(
        "\n(photo3 was never displayed, so it was never loaded.)"
    );
}

main();
