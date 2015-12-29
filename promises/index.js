'use strict';

var normalizeList = require('./lib/helpers').normalizeList;
var process = require('./lib/process');
var Promise = require('bluebird');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var fs = require('fs');

class Au {
  constructor(site, options) {
    this.mines = {};
    this.globals = {};
    this.site = site;
    this.options = {
      concurrency: 5,
      delay: 0
    };
    if (options) this.setOptions(options);
  }

  getSite() {
    return this.site;
  }

  setSite(site) {
    this.site = site;
    return this;
  }

  getOptions(key) {
    var options = this.options;
    return key ? options[key] : options;
  }

  setOptions(options) {
    _.extend(this.options, options);
    return this;
  }

  getGlobals(key) {
    var globals = this.globals;
    return key ? globals[key] : globals;
  }

  setGlobals(values) {
    _.extend(this.globals, values);
    return this;
  }

  get(name, scope) {
    var mine = this.mines[name];
    return scope ? mine[scope] : mine;
  }

  set(name, config) {
    var palette = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    this.mines[name] = _.extend({
      name: name,
      data: [],
      color: config.color || palette[Math.random() * palette.length | 0],
      options: this.options
    }, config);
    return this;
  }

  write(output, mine) {
    var data = {};
    if (!mine) {
      _.each(this.mines, (mine) => data[mine.name] = mine.data);
    }
    else {
      data.mine = au.get(mine, 'data');
    }
    return new Promise((resolve, reject) => {
      fs.writeFile(output, JSON.stringify(data, null, 2), (err, cb) => {
        return resolve(cb);
      });
    })
  }

  mine(tasks) {
    return Promise
      .map(normalizeList(tasks), (task) => process(this.get(task)), this.options)
      .catch(console.log);
  }
}

module.exports = (site, options) => new Au(site, options);