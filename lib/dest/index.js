var through = require('through2');
var mkdirp = require('mkdirp');
var path = require('path');
var ws = require('fs').WriteStream;

/**
 * Configures and sets the destination
 */

function dest(output) {
  var cwd = process.cwd();
  mkdirp.sync(path.join(cwd, output));
  function transform(stream, enc, cb) {
    var filePath = path.join(cwd, output, stream.path);
    stream.pipe(ws(filePath));
    cb(null, stream);
  }
  return through.obj(transform);
}

/**
 * Expose 'dest'
 */

module.exports = dest;