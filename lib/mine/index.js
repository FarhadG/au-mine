'use strict';

/**
 * Module dependencies
 */

var through = require('through2');

/**
 * WIP
 * Gold mining task manager that handles name space, linking, tasking, etc.
 */

function Mine() {
  this.scope = undefined;
  this.streamStore = {};
}

/**
 * Helper function for linking up transforms
 */

function _linkTransform(name) {
  var ref = this.streamStore[name] = through.obj();
  function transform(stream, enc, cb) {
    ref.push(stream);
    cb(null, stream);
  }
  return through.obj(transform);
}

/**
 * Setups up linking references to be able to reference a stream
 * from that linking point.
 */

Mine.prototype.link = function link(name, scope) {
  scope = scope || this.scope;
  name = scope ? (scope+':'+name) : name;
  var ref = this.streamStore[name];
  return ref ? ref : _linkTransform.call(this, name);
};


/**
 * Sets the mine names to prevent name collision when linking
 *
 * @param name
 * @returns {Mine}
 */

Mine.prototype.name = function name(scope) {
  this.scope = scope;
  return this;
};

/**
 * Another way of referencing mine naming
 */

Mine.prototype.mine = Mine.prototype.name;

/**
 * Expose `Link`
 */

module.exports = Mine;