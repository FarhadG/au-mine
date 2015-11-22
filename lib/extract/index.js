/**
 * Module dependencies
 */

var through = require('through2');
var cheerio = require('cheerio');


/**
 * Stream transformer for extracting out content from an HTML
 * given a set of params
 */

function extract(params) {
  function transform(stream, enc, cb) {
    cb(null, stream);
  }
  return through.obj(transform);
}

/**
 * Expose 'extract'
 */

module.exports = extract;