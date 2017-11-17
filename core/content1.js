var meta = document.querySelector('link[rel=amphtml]');
var ampUrl = meta && meta.getAttribute('href');

if (ampUrl) {
  var currentUrl = window.location.href;
  stateManager.forUrl(currentUrl).getAmpSetting().then(function (verdict) {
    console.log('Using amp version?', verdict);
    if (verdict === 'on') {
      chrome.runtime.sendMessage({action: 'set-icon', icon: 'icon-in-use'});
      var redirectUrl = ampUrl + config.urlAppend + encodeURIComponent(currentUrl);
      console.log('redirecting to', redirectUrl);
      location.href = redirectUrl;
    } else {
      console.log('not using amp version because verdict was', verdict);
    }
  });
} else {
  console.log('setting icon - sending message');
  chrome.runtime.sendMessage({action: 'set-icon', icon: 'icon'});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('received', request);
    if( request.message === "navigateAfterSettingsUpdate" ) {
      window.location.href = request.url;
    }
    if( request.message === "clicked_browser_action" ) {
      console.log('clicked');
    }
  }
);