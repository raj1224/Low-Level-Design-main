
/*
=============================================================================
02 — WHY LLD? (AND WHAT HAPPENS WITHOUT IT)

Section 01 defined LLD. This section makes you feel why it matters:
we build a product WITHOUT any design and watch it collapse under its
own success, then show how each LLD tool could have prevented the collapse.

We'll build WhatsApp.
=============================================================================
*/

// ============================================================================
// ACT 1 — "IT'S JUST A CHAT APP." (WEEK 1)
// ============================================================================

// The requirement is tiny: let user A send a text message to user B.
// A pragmatic engineer writes one class that does everything.

// The entire app, version 1. Ships Friday. Everyone's happy.

class SimpleChatApp {
  constructor(db, socket) {
    this.db = db;
    this.socket = socket;
  }

  sendMessage(from, to, text) {
    // Validate.
    if (!text) return;

    // Store in DB.
    this.db.insert("messages", from, to, text);

    // Push over the socket.
    this.socket.send(to, text);

    // Log.
    console.log(`${from} -> ${to}: ${text}`);
  }
}

/*
It works. It ships.

There is nothing wrong with this code for the requirement it has.
Premature design would be over-engineering.

LLD pain is a function of growth — so let's grow.
*/

// ============================================================================
// ACT 2 — GROWTH OF FEATURES (MONTH 3)
// ============================================================================

/*
Product wants:
- Group chats
- Image/video messages
- Read receipts ("blue ticks")
- Online/last-seen status

Each one, added the fastest way, lands inside ChatApp.
*/

class GrowingChatApp {
  constructor(db, socket) {
    this.db = db;
    this.socket = socket;
  }

  sendMessage(
    from,
    to,
    text,
    type,
    isGroup,
    groupMembers,
    mediaUrl,
    needsReadReceipt
    // ...and growing parameters
  ) {
    if (type === "text") {
      // Validate text messages.
      if (!text) return;
    } else if (type === "image" || type === "video") {
      // Validate media.
      if (!mediaUrl) return;

      // Added for media: scan for viruses.
      if (!this.virusScan(mediaUrl)) return;

      // Added for media: compress and upload.
      mediaUrl = this.compressAndUpload(mediaUrl);
    } else if (type === "audio") {
      // Audio-specific validation and processing would go here.
    }

    if (isGroup) {
      // Deliver the message to every group member.
      for (const member of groupMembers) {
        this.db.insert("messages", from, member, text);
        this.socket.send(member, text);

        // Blue ticks: mark unread for this recipient.
        if (needsReadReceipt) {
          this.markUnread(from, member);
        }
      }
    } else {
      // One-to-one delivery.
      this.db.insert("messages", from, to, text);
      this.socket.send(to, text);

      if (needsReadReceipt) {
        this.markUnread(from, to);
      }
    }

    // Added for the status feature.
    this.updateLastSeen(from);

    // Logging, analytics, push notifications and encryption
    // all pile in here too.
  }

  // Demo placeholders; real implementations would scan/process media.
  virusScan(mediaUrl) {
    return Boolean(mediaUrl);
  }

  compressAndUpload(mediaUrl) {
    return mediaUrl;
  }

  markUnread(from, to) {
    console.log(`Marked unread: ${from} -> ${to}`);
  }

  updateLastSeen(userId) {
    console.log(`Last seen updated: ${userId}`);
  }
}

/*
That method signature is now a horror, and the body is a maze of if/else.

This is the GOD CLASS anti-pattern: one class that knows everything
and does everything.

Symptoms appear fast:

- It's unreadable. A new hire opening sendMessage() has to understand
  media handling, group fan-out, receipts and status all at once just
  to fix a typo in text validation.

- Every feature is a parameter. The signature grows forever; callers pass
  "", false, {} for the parts they don't use.
*/

// ============================================================================
// ACT 3 — GROWTH OF USERS -> GROWTH OF ENGINEERS (MONTH 9)
// ============================================================================

