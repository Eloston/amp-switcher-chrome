var ampUrls = {};




chrome.runtime.onMessage.addListener(function(request, sender) {
    var tabid = sender.tab.id;

    if (request.amp) {
        ampUrls[tabid] = request.url;
        chrome.pageAction.show(tabid);
    } else {
        ampUrls[tabid] = undefined;
        chrome.pageAction.hide(tabid);
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    var url = ampUrls[tab.id];

    if (url) {
        chrome.tabs.update(tab.id, {url: url});
    }
});

