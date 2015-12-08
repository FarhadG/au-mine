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


function paginate() {

  function transform(stream, enc, cb) {
    cb(null, stream);
  }

  return ts(transform);
}

module.exports = paginate;