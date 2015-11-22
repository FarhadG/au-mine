'use strict';

/**
 * Module dependencies
 */

var isArray = Array.isArray;

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
  isStream: isStream,
  isUrl: isUrl
};