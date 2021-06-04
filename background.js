chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.match(/www.db.yugioh-card.com/) && tab.url.match(/cid=/) ||
    tab.url.match(/yugioh-wiki.net/) && tab.url.match(/%A1%D4/) ||
    tab.url.match(/yugioh-wiki.net/) && tab.url.match(/%E3%80%8A/)) {

      chrome.pageAction.show(tabId);
  }
});
