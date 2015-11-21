/**
 * Module dependencies
 */

var through = require('through2');

/**
 * Setups up linking references to be able to reference a stream
 * from that linking point.
 *
 */
function link(name) {
  var _this = this;
  var ref = this.streamStore[name];
  return ref ? ref : _linkTransform.call(this, name);
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
 * Expose `Link`
 */

module.exports = link;