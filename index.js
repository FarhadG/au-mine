'use strict';

/**
 * Module dependencies
 */

var assign = require('object-assign');
var Miner = require('./lib/miner');
var util = require('util');

/**
 * Initialize
 */

function Au() {
  if (!(this instanceof Au)) {
    return new Au();
  }
  Miner.call(this);
}

/**
 * Inherit from Miner
 */

util.inherits(Au, Miner);

/**
 * Sets the accessible methods on the prototype
 */

Au.prototype = assign(Au.prototype, {
  extract: require('./lib/extract'),
  rename: require('./lib/rename'),
  dest: require('./lib/dest'),
  src: require('./lib/src'),
  Au: Au
});

/**
 * Expose an instance of Au
 */

module.exports = new Au();