
// =============================================================================
// ITERATOR — provide a way to access the elements of a collection sequentially
// WITHOUT exposing its underlying representation. The collection can change its
// internal storage and clients that use the iterator don't care.
//
// Domain: a Playlist. We expose an iterator so clients traverse songs
// (hasNext / next) without knowing it's backed by an array.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Iterator interface (the GoF-style explicit iterator) ----------
class Iterator {
    hasNext() {
        throw new Error("hasNext() must be implemented");
    }

    next() {
        throw new Error("next() must be implemented");
    }
}

// ---------- Aggregate + its concrete iterator ----------
class Playlist {
    constructor() {
        this.songs = [];
    }

    add(song) {
        this.songs.push(song);
    }

    // Concrete iterator: knows the internal layout; clients don't.
    classNotUsed() {} // JavaScript does not support nested class declarations.

    iterator() {
        return new SongIterator(this.songs);
    }

    // Support idiomatic JavaScript for...of traversal.
    [Symbol.iterator]() {
        return this.songs[Symbol.iterator]();
    }
}

// Concrete iterator
class SongIterator extends Iterator {
    constructor(songs) {
        super();
        this.songs = songs;
        this.pos = 0;
    }

    hasNext() {
        return this.pos < this.songs.length;
    }

    next() {
        if (!this.hasNext()) {
            throw new Error("No more songs");
        }

        return this.songs[this.pos++];
    }
}

function main() {
    const pl = new Playlist();

    pl.add("Lose Yourself");
    pl.add("Numb");
    pl.add("Believer");

    console.log("Via explicit iterator (hasNext/next):");

    const it = pl.iterator();
    while (it.hasNext()) {
        console.log(`  - ${it.next()}`);
    }

    console.log("Via JavaScript for...of (same collection):");

    for (const song of pl) {
        console.log(`  * ${song}`);
    }
}

main();
