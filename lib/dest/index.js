'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var ws = require('fs').WriteStream;
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Configures and sets the destination.
 *
 * @param output
 * @returns {Stream}
 */

function dest(output) {
  var cwd = process.cwd();
  mkdirp.sync(path.join(cwd, output));
  function transform(stream, enc, cb) {
    var filePath = path.join(cwd, output, stream.path);
    stream.pipe(ws(filePath));
    cb(null, stream);
  }
  return ts(transform);
}

/**
 * Expose 'dest'
 */

module.exports = dest;