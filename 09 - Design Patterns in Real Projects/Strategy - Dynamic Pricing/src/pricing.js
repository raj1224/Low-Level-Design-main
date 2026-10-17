'use strict';
// STRATEGY — interchangeable fare policies for the same trip. The estimator
// depends only on a fare(trip) + name() contract, so pricing can switch at
// runtime (normal vs surge vs member subscription).
const BASE = 30.0, PER_KM = 12.0, PER_MIN = 1.5;
const meter = (t) => BASE + PER_KM * t.distanceKm + PER_MIN * t.durationMin;

class NormalPricing {
  fare(t) { return meter(t); }
  name() { return 'Normal'; }
}
class SurgePricing {
  constructor(mult) { this.mult = mult; }
  fare(t) { return meter(t) * this.mult; }
  name() { return `Surge x${this.mult}`; }
}
class SubscriptionPricing {
  // Members: no base fare + 10% off the metered ride.
  fare(t) { return (PER_KM * t.distanceKm + PER_MIN * t.durationMin) * 0.9; }
  name() { return 'Subscription (member)'; }
}

class FareEstimator {
  setStrategy(s) { this.strategy = s; }
  estimate(t) {
    const f = this.strategy.fare(t);
    console.log(`  ${this.strategy.name()}: Rs ${f}`);
    return f;
  }
}

module.exports = { NormalPricing, SurgePricing, SubscriptionPricing, FareEstimator };
