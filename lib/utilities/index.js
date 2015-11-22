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
 * Uses:
 * ts(options)
 * ts(options, transform)
 * ts(options, transform, flush)
 * ts(transform)
 * ts(transform, flush)
 *
 * @param one
 * @param two
 * @param three
 * @returns {*}
 * @constructor
 */

function TransformStream(one, two, three) {
  var defaults = { objectMode: true, highWaterMark: 9999 };
  var params = {
    transform: null,
    flush: null,
    options: null
  };
  if (one && !isFunction(one)) {
    params.options = one;
    if (isFunction(two)) {
      params.transform = two;
    }
    if (isFunction(three)) {
      params.flush = three;
    }
  }
  else if (isFunction(one)) {
    params.transform = one;
    if (isFunction(two)) {
      params.flush = two;
    }
  }
  params.options = assign(defaults, params.options);
  return params.transform
    ? through(params.options, params.transform, params.flush)
    : through(params.options);
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
 * Helper function that checks whether input is a function
 *
 * @param input
 * @returns {boolean|*}
 */

function isFunction(input) {
  return typeof input === 'function';
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
  isFunction: isFunction,
  isStream: isStream,
  isUrl: isUrl
};