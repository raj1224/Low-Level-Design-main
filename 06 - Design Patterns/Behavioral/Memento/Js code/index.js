
// =============================================================================
// MEMENTO — capture an object's internal state in a separate object (the
// memento) so it can be restored later, WITHOUT exposing the object's internals.
// This is how undo / checkpoint features are built.
//
// Domain: a text editor. It can save snapshots and undo back to them. The
// snapshot (Memento) is opaque to everyone except the editor — the history
// keeper stores it but can't read or tamper with the editor's private state.
//
// Build & run:
//   node example.js
// =============================================================================

// ---------- Memento: opaque state holder ----------
// Only TextEditor can create a memento and read its content.
// The caretaker can hold a memento but cannot inspect its private state.
class EditorMemento {
    #state;

    constructor(state, secret) {
        if (secret !== TextEditor.mementoSecret) {
            throw new Error("Mementos can only be created by TextEditor");
        }

        this.#state = state;
        Object.freeze(this);
    }

    getState(secret) {
        if (secret !== TextEditor.mementoSecret) {
            throw new Error("Access denied");
        }

        return this.#state;
    }
}

// ---------- Originator: the object whose state we snapshot ----------
class TextEditor {
    static mementoSecret = Symbol("mementoSecret");

    #content = "";

    type(words) {
        this.#content += words;
    }

    getContent() {
        return this.#content;
    }

    save() {
        return new EditorMemento(this.#content, TextEditor.mementoSecret);
    }

    restore(memento) {
        this.#content = memento.getState(TextEditor.mementoSecret);
    }
}

// ---------- Caretaker: keeps the history, never peeks inside a memento ----------
class History {
    #snapshots = [];

    push(memento) {
        this.#snapshots.push(memento);
    }

    pop() {
        if (this.empty()) {
            throw new Error("No snapshots available");
        }

        return this.#snapshots.pop();
    }

    empty() {
        return this.#snapshots.length === 0;
    }
}

function main() {
    const editor = new TextEditor();
    const history = new History();

    editor.type("Hello");
    history.push(editor.save()); // checkpoint 1

    editor.type(", world");
    history.push(editor.save()); // checkpoint 2

    editor.type("!!! (oops, too much)");
    console.log("  current : " + editor.getContent());

    editor.restore(history.pop()); // undo to checkpoint 2
    console.log("  undo -> : " + editor.getContent());

    editor.restore(history.pop()); // undo to checkpoint 1
    console.log("  undo -> : " + editor.getContent());
}

main();
