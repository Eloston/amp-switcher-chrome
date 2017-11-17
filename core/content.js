var ampLink = document.querySelector('link[rel="amphtml"]');

var docEl = document.documentElement;
var isAMP = docEl.hasAttribute('amp') || docEl.hasAttribute('⚡️');

if (isAMP) {
    applyMobileCSS(window.document.body);
    var canonicalURL = getCanonicalURL();

    if (canonicalURL) {
        chrome.runtime.sendMessage({amp: true, url: canonicalURL, origUrl: location.href});
    } else {
        chrome.runtime.sendMessage({amp: false });
    }
} else {
    if (ampLink && ampLink.href) {
        chrome.runtime.sendMessage({amp: true, url: ampLink.href, origUrl: location.href});
    } else {
        chrome.runtime.sendMessage({amp: false });
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
    var cononicalElement = document.querySelector("link[rel='canonical']")

    if( cononicalElement != null ) {
        if (cononicalElement.hasAttribute("href"))
            return cononicalElement.getAttribute("href");

    }
    return false;
}