/*
Now there are 12 engineers, and the real damage of no LLD shows up.
It's not about CPU — it's about humans editing the same code.

PAIN #1 — RIPPLE-EFFECT BUGS
Someone tweaks media compression. They edit sendMessage(). They ship.
Text messages break in group chats because the media branch shared a
variable with the group branch.

The blast radius of every change is the entire class. Nobody can reason
about "if I change X, what else breaks?" because everything is coupled
to everything.

PAIN #2 — MERGE HELL
Three engineers add three features (stickers, polls, disappearing messages)
in the same sprint. All three edit sendMessage(). Their Git merges conflict
on the same 200-line method. Hours are lost reconciling edits, and the
reconciliation itself introduces bugs.

PAIN #3 — IMPOSSIBLE TO TEST
You want to unit-test "does an empty text get rejected?" But to construct
ChatApp you need a real db and a real socket. Validation is welded to the
database and network. So nobody writes tests, so regressions ship freely.

PAIN #4 — CAN'T ADD A FEATURE WITHOUT FEAR
Product asks for a new payment-message type (WhatsApp Pay). The honest
estimate is "two days to build it, three more to make sure we didn't break
the other nine message types." Velocity has collapsed. The codebase
actively resists change.

This is the real tax of skipping LLD: the cost of every future feature
goes up forever.

SCALING NOTE
People assume "scale" means servers. The first wall you hit when you scale
a product is almost always this design wall, not a hardware wall.
More users -> more features -> more engineers -> an undesigned codebase
grinds the whole team to a halt long before the database does.
*/

// ============================================================================
// ACT 4 — HOW LLD DISSOLVES EACH PAIN
// ============================================================================

/*
Here's the same system, designed. We don't add magic — we apply the tools
the rest of this course teaches.

DESIGN OVERVIEW:

MessageService
  -> Message
       -> TextMessage
       -> MediaMessage
       -> PaymentMessage
  -> DeliveryStrategy
       -> DirectDelivery
       -> GroupDelivery
  -> MessageRepository
  -> MessageObserver
       -> ReadReceiptObserver
       -> PushNotifier
       -> LastSeenUpdater

Pain -> Tool -> Why it is gone:

- if (type == ...) for each message kind
  -> Polymorphism + Factory (Message types)
  -> Adding WhatsApp Pay can mean adding one new class. MessageService
     does not need a new payment-specific branch. (Open/Closed Principle)

- if (isGroup) fan-out logic mixed in
  -> Strategy (DirectDelivery vs GroupDelivery)
  -> Delivery is swappable and isolated.

- Read receipts, push, last-seen all crammed into send()
  -> Observer
  -> Each side-effect is its own observer. Adding analytics can mean
     adding an observer; send() stays untouched.

- Can't test without a real DB/socket
  -> Dependency Inversion (depend on repository/socket abstractions)
  -> In tests, pass a fake repository or socket.

- God Class doing everything
  -> Single Responsibility Principle
  -> Each class has one reason to change.

- Merge hell on one 200-line method
  -> All of the above
  -> Engineers can work on different components/files.

JavaScript doesn't enforce interfaces like C++ pure virtual classes.
Here, base classes and overridden methods demonstrate the same idea.
*/

// ---------------------------------------------------------------------------
// 1. MESSAGE ABSTRACTION + POLYMORPHISM
// ---------------------------------------------------------------------------

class Message {
  constructor(from) {
    this.from = from;
  }

  // Every message type must validate itself.
  validate() {
    throw new Error("validate() must be implemented by a subclass");
  }

  // Convert the message into a plain object for storage/delivery.
  serialize() {
    throw new Error("serialize() must be implemented by a subclass");
  }
}

class TextMessage extends Message {
  constructor(from, text) {
    super(from);
    this.text = text;
  }

  validate() {
    return typeof this.text === "string" && this.text.trim().length > 0;
  }

  serialize() {
    return {
      from: this.from,
      type: "text",
      text: this.text,
    };
  }
}

