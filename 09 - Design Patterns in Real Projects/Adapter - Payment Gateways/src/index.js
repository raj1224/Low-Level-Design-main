'use strict';
// =============================================================================
// ADAPTER in a real project — a multi-region Payment Service. (Node.js)
//   node src/index.js
//
// ONE target interface (PaymentProcessor) our service depends on; three
// incompatible third-party SDKs (Stripe=cents, Razorpay=paise, PayPal=decimal
// dollars) we cannot change; one ADAPTER per SDK that translates to/from our
// interface; a factory + region policy decide which gateways are allowed where.
// =============================================================================
const { Region, GatewayId, money } = require('./money');
const { PaymentService } = require('./service');

function demo() {
  const service = new PaymentService();

  // 1) India + Razorpay (allowed) -> success (amount handed to SDK in paise).
  service.pay(Region.India, GatewayId.Razorpay,
    { idempotencyKey: 'idem-1', customerId: 'cust_in_01', amount: money(49900, 'INR'), instrument: 'upi' });

  // 2) US asks for Razorpay (not allowed in the US) -> falls back to Stripe.
  service.pay(Region.USA, GatewayId.Razorpay,
    { idempotencyKey: 'idem-2', customerId: 'cust_us_02', amount: money(1999, 'USD'), instrument: 'card' });

  // 3) EU + PayPal with a DECLINED instrument -> terminal failure (a hard
  //    decline is declined everywhere). See Notes on retryable vs terminal.
  service.pay(Region.Europe, GatewayId.PayPal,
    { idempotencyKey: 'idem-3', customerId: 'cust_eu_03', amount: money(8050, 'EUR'), instrument: 'tok_declined' });
}

if (require.main === module) demo();

module.exports = { demo };
