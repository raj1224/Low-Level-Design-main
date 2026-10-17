'use strict';
// FACADE — one placeOrder() orchestrates inventory -> payment -> shipping ->
// notification, with rollback (release stock) if payment fails. Clients call
// this and never touch the four subsystems or their ordering rules.
class CheckoutFacade {
  constructor(inv, pay, ship, notify) {
    this.inv = inv;
    this.pay = pay;
    this.ship = ship;
    this.notify = notify;
  }

  placeOrder(customer, sku, qty, amount, address, paymentWillSucceed) {
    console.log(`placeOrder(${customer}, ${qty}x ${sku}):`);
    if (!this.inv.reserve(sku, qty)) return this._fail();
    if (!this.pay.charge(customer, amount, paymentWillSucceed)) { this.inv.release(sku, qty); return this._fail(); }
    const tracking = this.ship.schedule(address);
    this.notify.confirm(customer, tracking);
    console.log('  => order placed\n');
    return true;
  }

  _fail() { console.log('  => order failed\n'); return false; }
}

module.exports = { CheckoutFacade };
