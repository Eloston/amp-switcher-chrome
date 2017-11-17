"use strict";

var defaultDefault = 'on';
var anchorTag = document.createElement('a');

function managerForKey(key) {
  return {
    getCurrentValue: function () {
      return new Promise(function (res) {
        chrome.storage.sync.get(key, function (answer) {
          res(answer[key]);
        });
      });
    },
    set: function (value) {
      return new Promise(function (res, rej) {
        if (value === 'default') {
          chrome.storage.sync.remove(key);
      res();
        } else {
          var setter = {};
          setter[key] = value;
          chrome.storage.sync.set(setter, function() {
            res();
          });
        }
      });
    }
  };
}

var stateManager = {
  convertUrlToDomain: function (url) {
    anchorTag.href = url; 
    return anchorTag.hostname;
  },
  forUrl: function (url) {
    let realArticleUrl = helpers.getOriginalUrlFromUrl(url);
    var keys = {
      page: 'page-' + realArticleUrl,
      domain: 'domain-' + this.convertUrlToDomain(realArticleUrl)
    };
    return {
      domainSettings: managerForKey(keys.domain),
      pageSettings: managerForKey(keys.page),
      getAmpSetting: function () {
        return new Promise(function (res) {
          var query = ['default', keys.page, keys.domain];
          chrome.storage.sync.get(query, function (result) {
            res(result[keys.page] || result[keys.domain] || result.default || defaultDefault);
          });
        });
      }
    };
  },
  defaultBehaviour: function () {
    return managerForKey('default');
  }
};
