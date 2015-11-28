'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var cheerio = require('cheerio');
var req = require('superagent');
var isArray = Array.isArray;

/**
 * Parses HTML over given params
 *
 * @param html
 * @param params
 */

function _loadContent(html, params) {
  var $ = cheerio.load(html);
  var result = {};

  function _getSpec(selector) {
    var result = { attr: null, selector: null};
    result.selector = selector.replace(/(\[.*?\])/g, function(matches) {
      result.attr = matches.substr(1, matches.length-2);
      return '';
    }).trim();
    return result;
  }

  function _getText($el) {
    return $el.text().trim().replace(/(\r\n|\n|\r)/gm, "");
  }

  for (var param in params) {
    var attr, content, spec, el;
    var selector = params[param];
    if (isArray(selector)) {
      result[param] = [];
      spec = _getSpec(selector[0]);
      selector = spec.selector;
      attr = spec.attr;
      $(selector).each(function(i, el) {
        content = (attr) ? $(el).attr(attr) : _getText($(el));
        if (content) result[param].push(content);
      });
    }
    else {
      spec = _getSpec(selector);
      el = spec.selector;
      attr = spec.attr;
      content = (attr) ? $(el).attr(attr) : _getText($(el));
      if (content) result[param] = content;
    }
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
    var result = _loadContent(content.join(''), params);
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