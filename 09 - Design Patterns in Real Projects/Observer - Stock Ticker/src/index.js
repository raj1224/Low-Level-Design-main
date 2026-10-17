'use strict';
// =============================================================================
// Observer in a real project — a live stock-price ticker. (Node.js)
//   node src/index.js
//
// A dashboard, a moving average, and a price alert all watch INFY. After Aarav
// unsubscribes, his alert no longer fires.
// =============================================================================
const { Stock, PriceAlert, Dashboard, MovingAverage } = require('./stock');

function demo() {
  const infy = new Stock('INFY');
  const aarav = new PriceAlert('Aarav', 1510);
  const dash = new Dashboard();
  const sma = new MovingAverage();

  infy.subscribe(dash);
  infy.subscribe(sma);
  infy.subscribe(aarav);

  infy.setPrice(1500);
  infy.setPrice(1508);
  infy.setPrice(1512);     // crosses Aarav's 1510 alert

  console.log('Aarav closes the app (unsubscribes):');
  infy.unsubscribe(aarav);
  infy.setPrice(1520);     // no alert now
}

if (require.main === module) demo();

module.exports = { demo };
