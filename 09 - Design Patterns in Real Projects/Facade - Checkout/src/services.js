'use strict';
// The four independent SUBSYSTEMS that a checkout touches. Each is messy in its
// own way; the facade hides all of them behind one call.
class InventoryService {
  constructor() { this.stockMap = {}; }
  stock(sku, qty) { this.stockMap[sku] = qty; }
  reserve(sku, qty) {
    if ((this.stockMap[sku] || 0) < qty) { console.log(`    [inventory] insufficient stock of ${sku}`); return false; }
    this.stockMap[sku] -= qty;
    console.log(`    [inventory] reserved ${qty} x ${sku}`);
    return true;
  }
  release(sku, qty) { this.stockMap[sku] += qty; console.log(`    [inventory] released ${qty} x ${sku} (rollback)`); }
}

class PaymentService {
  charge(customer, amount, willSucceed) {
    console.log(`    [payment] charging ${customer} Rs ${amount} -> ${willSucceed ? 'OK' : 'DECLINED'}`);
    return willSucceed;
  }
}

class ShippingService {
  constructor() { this.n = 0; }
  schedule(address) { console.log(`    [shipping] scheduled to ${address}`); return 'TRK' + (++this.n); }
}

class NotificationService {
  confirm(customer, tracking) { console.log(`    [notify] ${customer}: order confirmed, track ${tracking}`); }
}

module.exports = { InventoryService, PaymentService, ShippingService, NotificationService };
