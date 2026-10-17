'use strict';
const { ok, fail } = require('./money');

// ----------------------------------------------------------------------------
// TARGET interface — the only thing PaymentService depends on. In JS we express
// an "interface" as a base class that throws if a method isn't implemented.
// ----------------------------------------------------------------------------
class PaymentProcessor {
  /** @returns {{success:boolean, transactionId:string, gateway:string, error:string}} */
  charge(_req) { throw new Error('not implemented'); }
  name() { throw new Error('not implemented'); }
}

// ----------------------------------------------------------------------------
// ADAPTEES — three third-party SDKs we do NOT own. Different method names,
// amount units, and return shapes — and we cannot change any of them.
// ----------------------------------------------------------------------------
class StripeSdk {                              // amounts in MINOR units (cents)
  createCharge(amountInCents, currency, source) {
    console.log(`    (Stripe SDK) createCharge ${amountInCents} ${currency} cents`);
    if (source === 'tok_declined') return { paid: false, id: '', failureCode: 'card_declined' };
    return { paid: true, id: 'ch_' + amountInCents, failureCode: '' };
  }
}

class RazorpaySdk {                            // amounts in PAISE; returns a string
  capturePayment(amountInPaise, currency, method) {
    console.log(`    (Razorpay SDK) capture ${amountInPaise} ${currency} paise via ${method}`);
    if (method === 'tok_declined') return 'status=failed;reason=insufficient_funds';
    return 'status=captured;id=pay_' + amountInPaise;
  }
}

class PayPalSdk {                              // amounts as DECIMAL major units
  executePayment(amountValue, currencyCode, fundingSource) {
    console.log(`    (PayPal SDK) executePayment ${amountValue} ${currencyCode}`);
    if (fundingSource === 'tok_declined') return { state: 'FAILED', txnId: '' };
    return { state: 'APPROVED', txnId: 'PAYID-' + Math.round(amountValue * 100) };
  }
}

// ----------------------------------------------------------------------------
// ADAPTERS — translate our request to each SDK and the reply back. THE pattern.
// Each adapter owns exactly one job: speak its SDK's dialect on our behalf.
// ----------------------------------------------------------------------------
class StripeAdapter extends PaymentProcessor {
  constructor() { super(); this.sdk = new StripeSdk(); }
  charge(req) {
    const c = this.sdk.createCharge(req.amount.minorUnits, req.amount.currency, req.instrument);
    return c.paid ? ok(c.id, this.name()) : fail('Stripe: ' + c.failureCode, this.name());
  }
  name() { return 'Stripe'; }
}

class RazorpayAdapter extends PaymentProcessor {
  constructor() { super(); this.sdk = new RazorpaySdk(); }
  charge(req) {
    const resp = this.sdk.capturePayment(req.amount.minorUnits, req.amount.currency, req.instrument);
    if (resp.includes('status=captured')) {
      const id = resp.substring(resp.indexOf('id=') + 3);
      return ok(id, this.name());
    }
    return fail('Razorpay: ' + resp, this.name());
  }
  name() { return 'Razorpay'; }
}

class PayPalAdapter extends PaymentProcessor {
  constructor() { super(); this.sdk = new PayPalSdk(); }
  charge(req) {
    // PayPal wants MAJOR units — convert from our minor units. Only this adapter
    // knows about that conversion; PaymentService never sees it.
    const t = this.sdk.executePayment(req.amount.major(), req.amount.currency, req.instrument);
    return t.state === 'APPROVED' ? ok(t.txnId, this.name())
                                  : fail('PayPal: payment ' + t.state, this.name());
  }
  name() { return 'PayPal'; }
}

module.exports = {
  PaymentProcessor,
  StripeSdk, RazorpaySdk, PayPalSdk,
  StripeAdapter, RazorpayAdapter, PayPalAdapter,
};
