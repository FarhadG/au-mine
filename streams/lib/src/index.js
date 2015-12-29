'use strict';

/**
 * Module dependencies
 */

var utilities = require('../utilities');
var ts = utilities.TransformStream;
var isStream = utilities.isStream;
var toList = utilities.toList;
var isUrl = utilities.isUrl;
var http = require('http');

/**
 * Configures and sets the source.
 *
 * @param streams
 * @param config
 * @returns {Stream}
 */

function src(streams, config) {
  var transformStream;

  function _pushStream(url) {
    var stream = ts();
    stream.path = stream.url = encodeURIComponent(url);

    http.get(url, function(response) {
      if (response.statusCode === 200) {
        response.pipe(stream);
      }
    });

    transformStream.push(stream);
  }

  if (isStream(streams)) {
    transformStream = streams;
  }
  else if (isUrl(streams)) {
    transformStream = ts();
    toList(streams).forEach(_pushStream);
    transformStream.push(null);
  }

  return transformStream;
}

/**
 * Expose 'src'
 */

module.exports = src;