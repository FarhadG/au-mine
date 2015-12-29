'use strict';

var normalizeList = require('../helpers').normalizeList;
var Promise = require('bluebird');
var parse = require('../parse');
var fetch = require('../fetch');
var chalk = require('chalk');
var _ = require('lodash');

function delay(url, mine) {
  return new Promise((res, reject) => {
    setTimeout(() => res(scrape(url, mine)), mine.options.delay);
  });
}

function done(mine) {
  mine = _.isArray(mine) ? _.uniq(mine)[0] : mine;
  mine.data = _.flattenDeep(mine.data);
  console.log(chalk.underline(chalk[mine.color]('\nFINISHED: ', mine.name)));
  console.timeEnd(mine.name);
  console.log('\n');
  return mine.data;
}

function paginate($, mine) {
  var url = mine.paginate && mine.paginate($);
  return url ? delay(url, mine) : mine;
}

function scrape(url, mine) {
  return fetch(url, mine)
    .then(($) => parse($, mine))
    .then(($) => paginate($, mine))
}

function parallelize(mine) {
  mine.urls = normalizeList(mine.urls);
  return Promise
    .map(mine.urls, (url) => scrape(url, mine), mine.options)
    .catch(console.log);
}

module.exports = (mine) => {
  console.log(chalk.underline(chalk[mine.color]('\nSTARTED: ', mine.name, '\n')));
  console.time(mine.name);
  return parallelize(mine).then(done);
};