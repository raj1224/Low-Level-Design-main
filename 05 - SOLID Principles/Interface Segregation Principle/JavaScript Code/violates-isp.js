/*
INTERFACE SEGREGATION PRINCIPLE (ISP) — VIOLATION

"No client should be forced to depend on methods it does not use."

JavaScript does not have a built-in interface keyword, but
the same problem can happen when code expects one large
object contract containing print(), scan(), and fax().
*/

class SimplePrinter {
    print(document) {
        console.log(`[print] ${document}`);
    }

    scan() {
        throw new Error("Scan not supported");
    }

    fax() {
        throw new Error("Fax not supported");
    }
}

function printDocument(device, document) {
    device.print(document);
}

const printer = new SimplePrinter();

printDocument(printer, "invoice.pdf");

try {
    printer.scan();
} catch (error) {
    console.log(`Problem: ${error.message}`);
}

/*
PROBLEM:
The SimplePrinter is forced to provide scan() and fax()
even though it does not support those capabilities.
Callers cannot safely assume every device supports them.
*/
