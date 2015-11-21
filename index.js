'use strict';

/**
 * Module dependencies
 */

var TaskManager = require('undertaker');
var util = require('util');

/**
 * Initialize
 */

function Au() {
  TaskManager.call(this);
  this.streamStore = {};
}

/**
 * Inherit from Undertaker
 */

util.inherits(Au, TaskManager);

/**
 * Sets the accessible methods on the prototype
 */

Au.prototype = {
  extract: require('./lib/extract'),
  rename: require('./lib/rename'),
  link: require('./lib/link'),
  dest: require('./lib/dest'),
  src: require('./lib/src'),
  Au: Au
};

/**
 * Expose an instance of Au
 */

module.exports = new Au();