class MediaMessage extends Message {
  constructor(from, mediaUrl) {
    super(from);
    this.mediaUrl = mediaUrl;
  }

  validate() {
    return (
      typeof this.mediaUrl === "string" &&
      this.mediaUrl.trim().length > 0
    );
  }

  serialize() {
    return {
      from: this.from,
      type: "media",
      mediaUrl: this.mediaUrl,
    };
  }
}

class PaymentMessage extends Message {
  constructor(from, amount) {
    super(from);
    this.amount = amount;
  }

  validate() {
    return Number.isFinite(this.amount) && this.amount > 0;
  }

  serialize() {
    return {
      from: this.from,
      type: "payment",
      amount: this.amount,
    };
  }
}

// ---------------------------------------------------------------------------
// 2. DELIVERY STRATEGY — STRATEGY PATTERN
// ---------------------------------------------------------------------------

class DeliveryStrategy {
  // Child classes provide the actual delivery behavior.
  deliver(message, recipients) {
    throw new Error("deliver() must be implemented by a subclass");
  }
}

class DirectDelivery extends DeliveryStrategy {
  constructor(socket) {
    super();
    this.socket = socket;
  }

  deliver(message, recipients) {
    // Direct delivery sends to one recipient.
    const recipient = recipients[0];

    if (recipient) {
      this.socket.send(recipient, message.serialize());
    }
  }
}

class GroupDelivery extends DeliveryStrategy {
  constructor(socket) {
    super();
    this.socket = socket;
  }

  deliver(message, recipients) {
    // Group delivery sends the message to every recipient.
    for (const recipient of recipients) {
      this.socket.send(recipient, message.serialize());
    }
  }
}

// ---------------------------------------------------------------------------
// 3. MESSAGE REPOSITORY — DEPENDENCY INVERSION
// ---------------------------------------------------------------------------

// MessageService depends on the save() contract, not a specific database.
// JavaScript cannot enforce this contract at compile time.

class MessageRepository {
  save(message) {
    throw new Error("save() must be implemented by a subclass");
  }
}

// In-memory demo repository. A real implementation could use a database.
class InMemoryMessageRepository extends MessageRepository {
  constructor() {
    super();
    this.messages = [];
  }

  save(message) {
    this.messages.push(message.serialize());
    console.log("Message saved");
  }
}

// ---------------------------------------------------------------------------
// 4. MESSAGE OBSERVERS — OBSERVER PATTERN
// ---------------------------------------------------------------------------

// Every observer reacts when a message is sent.
class MessageObserver {
  onMessageSent(message) {
    throw new Error("onMessageSent() must be implemented by a subclass");
  }
}

class ReadReceiptObserver extends MessageObserver {
  onMessageSent(message) {
    // In a real app, initialize receipt tracking for the message.
    console.log("Read-receipt tracking started");
  }
}

class PushNotifier extends MessageObserver {
  onMessageSent(message) {
    // In a real app, send push notifications to recipients.
    console.log("Push notification triggered");
  }
}

class LastSeenUpdater extends MessageObserver {
  onMessageSent(message) {
    // Demo behavior: show that the sender's status was updated.
    console.log(`Last seen updated for ${message.from}`);
  }
}

// ---------------------------------------------------------------------------
// 5. MESSAGESERVICE — THE ORCHESTRATOR
// ---------------------------------------------------------------------------

class MessageService {
  constructor(repository, deliveryStrategy, observers = []) {
    // Dependencies are passed in instead of created inside this class.
    this.repository = repository;
    this.deliveryStrategy = deliveryStrategy;
    this.observers = observers;
  }

  send(message, recipients) {
    // Each Message type validates itself.
    if (!message.validate()) {
      console.log("Invalid message; sending cancelled");
      return;
    }

    // Depends on an abstraction, not a concrete DB.
    this.repository.save(message);

    // Direct or group delivery is swappable.
    this.deliveryStrategy.deliver(message, recipients);

    // Receipts, push, last-seen, analytics...
    // Each side effect is handled by its own observer.
    for (const observer of this.observers) {
      observer.onMessageSent(message);
    }
  }
}

