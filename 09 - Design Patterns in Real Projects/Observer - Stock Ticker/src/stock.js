'use strict';
// OBSERVER — a live stock-price ticker. The Stock is the subject; on each price
// change it broadcasts to every subscriber. Observers are duck-typed: anything
// with onPrice(symbol, price) can subscribe.

// ---- Subject ----
class Stock {
  constructor(symbol) { this.symbol = symbol; this.price = 0; this.observers = []; }
  subscribe(o) { this.observers.push(o); }
  unsubscribe(o) { this.observers = this.observers.filter((x) => x !== o); }
  setPrice(price) {
    this.price = price;
    console.log(`${this.symbol} @ Rs ${price}`);
    for (const o of this.observers) o.onPrice(this.symbol, price);   // broadcast
  }
}

// ---- Observers ----
class PriceAlert {
  constructor(who, threshold) { this.who = who; this.threshold = threshold; }
  onPrice(symbol, price) {
    if (price >= this.threshold)
      console.log(`    [alert -> ${this.who}] ${symbol} crossed Rs ${this.threshold} (now ${price})`);
  }
}
class Dashboard {
  onPrice(symbol, price) { console.log(`    [dashboard] tick ${symbol}=${price}`); }
}
class MovingAverage {
  constructor() { this.sum = 0; this.n = 0; }
  onPrice(_symbol, price) {
    this.sum += price; this.n += 1;
    console.log(`    [SMA] avg over ${this.n} ticks = ${this.sum / this.n}`);
  }
}

module.exports = { Stock, PriceAlert, Dashboard, MovingAverage };
