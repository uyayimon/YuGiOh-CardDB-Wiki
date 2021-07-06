// Encoding.convert() and Encoding.urlEncode() are functions by

// encoding.js
// Copyright (c) 2014-2019 Polygon Planet
// https://github.com/polygonplanet/encoding.js
// MIT License
// https://github.com/polygonplanet/encoding.js/blob/master/LICENSE

const queryinfo = { active: true, currentWindow: true }

const urlIncludesParts = (target, ...urlPartial) =>
  urlPartial.every(element => target.includes(element));

const discernUrl = (target) => {
  if (urlIncludesParts(target, 'www.db.yugioh-card.com', 'cid=') ||
    urlIncludesParts(target, 'yugioh-wiki.net', '%A1%D4') ||
    urlIncludesParts(target, 'yugioh-wiki.net', '%E3%80%8A')) {
    return true;
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (discernUrl(tab.url))
    chrome.pageAction.show(tabId);
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

  const replacePDC = (writing1, writing2) => {
    const foundCardName = platformDependentCharCardList.find((pdcKey) => pdcKey[writing1] == cardName);

    if (foundCardName != undefined)
      replacedCardName = foundCardName[writing2];
    else
      replacedCardName = cardName;
  }

  if (urlIncludesParts(currentPageUrl, 'www.db.yugioh-card.com')) {
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

    if (urlIncludesParts(currentPageUrl, 'rushdb'))
      navPageUrl = `https://rush.yugioh-wiki.net/index.php?《${replacedCardName}》`;

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

  if (urlIncludesParts(currentPageUrl, 'yugioh-wiki.net')) {
    const leftBracket = currentPageName.indexOf('《');
    const rightBracket = currentPageName.indexOf('》');
    cardName = currentPageName.substring((leftBracket + 1), (rightBracket));

    // 機種依存文字を含む名前に変換
    replacePDC('wiki_name', 'official_name');

    // アルファベット→ローマ数字
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(value).join(key);
    }

    if (urlIncludesParts(currentPageUrl, 'rush'))
      navPageUrl = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=100&keyword=${replacedCardName}`;
    else
      navPageUrl = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=100&page=1&keyword=${encodeURI(replacedCardName)}`;
  }

  return {
    name1: cardName,
    name2: replacedCardName,
    link: navPageUrl
  }
}


const navigatePageDW = (adress) => {
  chrome.tabs.query(queryinfo, (tab) => {
    chrome.tabs.create({
      url: adress,
      index: tab[0].index + 1
    });
  });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // from nav-icon.js
  if (request.message == 'page_navigation') {
    const result = getCardName(sender.tab.title, sender.tab.url);
    navigatePageDW(result.link);
  }
  // from popup.js
  if (request.message == 'get_name&url') {
    chrome.tabs.query(queryinfo, (tab) => {
      const result = getCardName(tab[0].title, tab[0].url)
      sendResponse(result);
    });
  }
  return true;
});


chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query(queryinfo, (tab) => {
    if (!discernUrl(tab[0].url)) return;
    else {
      const result = getCardName(tab[0].title, tab[0].url)

      if (command == 'key_page_navigation')
        navigatePageDW(result.link);

      if (command == 'key_google_search')
        navigatePageDW(`https://www.google.com/search?q=${result.name1}`);
    }
  });
});
