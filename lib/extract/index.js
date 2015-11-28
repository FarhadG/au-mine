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
  var attr, content;
  for (var param in params) {
    var selector = params[param];

    if (isArray(selector)) {
      attr = content = undefined;
      result[param] = [];
      selector = selector[0].replace(/(\[.*?\])/g, function(matches) {
        attr = matches.substr(1, matches.length-2);
        return '';
      }).trim();
      $(selector).each(function(i, el) {
        if (attr) {
          if (attr.toLowerCase() === '@href') {
            //todo: absolute paths
            attr = 'href';
            content = $(el).attr(attr);
          }
          else {
            content = $(el).attr(attr);
          }
        }
        else {
          content = $(el).text().trim().replace(/(\r\n|\n|\r)/gm, "");
        }
        if (content) {
          result[param].push(content);
        }
      });
    }

    else {
      attr = content = undefined;
      selector = selector.replace(/(\[.*?\])/g, function(matches) {
        attr = matches.substr(1, matches.length-2);
        return '';
      }).trim();
      console.log(attr)
      if (attr) {
        content = $(selector).attr(attr);
      }
      else {
        content = $(selector).text().trim().replace(/(\r\n|\n|\r)/gm, "");
      }
      result[param] = content;
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