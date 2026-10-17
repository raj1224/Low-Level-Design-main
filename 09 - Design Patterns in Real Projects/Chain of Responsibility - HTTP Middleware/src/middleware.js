'use strict';
// CHAIN OF RESPONSIBILITY — HTTP middleware. Each handler either deals with the
// request (short-circuit with a response) or forwards to the next link. The
// chain is built once; any handler can terminate it.
class Middleware {
  linkWith(next) { this.next = next; return next; }   // chainable wiring
  handle(req) {
    if (this.next) return this.next.handle(req);
    return { status: 200, body: `OK: handled ${req.path}` };
  }
}

class LoggingMiddleware extends Middleware {
  handle(req) {
    console.log(`  [log] ${req.method} ${req.path} from ${req.clientId}`);
    return super.handle(req);
  }
}

class AuthMiddleware extends Middleware {
  handle(req) {
    if (req.headers.Authorization !== 'Bearer valid') {
      console.log('  [auth] reject -> 401');
      return { status: 401, body: 'Unauthorized' };
    }
    console.log('  [auth] ok');
    return super.handle(req);
  }
}

class RateLimitMiddleware extends Middleware {
  constructor(max) { super(); this.max = max; this.counts = {}; }
  handle(req) {
    const count = (this.counts[req.clientId] = (this.counts[req.clientId] || 0) + 1);
    if (count > this.max) {
      console.log(`  [ratelimit] ${req.clientId} over quota -> 429`);
      return { status: 429, body: 'Too Many Requests' };
    }
    console.log(`  [ratelimit] ${req.clientId} ${count}/${this.max}`);
    return super.handle(req);
  }
}

module.exports = { Middleware, LoggingMiddleware, AuthMiddleware, RateLimitMiddleware };
