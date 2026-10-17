# Singleton in a Real Project — Shared Logger & Config

> **Section 09 — Design Patterns in Real Projects** · Pattern: **Singleton** · Code: [src/](src/)

Section 06 taught Singleton with a focused example. **Here it earns its keep**: a logger and a config manager that the *whole app* shares.

---

## The scenario
A logger and a configuration store are **cross-cutting** — every module needs the
same one. You don't want each module newing its own logger (then a log-level
change wouldn't apply everywhere) or re-reading config from disk repeatedly.

## The idiomatic JS singleton
In C++/Java you write a `getInstance()` with a private constructor. **In Node you
usually don't need to** — `require()` **caches** every module, so if a module
exports a single instance, every `require` of it gets the *same* object:

```js
// logger.js
const logger = new Logger();
module.exports = { logger };
// anywhere else:
const { logger } = require('./logger');   // <- same instance, always
```

That's the design here: `logger.js` creates one `Logger` + one `ConfigManager`
and exports them. Two unrelated "modules" (`paymentModule`, `shippingModule`)
both see the same state — including a log-level change made app-wide.

## Project layout
```
src/
  logger.js   Logger + ConfigManager classes + the exported singleton instances
  index.js    two "modules" using the shared singletons + the demo
```

## How to run
```powershell
cd "09 - Design Patterns in Real Projects/Singleton - Logger and Config"
node src/index.js
```
### Expected output
```
Same logger? yes  (one exported instance, shared via require cache)
  [INFO] app starting
  [INFO] charging via razorpay
  [WARN] no couriers in region south
Raise log level to WARN (suppresses INFO app-wide):
  [WARN] no couriers in region south
  [ERROR] disk almost full
```

## Key takeaway
Raising the level to `WARN` on the one shared logger **instantly** suppresses
`INFO` everywhere — proof there's a single instance. Prefer the module-cache
singleton in Node; reach for a `getInstance()` only if you need lazy construction
or to enforce it across module boundaries.
