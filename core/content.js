"use strict";

var ampSelector = 'link[rel="amphtml"]';
var canonicalSelector = 'link[rel="canonical"]';
var lastResult = null;

var headObserver = null;
var linkObserver = null;

function initAmpObserver() {
    linkObserver = new MutationObserver(checkAmp);
    linkObserver.observe(document.head, {
        childList: true,
        subtree: true
    });
}

function checkHead() {
    if (document.head) {
        headObserver.disconnect();
        headObserver = false;
        initAmpObserver();
    }
}

function waitForHead() {
    if (document.head) {
        initAmpObserver();
    } else {
        headObserver = new MutationObserver(checkHead);
        headObserver.observe(document.documentElement, {childList: true});
    }
}

function checkAmp() {
    let docEl = document.documentElement;
    let isAMP = docEl.hasAttribute('amp') || docEl.hasAttribute('⚡️');

    if (!document.head) {
        return;
    }

    if (isAMP) {
        let canonicalLink = document.head.querySelector(canonicalSelector);
        if (canonicalLink && canonicalLink.href && lastResult !== 'amp') {
            lastResult = true;
            chrome.runtime.sendMessage({amp: false, canonical: true, url: canonicalLink.href, origUrl: location.href});
        } else if (lastResult !== false) {
            lastResult = false;
            chrome.runtime.sendMessage({amp: false, canonical: false});
        }
    } else {
        let ampLink = document.head.querySelector(ampSelector);
        if (ampLink && ampLink.href && lastResult !== 'canonical') {
            lastResult = 'canonical';
            chrome.runtime.sendMessage({amp: true, canonical: false, url: ampLink.href, origUrl: location.href});
        } else if (lastResult !== false) {
            lastResult = false;
            chrome.runtime.sendMessage({amp: false, canonical: false});
        }
    }

    if (linkObserver && lastResult) {
        linkObserver.disconnect();
        linkObserver = false;
    }
}

function initObserver() {
    let observer = new MutationObserver(check);

}

waitForHead();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'navigate') {
            location.href = request.url;
        }
    }
);
