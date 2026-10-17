'use strict';
// =============================================================================
// Strategy in a real project — a ride-fare pricing engine. (Node.js)
//   node src/index.js
//
// Price the SAME trip three ways by swapping the strategy on one estimator.
// =============================================================================
const { NormalPricing, SurgePricing, SubscriptionPricing, FareEstimator } = require('./pricing');

function demo() {
  const trip = { distanceKm: 8.0, durationMin: 22 };
  console.log('Pricing the same trip (8 km, 22 min):');
  const est = new FareEstimator();
  est.setStrategy(new NormalPricing());        est.estimate(trip);
  est.setStrategy(new SurgePricing(1.8));      est.estimate(trip);
  est.setStrategy(new SubscriptionPricing());  est.estimate(trip);
}

if (require.main === module) demo();

module.exports = { demo };
