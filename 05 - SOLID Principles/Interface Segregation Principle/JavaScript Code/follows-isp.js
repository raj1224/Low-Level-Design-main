/*
INTERFACE SEGREGATION PRINCIPLE (ISP) — FOLLOWS

"No client should be forced to depend on methods it does not use."

Prefer small, focused capabilities: Printer, Scanner, Fax.
JavaScript has no built-in interface keyword, so these
capabilities are represented by the methods each object offers.
*/

class BasicPrinter {
    print(document) {
        console.log(`[print] ${document}`);
    }
}

class OfficeMachine {
    print(document) {
        console.log(`[print] ${document}`);
    }

    scan(document) {
        console.log(`[scan] ${document}`);
    }

    fax(document) {
        console.log(`[fax] ${document}`);
    }
}

// Each function depends only on the capability it needs.
function printDocument(printer, document) {
    if (typeof printer.print !== "function") {
        throw new TypeError("A Printer must provide print()");
    }

    printer.print(document);
}

function scanDocument(scanner, document) {
    if (typeof scanner.scan !== "function") {
        throw new TypeError("A Scanner must provide scan()");
    }

    scanner.scan(document);
}

const basicPrinter = new BasicPrinter();
const officeMachine = new OfficeMachine();

printDocument(basicPrinter, "invoice.pdf");
printDocument(officeMachine, "contract.pdf");
scanDocument(officeMachine, "id-proof.jpg");

/*
EXPECTED OUTPUT:
[print] invoice.pdf
[print] contract.pdf
[scan] id-proof.jpg

WHY THIS IS BETTER:
- A basic printer only needs print().
- A scanner-capable device provides scan().
- Each client asks for exactly the capability it needs.
*/
