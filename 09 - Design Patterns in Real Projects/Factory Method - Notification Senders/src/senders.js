'use strict';
// FACTORY METHOD — notification senders. The creator defines a factory method
// (createNotification) plus a shared workflow (notify); each concrete creator
// decides which product to build.

// ---- Products ----
class EmailNotification { send(to, m) { console.log(`    [email -> ${to}] ${m}`); } }
class SmsNotification   { send(to, m) { console.log(`    [sms -> ${to}] ${m}`); } }
class PushNotification  { send(to, m) { console.log(`    [push -> ${to}] ${m}`); } }

// ---- Creator: factory method + shared workflow ----
class NotificationService {
  createNotification() { throw new Error('not implemented'); }   // factory method
  channelTag() { throw new Error('not implemented'); }
  notify(to, message) {
    const n = this.createNotification();
    n.send(to, `[${this.channelTag()}] ${message}`);
  }
}

// ---- Concrete creators ----
class EmailService extends NotificationService {
  createNotification() { return new EmailNotification(); }
  channelTag() { return 'EMAIL'; }
}
class SmsService extends NotificationService {
  createNotification() { return new SmsNotification(); }
  channelTag() { return 'SMS'; }
}
class PushService extends NotificationService {
  createNotification() { return new PushNotification(); }
  channelTag() { return 'PUSH'; }
}

// A tiny resolver mapping a user's preferred channel to a concrete creator.
function serviceFor(channel) {
  if (channel === 'sms') return new SmsService();
  if (channel === 'push') return new PushService();
  return new EmailService();
}

module.exports = {
  EmailNotification, SmsNotification, PushNotification,
  NotificationService, EmailService, SmsService, PushService, serviceFor,
};
