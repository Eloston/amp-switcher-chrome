"use strict";

var helpers = {
  getOriginalUrlFromUrl: function (url) {
    return chrome.extension.getBackgroundPage().originatingUrls.get(url) || url;
  }
};
