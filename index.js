'use strict';

/**
 * Module dependencies
 */

var TaskManager = require('undertaker');
var request = require('superagent');
var cheerio = require('cheerio');
var util = require('util');
var fs = require('fs');

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

Au.prototype.src = request.get;

/**
 * Configures and sets the destination
 */

Au.prototype.dest = fs.createWriteStream;


/**
 * Expose the constructor on the prototype
 */

Au.prototype.Au = Au;

/**
 * Expose 'Au'
 */

module.exports = new Au();