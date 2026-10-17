'use strict';
// =============================================================================
// Facade in a real project — e-commerce checkout front door. (Node.js)
//   node src/index.js
//
// Three orders: a happy path, an out-of-stock rejection, and a declined payment
// that rolls back the inventory reservation.
// =============================================================================
const { InventoryService, PaymentService, ShippingService, NotificationService } = require('./services');
const { CheckoutFacade } = require('./checkoutFacade');

function demo() {
  const inv = new InventoryService(), pay = new PaymentService(),
        ship = new ShippingService(), notify = new NotificationService();
  inv.stock('BOOK-42', 1);
  const checkout = new CheckoutFacade(inv, pay, ship, notify);

  checkout.placeOrder('Aarav', 'BOOK-42', 1, 499, '12 MG Road', true);   // happy path
  checkout.placeOrder('Bhavna', 'BOOK-42', 1, 499, '9 Park St', true);   // out of stock
  inv.stock('PEN-7', 5);
  checkout.placeOrder('Chetan', 'PEN-7', 2, 80, '4th Ave', false);       // declined -> rollback
}

if (require.main === module) demo();

module.exports = { demo };
