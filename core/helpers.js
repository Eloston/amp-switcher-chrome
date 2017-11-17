var helpers = {
  getOriginalUrlFromUrl: function (url) {
    return chrome.extension.getBackgroundPage().originalUrls.get(url);
  }
};
