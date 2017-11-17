var ampUrls = new Map();
var originalUrls = new Map();

chrome.runtime.onMessage.addListener(function(request, sender) {
    var tabid = sender.tab.id;

    if (request.amp) {
	originalUrls.delete(ampUrls.get(tabid));
        ampUrls.set(tabid, request.url);
	originalUrls.set(request.url, request.origUrl);
        chrome.pageAction.show(tabid);
    } else {
	originalUrls.delete(ampUrls.get(tabid));
        ampUrls.delete(tabid);
        chrome.pageAction.hide(tabid);
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    var url = ampUrls.get(tab.id);

    if (url) {
        chrome.tabs.update(tab.id, {url: url});
    }
});

