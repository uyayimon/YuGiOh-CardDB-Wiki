chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(/www.db.yugioh-card.com/) && tab.url.match(/cid=/) ||
    tab.url.match(/yugioh-wiki.net/) && tab.url.match(/%A1%D4/)) {

      chrome.pageAction.show(tabId);
  }
});
