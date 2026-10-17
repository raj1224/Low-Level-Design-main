'use strict';
// =============================================================================
// Singleton in a real project — shared Logger + ConfigManager. (Node.js)
//   node src/index.js
//
// Two unrelated "modules" both `require` the same logger/config and see the same
// state — including a log-level change made app-wide.
// =============================================================================
const { logger, config, LEVELS } = require('./logger');

// Two unrelated "modules" reaching the shared singletons.
function paymentModule() { logger.info(`charging via ${config.get('gateway')}`); }
function shippingModule() { logger.warn(`no couriers in region ${config.get('region')}`); }

function demo() {
  config.set('gateway', 'razorpay');
  config.set('region', 'south');

  console.log('Same logger? yes  (one exported instance, shared via require cache)');
  logger.info('app starting');
  paymentModule();
  shippingModule();

  console.log('Raise log level to WARN (suppresses INFO app-wide):');
  logger.setMinLevel(LEVELS.Warn);
  paymentModule();      // INFO -> suppressed
  shippingModule();     // WARN -> shown
  logger.error('disk almost full');
}

if (require.main === module) demo();

module.exports = { demo };
