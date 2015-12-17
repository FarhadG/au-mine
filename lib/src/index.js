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
 * Handles options passed down
 *
 * @param config
 * @param response
 * @private
 */

function _handleConfig(config, response) {
  var body = [];
  if (config.paginate) {
    response.on('data', function(data) {
      body.push(data);
    });
    response.on('end', function() {
      console.log(body.join());
    });
  }
}

/**
 * Private helper function for creating a readable stream
 * and configuring a default file path.
 *
 * @param url
 * @param config
 * @private
 * @returns {stream}
 */

function _createStream(url, config) {
  var stream = ts();
  stream.path = encodeURIComponent(url);
  http.get(url, function(response) {
    response.pipe(stream);
    if (config) {
      //_handleConfig(config, response);
    }
  });
  return stream;
}

/**
 * Configures and sets the source.
 *
 * @param streams
 * @param config
 * @returns {Stream}
 */

function src(streams, config) {
  var transformStream;

  if (isStream(streams)) {
    transformStream = streams;
  }
  else if (isUrl(streams)) {
    transformStream = ts();
    toList(streams).forEach(function(url) {
      transformStream.push(_createStream(url, config));
    });
    transformStream.push(null);
  }

  return transformStream;
}

/**
 * Expose 'src'
 */

module.exports = src;