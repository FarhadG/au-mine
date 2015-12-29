'use strict';

var _ = require('lodash');

function isUrl(list) {
  var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
  list = normalizeList(list);
  for (var i = 0, len = list.length; i < len; i++) {
    if (!matcher.test(list[i])) return false;
  }
  return true;
}

function normalizeList(list) {
  var data = [];
  if (_.isFunction(list)) {
    list = list();
  }
  if (_.isArray(list)) {
    data = _.flatten(list);
  }
  else if (_.isString(list)) {
    data = [list];
  }
  else {
    throw Error('No url(s) were specified');
  }
  return data;
}

module.exports = {
  normalizeList: normalizeList,
  isUrl: isUrl
};