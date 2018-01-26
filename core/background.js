"use strict";

var ampUrls = new Map();
var canonicalUrls = new Map();
var originatingUrls = new Map();
var tabsDisabled = new Set();
var popupNotifications = new Map();

chrome.runtime.onMessage.addListener(function(request, sender) {
    let tabId = sender.tab.id;

    if (!('amp' in request && 'canonical' in request)) {
        // Inelegant way to ignore messages not for us
        return;
    }

    if (request.amp) {
	originatingUrls.delete(ampUrls.get(tabId));
        originatingUrls.delete(canonicalUrls.get(tabId));
        ampUrls.set(tabId, request.url);
	originatingUrls.set(request.url, request.origUrl);
        if (!tabsDisabled.has(tabId)) {
            stateManager.forUrl(request.url).getAmpSetting().then(function(result) {
                if (result === 'on') {
                    chrome.tabs.update(tabId, {url: request.url});
                }
            });
        }
    } else if (request.canonical) {
	originatingUrls.delete(ampUrls.get(tabId));
        originatingUrls.delete(canonicalUrls.get(tabId));
        canonicalUrls.set(tabId, request.url);
	originatingUrls.set(request.url, request.origUrl);
        if (!tabsDisabled.has(tabId)) {
            stateManager.forUrl(request.url).getAmpSetting().then(function(result) {
                if (result === 'off') {
                    chrome.tabs.update(tabId, {url: request.url});
                }
            });
        }
    } else {
        if (sender.tab.url != ampUrls.get(tabId)) {
            originatingUrls.delete(canonicalUrls.get(tabId));
            canonicalUrls.delete(tabId);
        }
        if (sender.tab.url != canonicalUrls.get(tabId)) {
            originatingUrls.delete(ampUrls.get(tabId));
            ampUrls.delete(tabId);
        }
    }

    for (let callback of popupNotifications.values()) {
        callback();
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    originatingUrls.delete(ampUrls.get(tabId));
    originatingUrls.delete(canonicalUrls.get(tabId));
    ampUrls.delete(tabId);
    canonicalUrls.delete(tabId);
    tabsDisabled.delete(tabId);
    popupNotifications.delete(tabId);
});

chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
    if (ampUrls.has(removedTabId)) {
        ampUrls.set(addedTabId, ampUrls.get(removedTabId));
        ampUrls.delete(removedTabId);
    }
    if (canonicalUrls.has(removedTabId)) {
        canonicalUrls.set(addedTabId, canonicalUrls.get(removedTabId));
        canonicalUrls.delete(removedTabId);
    }
    if (tabsDisabled.has(removedTabId)) {
        tabsDisabled.add(addedTabId);
    }
    if (popupNotifications.has(removedTabId)) {
        popupNotifications.set(addedTabId, popupNotifications.get(removedTabId));
        popupNotifications.delete(removedTabId);
    }
});
