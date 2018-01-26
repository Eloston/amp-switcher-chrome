"use strict";

(function() {
    let manifest = chrome.runtime.getManifest();
    document.getElementById("extensionName").appendChild(
        document.createTextNode(manifest.name)
    );
    document.getElementById("extensionVersion").appendChild(
        document.createTextNode(manifest.version)
    );
})();

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    let tab = tabs[0];
    let originalPageUrl = helpers.getOriginalUrlFromUrl(tab.url);
    let domain = stateManager.convertUrlToDomain(originalPageUrl);
    let el_disable_tab = document.getElementById("disable_tab");
    let el_goto_amp = document.getElementById("goto_amp");
    let el_goto_canonical = document.getElementById("goto_canonical");
    let el_goto_originating = document.getElementById("goto_originating");
    let background_page = chrome.extension.getBackgroundPage();

    document.getElementById('current-domain').innerHTML = domain;
    el_disable_tab.checked = background_page.tabsDisabled.has(tab.id);
    el_disable_tab.addEventListener("change", function() {
        if (el_disable_tab.checked) {
            background_page.tabsDisabled.add(tab.id);
        } else {
            background_page.tabsDisabled.delete(tab.id);
        }
    });

    el_goto_amp.disabled = !background_page.ampUrls.has(tab.id);
    el_goto_amp.addEventListener('click', function() {
        chrome.tabs.update(tab.id, {url: background_page.ampUrls.get(tab.id)});
    });
    el_goto_canonical.disabled = !background_page.canonicalUrls.has(tab.id);
    el_goto_canonical.addEventListener('click', function() {
        chrome.tabs.update(tab.id, {url: background_page.canonicalUrls.get(tab.id)});
    });
    el_goto_originating.disabled = !background_page.originatingUrls.has(tab.url);
    el_goto_originating.addEventListener('click', function() {
        chrome.tabs.update(tab.id, {url: background_page.originatingUrls.get(tab.url)});
    });

    background_page.popupNotifications.set(tab.id, () => {
        el_goto_amp.disabled = !background_page.ampUrls.has(tab.id);
        el_goto_canonical.disabled = !background_page.canonicalUrls.has(tab.id);
        el_goto_originating.disabled = !background_page.originatingUrls.has(tab.url);
    });

    var mainForm = document.getElementById('main-form');

    function sendReloadInstruction() {
        if (!el_disable_tab.checked) {
            chrome.tabs.sendMessage(tab.id, {
                message: 'navigate',
                url: originalPageUrl
            });
        }
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
        let forUrl = stateManager.forUrl(originalPageUrl);
        manage(forUrl.domainSettings, 'domain');
    }());
});
