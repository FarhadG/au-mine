'use strict';

/**
 * Module dependencies
 */

var TaskManager = require('undertaker');
var through = require('through2').obj;
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
 * Debugs
 */

var debug = require('debug')('Au');
var error = require('debug')('Au:error');

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
 * Configures and sets the source
 */

Au.prototype.src = function src(urls) {
  urls = isArray(urls) ? urls : [urls];
  var stream = through();
  urls.forEach(function(url) {
    stream.push(request.get(url));
  });
  return stream;
};

/**
 * Configures and sets the destination
 */

// Helper function for setting a default filename from the URL
function getFileName(stream) {
  return stream.url.replace(/http|https|:\/\//g, '').replace(/\./g, '-');
}

Au.prototype.dest = function dest(output) {
  mkdirp(path.join(__dirname, output));
  return through(function(stream, enc, cb) {
    var filePath = path.join(__dirname, output, getFileName(stream));
    stream.pipe(ws(filePath));
    cb(null, stream);
  });
};

/**
 * Expose the constructor on the prototype
 */

Au.prototype.Au = Au;

/**
 * Expose 'Au'
 */

module.exports = new Au();