'use strict';

/**
 * Module dependencies
 */

var through = require('through2');
var isArray = Array.isArray;

/**
 * Takes in a set of streams and changes the file path of the stream
 */

function rename(names) {
  names = isArray(names) ? names : [names];
  function transform(stream, enc, cb) {
    stream.path = names.shift();
    cb(null, stream);
  }
  return through.obj(transform);
}

/**
 * Expose `rename`
 */

module.exports = rename;