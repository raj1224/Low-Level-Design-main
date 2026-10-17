'use strict';
// =============================================================================
// Abstract Factory in a real project — cloud resource families. (Node.js)
//   node src/index.js
//
// The client (deployStack) depends only on the abstract factory interface, so
// the same code deploys a whole AWS or GCP stack.
// =============================================================================
const { AwsFactory, GcpFactory } = require('./factories');

// Client uses only the abstract factory interface.
function deployStack(factory) {
  console.log(`Deploying stack on ${factory.name()}:`);
  console.log(`  compute -> ${factory.createCompute().provision()}`);
  console.log(`  storage -> ${factory.createStorage().provision()}`);
}

function demo() {
  deployStack(new AwsFactory());
  deployStack(new GcpFactory());
}

if (require.main === module) demo();

module.exports = { demo, deployStack };
