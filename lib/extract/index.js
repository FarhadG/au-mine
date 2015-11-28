'use strict';

/**
 * Module dependencies
 */

var ts = require('../utilities').TransformStream;
var cheerio = require('cheerio');
var req = require('superagent');
var isArray = Array.isArray;
var path = require('path');
var url = require('url');

// returns an object containing the selector and the attribute
//
function _getSpec(selector) {
  var result = { attr: null, selector: null };

  result.selector = selector.replace(/(\[.*?\])/g, function(matches) {
    result.attr = matches.substr(1, matches.length-2);
    return '';
  }).trim();

  return result;
}

// returns a dom element's text, trimmed down without any new lines or tabs
//
function _getText($el) {
  return $el.text().trim().replace(/(\r\n|\n|\r)/gm, "");
}

// returns a dom element's attribute field
//
function _getAttribute($el, attr, filePath) {
  var absolute = '';
  if (~attr.indexOf('@')) {
    attr = attr.slice(1);
    var fileUrl = url.parse(decodeURIComponent(filePath));
    absolute = fileUrl.protocol+'//'+fileUrl.hostname;
  }
  return path.join(absolute, $el.attr(attr));
}

/**
 * Parses HTML over given params
 *
 * @param html
 * @param params
 */

function _loadContent(html, params, filePath) {
  var $ = cheerio.load(html);
  var result = {};

  for (var param in params) {
    var attr, content, spec, el;
    var selector = params[param];

    // return a list of result as the selector's value
    //
    if (isArray(selector)) {
      result[param] = [];
      spec = _getSpec(selector[0]);
      selector = spec.selector;
      attr = spec.attr;
      $(selector).each(function(i, el) {
        var $el = $(el);
        content = (attr)
          ? _getAttribute($el, attr, filePath)
          : _getText($el);
        if (content) result[param].push(content);
      });
    }

    // return a string as the selector's value
    //
    else {
      spec = _getSpec(selector);
      var $el = $(spec.selector);
      attr = spec.attr;
      content = (attr)
        ? _getAttribute($el, attr, filePath)
        : _getText($el);
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

function _reduceStream(params, filePath) {
  var content = [];

  function transform(data, env, cb) {
    content.push(data);
    cb();
  }

  function done(cb) {
    var result = _loadContent(content.join(''), params, filePath);
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
    var reducer = _reduceStream(params, stream.path);
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