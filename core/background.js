"use strict";

var ampUrls = new Map();
var canonicalUrls = new Map();
var originalUrls = new Map();

chrome.runtime.onMessage.addListener(function(request, sender) {
    var tabid = sender.tab.id;

    if (request.amp) {
	originalUrls.delete(ampUrls.get(tabid));
        originalUrls.delete(canonicalUrls.get(tabid));
        ampUrls.set(tabid, request.url);
	originalUrls.set(request.url, request.origUrl);
        chrome.pageAction.show(tabid);
        stateManager.forUrl(request.url).getAmpSetting().then(function(result) {
            if (result === 'on') {
                chrome.tabs.update(tabid, {url: request.url});
            }
        });
    } else if (request.canonical) {
	originalUrls.delete(ampUrls.get(tabid));
        originalUrls.delete(canonicalUrls.get(tabid));
        canonicalUrls.set(tabid, request.url);
	originalUrls.set(request.url, request.origUrl);
        chrome.pageAction.show(tabid);
        stateManager.forUrl(request.url).getAmpSetting().then(function(result) {
            if (result === 'off') {
                chrome.tabs.update(tabid, {url: request.url});
            }
        });
    } else {
	originalUrls.delete(ampUrls.get(tabid));
        originalUrls.delete(canonicalUrls.get(tabid));
        ampUrls.delete(tabid);
        canonicalUrls.delete(tabid);
        chrome.pageAction.hide(tabid);
    }
});
