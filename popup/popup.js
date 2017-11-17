chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  var tab = tabs[0];
  var url = tab.url;
  var originalPageUrl = helpers.getOriginalUrlFromUrl(url);
  var domain = stateManager.convertUrlToDomain(originalPageUrl);
  document.getElementById('current-domain').innerHTML = domain;

  var mainForm = document.getElementById('main-form');

  function sendReloadInstruction() {
    chrome.tabs.sendMessage(tab.id, {
      message: 'navigateAfterSettingsUpdate',
      url: originalPageUrl
    });
  }

  function manage(sm, cssClass) {
    [].forEach.call(mainForm.querySelectorAll('.' + cssClass + ' input[type=radio]'), function (el) {
      var val = el.getAttribute('value');
      sm.getCurrentValue().then(function (currentValue) {
        if (val === (currentValue || 'default')) {
          el.setAttribute('checked', 'checked');
        }
      });
      el.addEventListener('change', function () {
        sm.set(val).then(sendReloadInstruction);
      }, false);
    });
  }

  (function () {
    var sm = stateManager.defaultBehaviour();
    [].forEach.call(mainForm.querySelectorAll('.default input[type=radio]'), function (el) {
      var val = el.getAttribute('value');
      sm.getCurrentValue().then(function (currentValue) {
        if (val === currentValue) {
          el.setAttribute('checked', 'checked');
        }
      });
      el.addEventListener('change', function () {
        sm.set(val).then(sendReloadInstruction);
      }, false);
    });
  }());

  (function () {
    var forUrl = stateManager.forUrl(originalPageUrl);
    manage(forUrl.domainSettings, 'domain');
    manage(forUrl.pageSettings, 'page');
  }());
});
