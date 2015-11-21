var request = require('superagent');
var through = require('through2');
var isArray = Array.isArray;

/**
 * Private helper function for creating a readable stream
 * and configuring a default file path.
 *
 * @param url
 * @returns {Request}
 */

function _createReadableStream(url) {
  var stream = request.get(url);
  stream.path = stream.url
    .replace(/http|https|:\/\//g, '')
    .replace(/\/|\./g, '-');
  return stream;
}

/**
 * Configures and sets the source
 */

function src(urls) {
  urls = isArray(urls) ? urls : [urls];
  var stream = through.obj();
  urls.forEach(function(url) {
    stream.push(_createReadableStream(url));
  });
  return stream;
}

/**
 * Expose 'src'
 */

module.exports = src;