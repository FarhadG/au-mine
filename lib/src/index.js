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
  var stream = ts();
  stream.path = encodeURIComponent(url);
  request.get(url).pipe(stream);
  return stream;
}

/**
 * Configures and sets the source.
 *
 * @param streams
 * @returns {Stream}
 */

function src(streams) {
  var transformStream;

  if (isStream(streams)) {
    transformStream = streams;
  }
  else if (isUrl(streams)) {
    streams = isArray(streams) ? streams : [streams];
    transformStream = ts();
    streams.forEach(function(url) {
      transformStream.push(_createStream(url));
    });
    transformStream.push(null);
  }

  return transformStream;
}

/**
 * Expose 'src'
 */

module.exports = src;