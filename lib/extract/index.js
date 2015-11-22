'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var cheerio = require('cheerio');
var req = require('superagent');


// WIP ... need to load all content first
var result = { paragraphs: [] };
function parse(data) {
  var $ = cheerio.load(data);
  var text = $('a');
  text.each(function(i, link) {
    result.paragraphs.push($(link).text());
  });
}

function load() {
  function transform(data, env, cb) {
    parse(data);
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
    var streamParser = load();
    streamParser.path = stream.path;
    stream.pipe(streamParser);
    cb(null, streamParser);
  }
  return ts(transform);
}

/**
 * Expose 'extract'
 */

module.exports = extract;