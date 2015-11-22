'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var through = require('through2');
var cheerio = require('cheerio');
var req = require('superagent');

/**
 * Parses an input stream by reducing the data given the selectors
 *
 * @returns {Stream}
 * @private
 */

function _streamParser(params) {
  var result = { paragraphs: [] };
  var content = [];

  function transform(data, env, cb) {
    content.push(data);
    cb();
  }

  function done(cb) {
    var $ = cheerio.load(content.join(''));
    var text = $('a');
    text.each(function(i, link) {
      result.paragraphs.push($(link).text());
    });
    this.push(JSON.stringify(result, null, 2));
    cb();
  }

  return ts(transform, done,{objectMode: false});
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
    var parser = _streamParser(params);
    parser.path = stream.path;
    stream.pipe(parser);
    cb(null, parser);
  }

  return ts(transform);
}

/**
 * Expose 'extract'
 */

module.exports = extract;