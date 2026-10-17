'use strict';
// =============================================================================
// Factory Method in a real project — notification senders. (Node.js)
//   node src/index.js
//
// Each user has a preferred channel; a concrete NotificationService builds the
// right product and runs the shared notify() workflow.
// =============================================================================
const { serviceFor } = require('./senders');

function demo() {
  const users = [
    { name: 'Aarav',  contact: 'aarav@mail.com', channel: 'email' },
    { name: 'Bhavna', contact: '+91-90000-0001', channel: 'sms' },
    { name: 'Chetan', contact: 'device-token-9', channel: 'push' },
  ];
  console.log("Sending 'Your order shipped' on each user's preferred channel:");
  for (const u of users) serviceFor(u.channel).notify(u.contact, 'Your order shipped');
}

if (require.main === module) demo();

module.exports = { demo };
