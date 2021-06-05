chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  const urlMatched = (urlPartial) => {
    return tab.url.match(urlPartial);
  }

  if (urlMatched(/www.db.yugioh-card.com/) && urlMatched(/cid=/) ||
    urlMatched(/yugioh-wiki.net/) && urlMatched(/%A1%D4/) ||
    urlMatched(/yugioh-wiki.net/) && urlMatched(/%E3%80%8A/)) {

      chrome.pageAction.show(tabId);
  }
});
