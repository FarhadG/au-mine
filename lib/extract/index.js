'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var cheerio = require('cheerio');
var req = require('superagent');


function streamParser() {
  var result = { paragraphs: [] };

  function transform(data, env, cb) {
    var $ = cheerio.load(data);
    var text = $('a');

    text.each(function(i, link) {
      result.paragraphs.push($(link).text());
    });

    cb();
  }

  function done(cb) {
    this.push(JSON.stringify(result, null, 2));
    result = { paragraphs: [] };
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
    var parser = streamParser();
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