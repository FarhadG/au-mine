'use strict';

/**
 * Module dependencies
 */

var utilities = require('../utilities');
var request = require('superagent');
var through = require('through2');
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
  stream.path = stream.url
    .replace(/http|https|:\/\//g, '')
    .replace(/\/|\./g, '-');
  return stream;
}

/**
 * Configures and sets the source.
 *
 * @param files
 * @returns {Stream}
 */

function src(files) {
  var stream;
  if (isStream(files)) {
    stream = files;
  }
  else if (isUrl(files)) {
    files = isArray(files) ? files : [files];
    stream = through.obj();
    files.forEach(function(url) {
      stream.push(_createStream(url));
    });
    stream.push(null);
  }
  return stream;
}

/**
 * Expose 'src'
 */

module.exports = src;