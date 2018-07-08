 function BadgeText() {
    chrome.windows.getAll(
        {populate:true},
        function (windows) {
            var number = 0
            for (let i = 0; i < windows.length; i++) {
                number += windows[i].tabs.length
            }
            if (number > 20) {
                chrome.browserAction.setBadgeBackgroundColor({color:'#FF0000'})
            }
            else {
                chrome.browserAction.setBadgeBackgroundColor({color:'#4780f3'})
            }
            var number = String(number);
            chrome.browserAction.setBadgeText(
                {
                    'text':number
                }
            )
            chrome.browserAction.setTitle({title:"Đang mở " + number + " tab - Keep Your Session" })
        }
    )
     chrome.storage.sync.get(function (data) {
         console.log(data)
     })
     chrome.storage.sync.get(function (data) {
         console.log(data)
     })
}
BadgeText();
chrome.tabs.onCreated.addListener(
    function () {
        BadgeText();
    }
);
chrome.windows.onRemoved.addListener(
    function () {
        BadgeText();
    }
);
chrome.tabs.onCreated.addListener(
    function () {
        BadgeText();
    }
);
chrome.tabs.onRemoved.addListener(
    function () {
        BadgeText();
    }
);