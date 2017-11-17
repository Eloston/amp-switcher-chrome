chrome.browserAction.onClicked.addListener(function (tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.action !== 'set-icon') {
    console.log('not expected action', req.action);
    return;
  }
  var path = req.icon + ".png";
  console.log('setting icon - ', path);
  chrome.browserAction.setIcon({path: path});
});