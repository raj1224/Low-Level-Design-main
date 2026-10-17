'use strict';
// ABSTRACTION side of the Bridge — the notification TYPE. It holds a reference to
// a Channel (the bridge) and composes the message; delivery is delegated. Type
// and channel vary independently — no OtpEmail/OtpSms/PromoEmail... explosion.
class Notification {
  constructor(channel) { this.channel = channel; }   // THE BRIDGE
  send(_to) { throw new Error('abstract'); }
}

class OtpNotification extends Notification {
  constructor(channel, code) { super(channel); this.code = code; }
  send(to) { this.channel.deliver(to, `Your OTP is ${this.code}. Do not share it.`); }
}

class PromoNotification extends Notification {
  constructor(channel, offer) { super(channel); this.offer = offer; }
  send(to) { this.channel.deliver(to, `Limited offer: ${this.offer} 🎉`); }
}

module.exports = { Notification, OtpNotification, PromoNotification };
