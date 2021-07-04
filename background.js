// Encoding.convert() and Encoding.urlEncode() are functions by

// encoding.js
// Copyright (c) 2014-2019 Polygon Planet
// https://github.com/polygonplanet/encoding.js
// MIT License
// https://github.com/polygonplanet/encoding.js/blob/master/LICENSE


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


const getCardName = (currentPageName, currentPageUrl) => {
  // ローマ数字の変換リスト
  const romanNumeralList = {
    "Ⅹ": "Ｘ",
    "Ⅸ": "ＩⅩ",
    "Ⅷ": "ＶＩＩＩ",
    "Ⅶ": "ＶＩＩ",
    "Ⅵ": "ＶＩ",
    "Ⅳ": "ＩＶ",
    "Ⅴ": "Ｖ",
    "Ⅲ": "ＩＩＩ",
    "Ⅱ": "ＩＩ",
    "Ⅰ": "Ｉ"
  }

  let cardName;
  let replacedCardName;
  let navPageUrl;

  const urlIncludes = (urlPartial) => {
    return currentPageUrl.includes(urlPartial);
  }

  const replacePDC = (writing1, writing2) => {
    const foundCardName = platformDependentCharCardList.find((pdcKey) => pdcKey[writing1] == cardName);

    if (foundCardName != undefined) {
      replacedCardName = foundCardName[writing2];
    }
    else {
      replacedCardName = cardName;
    }
  }

  if (urlIncludes('www.db.yugioh-card.com')) {
    const barPosition = currentPageName.indexOf(' | ');
    cardName = currentPageName.substr(0, barPosition);

    // 機種依存文字を含まない名前に変換
    replacePDC('official_name', 'wiki_name');

    // ローマ数字→アルファベット
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(key).join(value);
    }

    // 半角→全角
    replacedCardName = replacedCardName.replace(/-/g, '－');
    replacedCardName = replacedCardName.replace(/[A-Za-z0-9]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });

    if (urlIncludes('rushdb')) {
      navPageUrl = `https://yugioh-wiki.net/rush/index.php?《${replacedCardName}》`;
    }

    else {
      // エンコード
      const keywordArray = [];
      for (let i = 0; i < replacedCardName.length; i++) {
        keywordArray.push(replacedCardName.charCodeAt(i));
      }
      const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
      const encodedKeyword = Encoding.urlEncode(eucjpArray);

      navPageUrl = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
    }
  }

  if (urlIncludes('yugioh-wiki.net')) {
    const leftBracket = currentPageName.indexOf('《');
    const rightBracket = currentPageName.indexOf('》');
    cardName = currentPageName.substring((leftBracket + 1), (rightBracket));

    // 機種依存文字を含む名前に変換
    replacePDC('wiki_name', 'official_name');

    // アルファベット→ローマ数字
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(value).join(key);
    }

    if (urlIncludes('rush')) {
      navPageUrl = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=100&keyword=${replacedCardName}`;
    }
    else {
      utfCardName = encodeURI(replacedCardName);
      navPageUrl = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=100&page=1&keyword=${utfCardName}`;
    }
  }
  return { name1: cardName, name2: replacedCardName, link: navPageUrl };
}


const navigatePageDW = (adress) => {
  window.open(adress);
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == 'page_navigation') {
    const result = getCardName(sender.tab.title, sender.tab.url)
    navigatePageDW(result.link);
  }
  if (request.message == 'get_name') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const result = getCardName(tab[0].title, tab[0].url)
      sendResponse(result);
    });
  }
  return true;
});


chrome.commands.onCommand.addListener((command) => {
  if (command == 'key_page_navigation') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const result = getCardName(tab[0].title, tab[0].url)
      navigatePageDW(result.link);
    });
  }
});
