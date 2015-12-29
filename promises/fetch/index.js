'use strict';

var isUrl = require('../helpers').isUrl;
var cheerio = require('cheerio');
var chalk = require('chalk');
var http = require('http');

function fetch(url, mine) {
  console.log(
    chalk.gray('Fetching: ', url),
    chalk[mine.color](' | '+mine.name)
  );
  return new Promise((resolve, reject) => {
    if (!isUrl(url)) {
      return reject(url+' is not a valid URL.');
    }
    http.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(url+' returned: '+res.statusCode);
      }
      var body = '';
      res.setEncoding('utf8')
        .on('data', (d) => body += d)
        .on('end', () => resolve(cheerio.load(body)));
    });
  });
}

module.exports = fetch;