var helpers = {
  getOriginalUrlFromUrl: function (url) {
    var indexOfBookmarkLink = url.indexOf(config.urlAppend);
    if (indexOfBookmarkLink > -1) {
      var out = decodeURIComponent(url.substr(indexOfBookmarkLink + config.urlAppend.length));
      return out;
    }
    return url;
  }
};