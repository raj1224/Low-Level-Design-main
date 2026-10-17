'use strict';
// =============================================================================
// Chain of Responsibility in a real project — HTTP middleware. (Node.js)
//   node src/index.js
//
// Build a pipeline log -> auth -> rate-limit. A request flows down it until a
// handler responds; this is exactly how Express/Koa middleware works.
// =============================================================================
const { LoggingMiddleware, AuthMiddleware, RateLimitMiddleware } = require('./middleware');

function send(chain, req) {
  const res = chain.handle(req);
  console.log(`  => ${res.status} ${res.body}\n`);
}

function demo() {
  const logging = new LoggingMiddleware();
  const auth = new AuthMiddleware();
  const rateLimit = new RateLimitMiddleware(2);
  logging.linkWith(auth).linkWith(rateLimit);

  const good = { method: 'GET', path: '/orders', clientId: 'clientX', headers: { Authorization: 'Bearer valid' } };
  const noAuth = { method: 'GET', path: '/orders', clientId: 'clientY', headers: {} };

  console.log('1) Authorized request:');                    send(logging, good);
  console.log('2) Missing token (blocked at auth):');       send(logging, noAuth);
  console.log('3) Authorized again (clientX 2/2):');        send(logging, good);
  console.log('4) Authorized again (clientX over quota):'); send(logging, good);
}

if (require.main === module) demo();

module.exports = { demo };
