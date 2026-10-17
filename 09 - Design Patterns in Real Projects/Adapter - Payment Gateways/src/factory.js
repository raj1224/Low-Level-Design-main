'use strict';
const { Region, GatewayId } = require('./money');
const { StripeAdapter, RazorpayAdapter, PayPalAdapter } = require('./processors');

// ----------------------------------------------------------------------------
// FACTORY + region policy. The "region -> allowed gateways" rule lives as DATA
// (a map), not as scattered if-statements, so adding a region or gateway is a
// one-line change.
// ----------------------------------------------------------------------------
class PaymentGatewayFactory {
  constructor() {
    this.allowed = {
      [Region.India]:  [GatewayId.Razorpay, GatewayId.Stripe],
      [Region.USA]:    [GatewayId.Stripe, GatewayId.PayPal],
      [Region.Europe]: [GatewayId.Stripe, GatewayId.PayPal],
    };
  }
  allowedFor(region) { return this.allowed[region]; }
  isAllowed(region, gateway) { return this.allowed[region].includes(gateway); }
  create(gateway) {
    switch (gateway) {
      case GatewayId.Stripe:   return new StripeAdapter();
      case GatewayId.Razorpay: return new RazorpayAdapter();
      default:                 return new PayPalAdapter();
    }
  }
}

module.exports = { PaymentGatewayFactory };
