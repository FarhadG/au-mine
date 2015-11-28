module.exports = {

  range: function urlRange(start, end, site) {
    var result = {urls: [], names: []};
    if (typeof start === "number") {
      for (var i = start; i <= end; i++) {
        result.names.push(i);
        result.urls.push(site + i);
      }
    }
    else {
      for (var i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
        var letter = String.fromCharCode(i);
        result.names.push(letter);
        result.urls.push(site + letter);
      }
    }
    return result;
  }

};