
// =============================================================================
// POLYMORPHISM — "many forms". The SAME call behaves correctly for the actual
// object behind it. There are two flavours, both shown below:
//
//   1. STATIC (compile-time): In C++, function overloading & templates. The
//      compiler picks the correct version from the argument types.
//      JavaScript does NOT support traditional compile-time function overloading
//      or C++-style templates.
//
//   2. DYNAMIC (run-time): The correct method implementation is selected based
//      on the actual object. This is the kind that powers many design patterns
//      in this course.
//
// Real-world analogy: you press "send" in your phone. Email, SMS and Push all
// understand "send", but each performs it in its own way. Your code just says
// send(); the right behaviour happens based on which channel object you hold.
//
// Run:
//   node polymorphism.js
// =============================================================================

// ---------- STATIC POLYMORPHISM: C++-style overloading alternative ----------
// JavaScript doesn't choose overloaded functions by argument type.
// We can simulate similar behaviour with typeof checks.

function asLabel(value) {
  if (typeof value === "number") {
    // Number.isInteger() distinguishes integer numbers from decimal numbers
    if (Number.isInteger(value)) {
      return `int(${value})`;
    }

    return `double(${value})`;
  }

  if (typeof value === "string") {
    return `string("${value}")`;
  }

  throw new TypeError("Unsupported value type");
}

// C++ template alternative: JavaScript functions can work with multiple types.
// The comparison operator works for compatible values.
function maxOf(a, b) {
  return a > b ? a : b;
}

// ---------- DYNAMIC POLYMORPHISM: method overriding --------------------------
// Parent class defines a common contract.
// Each child class implements send() in its own way.

class Notifier {
  send(msg) {
    // JavaScript doesn't enforce abstract methods automatically.
    // Throw an error if a subclass doesn't override send().
    throw new Error("send() must be implemented by a subclass");
  }
}

// EmailNotifier IS-A Notifier
class EmailNotifier extends Notifier {
  send(msg) {
    // Email-specific behaviour
    console.log(`  [EMAIL] ${msg}`);
  }
}

// SmsNotifier IS-A Notifier
class SmsNotifier extends Notifier {
  send(msg) {
    // SMS-specific behaviour
    console.log(`  [SMS]   ${msg}`);
  }
}

// PushNotifier IS-A Notifier
class PushNotifier extends Notifier {
  send(msg) {
    // Push notification-specific behaviour
    console.log(`  [PUSH]  ${msg}`);
  }
}

// Written ONCE using the common interface.
// Works with current and future Notifier subclasses without changing this function.
function broadcast(channels, msg) {
  for (const channel of channels) {
    // JavaScript selects send() based on the actual object's implementation
    channel.send(msg);
  }
}

// =============================================================================
// MAIN PROGRAM
// =============================================================================

console.log("Static polymorphism (overloading alternative):");

// Label different values
console.log(`  ${asLabel(42)}`);
console.log(`  ${asLabel(3.14)}`);
console.log(`  ${asLabel("hello")}`);

// Find the maximum of two values
console.log(`  maxOf(3, 9)     = ${maxOf(3, 9)}`);
console.log(`  maxOf(2.5, 1.5) = ${maxOf(2.5, 1.5)}`);

console.log("");

// Dynamic polymorphism: virtual dispatch equivalent
console.log("Dynamic polymorphism (method overriding):");

// Store different notifier objects in the same array
const channels = [
  new EmailNotifier(),
  new SmsNotifier(),
  new PushNotifier()
];

// Send the same message through every notification channel
broadcast(channels, "Your OTP is 4827");

// JavaScript automatically manages object memory through garbage collection.
// No manual delete is required.
