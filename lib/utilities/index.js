'use strict';

/**
 * Module dependencies
 */

var assign = require('object-assign');
var through = require('through2');
var isArray = Array.isArray;

/**
 * Helper function for creating a transform stream with default options.
 *
 * @param transform
 * @param flush
 * @param options
 * @returns {Stream}
 */

function TransformStream(transform, flush, options) {
  transform = transform || null;
  flush = (typeof flush === 'function') ? flush : null;
  options = (typeof flush === 'object') ? flush : options;
  var defaults = { objectMode: true, highWaterMark: 9999 };
  return through(assign(defaults, options), transform, flush);
}

/**
 * Helper function that determines whether a file is a stream.
 *
 * @param file
 * @returns {boolean|*}
 */

function isStream(file) {
  return file.writable;
}

/**
 * Helper function for determining whether all elements in a list are URLs
 *
 * @param urls
 * @returns {boolean}
 */

function isUrl(urls) {
  var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
  urls = isArray(urls) ? urls : [urls];
  for(var i = 0, len = urls.length; i< len; i++) {
    if (!matcher.test(urls[i])) return false;
  }
  return true;
}

/**
 * Expose 'utilities'
 */

module.exports = {
  TransformStream: TransformStream,
  isStream: isStream,
  isUrl: isUrl
};