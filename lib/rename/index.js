'use strict';

/**
 * Module dependencies
 */

var through = require('through2');
var uuid = require('node-uuid');
var isArray = Array.isArray;

function _getFileName(names, unique, stream) {
  var fileName = undefined;
  var rand = uuid();
  if (isArray(names)) {
    fileName = names.shift();
  }
  else if (typeof names === 'string') {
    fileName = unique ? (names+' ('+rand+')') : names;
  }
  else if (typeof names === 'function') {
    fileName = names(stream, rand);
  }
  return fileName ? fileName : rand;
}

/**
 * Takes in a set of streams and changes the file path of the stream
 */

function rename(names, unique) {
  function transform(stream, enc, cb) {
    stream.path = _getFileName(names, unique, stream);
    cb(null, stream);
  }
  return through.obj(transform);
}

/**
 * Expose `rename`
 */

module.exports = rename;