'use strict';

/**
 * Module dependencies
 */

var TaskManager = require('undertaker');
var through = require('through2');
var request = require('superagent');
var es = require('event-stream');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var isArray = Array.isArray;
var util = require('util');
var path = require('path');
var url = require('url');
var fs = require('fs');
var rs = fs.ReadStream;
var ws = fs.WriteStream;

/**
 * Initialize
 */

function Au() {
  TaskManager.call(this);
}

/**
 * Inherit from Undertaker
 */

util.inherits(Au, TaskManager);

/**
 * Private helper function for creating a readable stream
 * and configuring a default file path.
 *
 * @param url
 * @returns {Request}
 */

function createReadableStream(url) {
  var stream = request.get(url);
  stream.filePath = stream.url
    .replace(/http|https|:\/\//g, '')
    .replace(/\./g, '-');
  return stream;
};

/**
 * Configures and sets the source
 */

Au.prototype.src = function src(urls) {
  urls = isArray(urls) ? urls : [urls];
  var stream = through.obj();
  urls.forEach(function(url) {
    stream.push(createReadableStream(url));
  });
  return stream;
};

/**
 * Configures and sets the destination
 */

Au.prototype.dest = function dest(output) {
  function transform(stream, enc, cb) {
    mkdirp(path.join(__dirname, output));
    var filePath = path.join(__dirname, output, stream.filePath);
    stream.pipe(ws(filePath));
    cb(null, stream);
  }
  return through.obj(transform);
};

/**
 * Expose the constructor on the prototype
 */

Au.prototype.Au = Au;

/**
 * Expose 'Au'
 */

module.exports = new Au();