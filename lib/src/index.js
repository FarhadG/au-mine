'use strict';

/**
 * Module dependencies
 */

var utilities = require('../utilities');
var request = require('superagent');
var ts = utilities.TransformStream;
var isStream = utilities.isStream;
var isUrl = utilities.isUrl;
var isArray = Array.isArray;

/**
 * Private helper function for creating a readable stream
 * and configuring a default file path.
 *
 * @param url
 * @returns {Request}
 */

function _createStream(url) {
  var stream = request.get(url);
  stream.path = encodeURIComponent(stream.url);
  return stream;
}

/**
 * Parses an incoming stream for a desired output
 *
 * @param streams
 * @param cb
 * @returns {*}
 */

function parseStream(streams, cb) {
  var out = [];
  var transformStream = ts();
  streams.on('data', function(stream) {
    stream.on('data', function(data) {
      out.push(data);
      stream.on('end', function() {
        out = JSON.parse(out.join());
        cb(out).forEach(function(url) {
          transformStream.push(_createStream(url));
        });
      })
    });
  });
  return transformStream;
}

/**
 * Configures and sets the source.
 *
 * @param streams
 * @returns {Stream}
 */

function src(streams, cb) {
  var transformStream;

  if (isStream(streams)) {
    if (!cb) return streams;
    transformStream = parseStream(streams, cb);
  }
  else if (isUrl(streams)) {
    streams = isArray(streams) ? streams : [streams];
    transformStream = ts();
    streams.forEach(function(stream) {
      transformStream.push(_createStream(stream));
    });
    transformStream.push(null);
  }

  return transformStream;
}

/**
 * Expose 'src'
 */

module.exports = src;