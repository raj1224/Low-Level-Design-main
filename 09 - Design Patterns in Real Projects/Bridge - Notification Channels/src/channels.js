'use strict';
// IMPLEMENTOR side of the Bridge — the delivery channel. A channel knows nothing
// about WHAT is being sent, only HOW to deliver some text.
class EmailChannel { deliver(to, text) { console.log(`    [email -> ${to}] ${text}`); } }
class SmsChannel   { deliver(to, text) { console.log(`    [sms -> ${to}] ${text}`); } }
class PushChannel  { deliver(to, text) { console.log(`    [push -> ${to}] ${text}`); } }
module.exports = { EmailChannel, SmsChannel, PushChannel };
