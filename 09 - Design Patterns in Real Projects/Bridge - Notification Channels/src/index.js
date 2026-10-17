'use strict';
// =============================================================================
// Bridge in a real project — notification type x channel. (Node.js)
//   node src/index.js
//
// Two independent dimensions — WHAT (OTP / Promo) and HOW (Email / SMS / Push) —
// vary separately and combine freely at runtime.
// =============================================================================
const { EmailChannel, SmsChannel, PushChannel } = require('./channels');
const { OtpNotification, PromoNotification } = require('./notifications');

function demo() {
  const email = new EmailChannel(), sms = new SmsChannel(), push = new PushChannel();
  console.log('Any notification type over any channel (mixed at runtime):');
  new OtpNotification(sms, '4827').send('+91-90000-0001');        // OTP over SMS
  new OtpNotification(push, '1234').send('device-9');             // OTP over Push
  new PromoNotification(email, '50% off shoes').send('a@x.com');  // Promo over Email
}

if (require.main === module) demo();

module.exports = { demo };
