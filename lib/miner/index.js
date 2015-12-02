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
  var ref = this.streamStore[name] = { stream: ts() };

  function transform(stream, enc, cb) {
    ref.stream.push(stream);
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
  var ref = this.streamStore[name];
  return (ref && ref.stream)
    ? ref.stream
    : _linkTransform.call(this, name);
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
 * Sets a timeout between every request.
 *
 * @param timeout
 * @returns {Miner}
 */

Miner.prototype.timeout = function timeout(timeout) {
  this.streamStore[this.scope] = this.streamStore[this.scope] || {};
  this.streamStore[this.scope].timeout = timeout;
  return this;
};

/**
 * Returns the timeout set on the current scope
 *
 * @returns {*}
 */

Miner.prototype.getTimeout = function getTimeout() {
  var ref = this.streamStore[this.scope];
  return (ref && ref.timeout) ? ref.timeout : 0;
};

/**
 * Expose `Link`
 */

module.exports = Miner;