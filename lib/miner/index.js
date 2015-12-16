'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;

/**
 * WIP
 * Gold mining task manager that handles name space, linking, tasking, etc.
 */

function Miner() {
  this.scope = 'default';
  this.streamStore = {};
}

/**
 * Private helper function for linking up transforms
 *
 * @param name
 * @private
 */

function _linkTransform(name) {
  var ref = this.streamStore[name] = ts();

  function transform(stream, enc, cb) {
    ref.push(stream);
    cb(null, stream);
  }

  return ts(transform);
}

/**
 * Setups up linking references to be able to reference a stream
 * from that linking point.
 *
 * @param name
 * @param scope
 * @returns {*}
 */

Miner.prototype.link = function link(name, scope) {
  scope = scope || this.scope;
  name = scope ? (scope+':'+name) : name;
  return this.streamStore[name] || _linkTransform.call(this, name);
};

/**
 * Sets the mine scope to prevent name collision
 *
 * @param scope
 * @returns {Miner}
 */

Miner.prototype.mine = function mine(scope) {
  this.scope = scope;
  return this;
};

/**
 * Expose `Link`
 */

module.exports = Miner;