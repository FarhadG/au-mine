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
 * Configures and sets the source.
 *
 * @param streams
 * @returns {Stream}
 */

function src(streams, cb) {

  if (isStream(streams)) {
    if (!cb) return streams;
    var transformStream = ts();
    streams.on('data', function(stream) {
      stream.on('data', function(data) {
        data = JSON.parse(data).shots;
        data = data.map(function(url) {
          return url.replace(/https:\/|http:\//g, 'https://');
        });
        data.forEach(function(url) {
          transformStream.push(_createStream(url));
        });
      });
    })
    return transformStream;
  }
  else if (isUrl(streams)) {
    streams = isArray(streams) ? streams : [streams];
    var transformStream = ts();
    streams.forEach(function(stream) {
      transformStream.push(_createStream(stream));
    });
    transformStream.push(null);
    return transformStream;
  }
}

/**
 * Expose 'src'
 */

module.exports = src;