// ---------------------------------------------------------------------------
// 6. DEMO — WIRING THE COMPONENTS TOGETHER
// ---------------------------------------------------------------------------

// Fake socket: simulates network delivery without a real socket connection.
const socket = {
  send(to, message) {
    console.log(`Delivered to ${to}:`, message);
  },
};

const repository = new InMemoryMessageRepository();

const observers = [
  new ReadReceiptObserver(),
  new PushNotifier(),
  new LastSeenUpdater(),
];

// Choose direct delivery for one-to-one messages.
const directService = new MessageService(
  repository,
  new DirectDelivery(socket),
  observers
);

console.log("\n--- Direct message ---");

directService.send(
  new TextMessage("Raj", "Hello Aman!"),
  ["Aman"]
);

// Switch to group delivery without changing MessageService.
const groupService = new MessageService(
  repository,
  new GroupDelivery(socket),
  observers
);

console.log("\n--- Group message ---");

groupService.send(
  new TextMessage("Raj", "Hello group!"),
  ["Aman", "Riya", "Sam"]
);

// Adding WhatsApp Pay: create a PaymentMessage.
// MessageService.send() itself does not need a payment-specific if/else.
console.log("\n--- Payment message ---");

directService.send(
  new PaymentMessage("Raj", 500),
  ["Aman"]
);

// Invalid messages are rejected by their own validation.
console.log("\n--- Invalid text message ---");

directService.send(
  new TextMessage("Raj", "   "),
  ["Aman"]
);

// ============================================================================
// THE REDESIGNED send() METHOD IS BORING — WHICH IS THE GOAL
// ============================================================================

/*
Original C++ concept:

void MessageService::send(std::unique_ptr<Message> msg) {
    if (!msg->validate()) return;
    repository_->save(*msg);
    deliveryStrategy_->deliver(*msg);
    for (auto* obs : observers_)
        obs->onMessageSent(*msg);
}

JavaScript equivalent is the MessageService.send() method above:

send(message, recipients) {
    if (!message.validate()) return;
    this.repository.save(message);
    this.deliveryStrategy.deliver(message, recipients);
    for (const observer of this.observers) {
        observer.onMessageSent(message);
    }
}

Every branch that used to live in the large method now lives behind
a polymorphic boundary. The method stopped being a battleground.
*/

// ============================================================================
// THE ONE-SLIDE SUMMARY
// ============================================================================

/*
NO LLD
  -> Growth: users, features, engineers
  -> God classes
  -> Ripple bugs
  -> Merge hell
  -> Untestable code
  -> Feature velocity approaches zero
  -> THE DESIGN WALL

WITH LLD
  -> SOLID + Design Patterns
  -> One class, one job
  -> Change = add a class where appropriate
  -> Isolated, parallel work
  -> Injected dependencies = testable code
  -> Velocity stays high
*/

// ============================================================================
// SO... SHOULD YOU ALWAYS DO HEAVY LLD?
// ============================================================================

/*
No.

LLD is insurance against change, and insurance has a cost.

Version 1 of the chat app was correct to be simple.

The skill is recognizing the inflection point:
- A class starts attracting if/else for every new feature.
- A method's signature won't stop growing.
- Two people keep colliding in the same file.

That's the moment to introduce the right abstraction, and not a moment before.
Premature abstraction is its own anti-pattern, covered in Section 05.

The rest of this course teaches you to see those inflection points
and know exactly which tool removes the pain.
*/

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/*
- Bad design doesn't hurt on day one; it hurts when the product grows
  (features, users, engineers).

- The first wall a growing product hits is usually a design wall,
  not a hardware wall.

- The concrete symptoms — god classes, ripple bugs, merge hell,
  untestability and dying velocity — each map to an LLD remedy:
  SRP, OCP, Strategy, Observer and DIP.

- LLD is insurance against change:
  apply it where change is likely, skip it where it isn't.

NEXT: 03 — OOP Fundamentals
=============================================================================
*/
