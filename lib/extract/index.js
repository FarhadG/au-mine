'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var through = require('through2');
var cheerio = require('cheerio');
var req = require('superagent');

/**
 * Parses HTML over given params
 *
 * @param html
 * @param params
 */

function _parseContent(html, params) {
  var $ = cheerio.load(html);
  var result = {};
  for(var label in params) {
    result[label] = [];
    var spec = params[label];
    $(spec).each(function(i, item) {
      var content = $(item).text().trim().replace(/(\r\n|\n|\r)/gm,"");
      if (content.length) {
        result[label].push(content);
      }
    });
  }
  return result;
}

/**
 * Returns a reducer stream
 *
 * @returns {Stream}
 * @private
 */

function _reduceStream(params) {
  var content = [];

  function transform(data, env, cb) {
    content.push(data);
    cb();
  }

  function done(cb) {
    var result = _parseContent(content.join(''), params);
    this.push(JSON.stringify(result, null, 2));
    cb();
  }

  return ts(transform, done);
}

/**
 * Stream transformer for extracting out content from an HTML
 * given a set of params
 *
 * @param params
 * @returns {Stream}
 */

function extract(params) {

  function transform(stream, enc, cb) {
    var reducer = _reduceStream(params);
    reducer.path = stream.path;
    stream.pipe(reducer);
    cb(null, reducer);
  }

  return ts(transform);
}

/**
 * Expose 'extract'
 */

module.exports = extract;