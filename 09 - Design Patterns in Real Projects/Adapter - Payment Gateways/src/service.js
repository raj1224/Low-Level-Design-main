'use strict';
const { fail } = require('./money');
const { PaymentGatewayFactory } = require('./factory');

// ----------------------------------------------------------------------------
// PAYMENT SERVICE — knows nothing about the SDKs. It depends ONLY on the
// PaymentProcessor interface. It validates the region rules, builds an adapter,
// charges, and falls back to the next allowed gateway on failure.
// ----------------------------------------------------------------------------
class PaymentService {
  constructor() { this.factory = new PaymentGatewayFactory(); }

  pay(region, preferred, req) {
    console.log(`[PaymentService] ${req.customerId} in ${region} paying ` +
                `${req.amount.major()} ${req.amount.currency} (prefers ${preferred})`);

    const order = [];
    if (this.factory.isAllowed(region, preferred)) {
      order.push(preferred);
    } else {
      console.log(`  ! ${preferred} is not permitted in ${region} - using an allowed gateway instead`);
    }
    for (const g of this.factory.allowedFor(region)) {
      if (g !== preferred) order.push(g);
    }

    for (const g of order) {
      const processor = this.factory.create(g);     // the adapter is built here
      console.log(`  -> attempting via ${processor.name()}:`);
      const res = processor.charge(req);
      if (res.success) {
        console.log(`  OK  ${res.gateway} txn=${res.transactionId}\n`);
        return res;
      }
      console.log(`  X   ${res.error} - trying next gateway`);
    }
    console.log('  FAILED on all gateways\n');
    return fail('all gateways failed', '');
  }
}

module.exports = { PaymentService };
