"use strict";

var ampLink = document.querySelector('link[rel="amphtml"]');

var docEl = document.documentElement;
var isAMP = docEl.hasAttribute('amp') || docEl.hasAttribute('⚡️');

if (isAMP) {
    applyMobileCSS(window.document.body);
    var canonicalURL = getCanonicalURL();

    if (canonicalURL) {
        chrome.runtime.sendMessage({amp: false, canonical: true, url: canonicalURL, origUrl: location.href});
    } else {
        chrome.runtime.sendMessage({amp: false, canonical: false});
    }
} else {
    if (ampLink && ampLink.href) {
        chrome.runtime.sendMessage({amp: true, canonical: false, url: ampLink.href, origUrl: location.href});
    } else {
        chrome.runtime.sendMessage({amp: false, canonical: false});
    }
}

// Functions

function inspectDocNodes(node){
    if (node.tagName != "HEAD") return;

    if (isAMP)
        applyMobileCSS(node);
    else {
        queryForMeta(node);
        headObserver = observeNode(node, inspectHeadNodes);
        documentObserver.disconnect();
        // console.log('disconnected from doc')
    }
}

function applyMobileCSS(node) {
    var css = "body > * { max-width: 600px !important; margin: 0px auto !important; }";
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    node.appendChild(style);
}

function getCanonicalURL() {
    var canonicalElement = document.querySelector("link[rel='canonical']")

    if (canonicalElement != null) {
        if (canonicalElement.hasAttribute("href")) {
            return canonicalElement.getAttribute("href");
        }
    }
    return false;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === 'navigate') {
            location.href = request.url;
        }
    }
);
