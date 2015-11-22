'use strict';

/**
 * Module dependencies
 */

var assign = require('object-assign');
var Mine = require('./lib/mine');
var util = require('util');

/**
 * Initialize
 */

function Au() {
  if (!(this instanceof Au)) {
    return new Au();
  }
  Mine.call(this);
}

/**
 * Inherit from Mine
 */

util.inherits(Au, Mine);

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