'use strict';
// SINGLETON — a shared Logger + ConfigManager.
//
// Node has a built-in singleton mechanism: require() CACHES a module, so
// exporting ONE instance makes every `require('./logger')` get the *same*
// object. No getInstance() ceremony needed — this is the idiomatic JS singleton.
const LEVELS = { Info: 0, Warn: 1, Error: 2 };

class Logger {
  constructor() { this.min = LEVELS.Info; }
  setMinLevel(l) { this.min = l; }
  _log(level, tag, m) { if (level >= this.min) console.log(`  [${tag}] ${m}`); }
  info(m)  { this._log(LEVELS.Info,  'INFO',  m); }
  warn(m)  { this._log(LEVELS.Warn,  'WARN',  m); }
  error(m) { this._log(LEVELS.Error, 'ERROR', m); }
}

class ConfigManager {
  constructor() { this.kv = {}; }
  set(k, v) { this.kv[k] = v; }
  get(k) { return this.kv[k] || ''; }
}

// The singletons: ONE instance each, exported (and thus shared via require cache).
const logger = new Logger();
const config = new ConfigManager();

module.exports = { Logger, ConfigManager, logger, config, LEVELS };
