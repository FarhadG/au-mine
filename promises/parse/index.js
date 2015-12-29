'use strict';

function _getSpec(selector) {
  var result = { attr: null, selector: null };

  result.selector = selector.replace(/(\[.*?\])/g, function(matches) {
    result.attr = matches.substr(1, matches.length-2);
    return '';
  }).trim();

  return result;
}

function _getText($el) {
  return $el.text().trim().replace(/(\r\n|\n|\r)/gm, "");
}

function _getAttribute($el, attr, filePath) {
  var absolute = '';
  if (~attr.indexOf('@')) {
    attr = attr.slice(1);
    var fileUrl = url.parse(decodeURIComponent(filePath));
    absolute = fileUrl.protocol+'//'+fileUrl.hostname;
  }
  return absolute+$el.attr(attr);
}

function parse($, mine) {
  //var result = {};
  //for (var param in params) {
  //  var attr, content, spec, el;
  //  var selector = params[param];
  //  if (isFunction(selector)) {
  //    result[param] = selector($);
  //  }
  //  else if (isArray(selector)) {
  //    result[param] = [];
  //    spec = _getSpec(selector[0]);
  //    selector = spec.selector;
  //    attr = spec.attr;
  //    $(selector).each(function(i, el) {
  //      var $el = $(el);
  //      content = (attr)
  //        ? _getAttribute($el, attr, filePath)
  //        : _getText($el);
  //      if (content) result[param].push(content);
  //    });
  //  }
  //  else {
  //    spec = _getSpec(selector);
  //    var $el = $(spec.selector);
  //    attr = spec.attr;
  //    content = (attr)
  //      ? _getAttribute($el, attr, filePath)
  //      : _getText($el);
  //    if (content) result[param] = content;
  //  }
  //}

  mine.data.push(mine.parse && mine.parse($));
  return $;
}

module.exports = parse;