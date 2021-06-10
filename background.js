chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  const urlIncludes = (element) => tab.url.includes(element);
  const urlIncludesParts = (...urlPartial) => {
    return urlPartial.every(urlIncludes);
  }

  if (urlIncludesParts('www.db.yugioh-card.com', 'cid=') ||
    urlIncludesParts('yugioh-wiki.net', '%A1%D4') ||
    urlIncludesParts('yugioh-wiki.net', '%E3%80%8A')) {

    chrome.pageAction.show(tabId);
  }
});
