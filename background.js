import "./js/encoding.js"
// Encoding.convert() and Encoding.urlEncode() are functions by

// encoding.js
// Copyright (c) 2014-2019 Polygon Planet
// https://github.com/polygonplanet/encoding.js
// MIT License
// https://github.com/polygonplanet/encoding.js/blob/master/LICENSE


import { interconversionCardList, romanNumeralList, accentedCharacterList, interconversionCharacterList } from "./js/PDC_list.js"

const queryInfo = { active: true, currentWindow: true }

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
    chrome.action.enable(tabId);
});


// コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {

  const contextParent1 = chrome.contextMenus.create({
    id: 'context_key_page_navigation',
    title: '遊戯王DB⇔Wiki',
    documentUrlPatterns: [
      "https://www.db.yugioh-card.com/*/*cid*",
      "https://yugioh-wiki.net/*%A1%D4%*",
      "https://rush.yugioh-wiki.net/*%E3%80%8A*",
      "https://yugioh-wiki.net/*%E3%80%8A*"
    ],
  });
  chrome.contextMenus.create({
    parentId: contextParent1,
    id: 'context_wiki_page_navigation',
    title: '遊戯王カードWikiで表示',
    documentUrlPatterns: [
      "https://www.db.yugioh-card.com/*/*cid*"
    ],
  });
  chrome.contextMenus.create({
    parentId: contextParent1,
    id: 'context_db_page_navigation',
    title: '遊戯王公式データベースで検索',
    documentUrlPatterns: [
      "https://yugioh-wiki.net/*%A1%D4%*",
      "https://rush.yugioh-wiki.net/*%E3%80%8A*",
      "https://yugioh-wiki.net/*%E3%80%8A*"
    ],
  });
  // セパレータ
  chrome.contextMenus.create({
    parentId: contextParent1,
    id: "separator1",
    type: "separator",
    documentUrlPatterns: [
      "https://www.db.yugioh-card.com/*/*cid*",
      "https://yugioh-wiki.net/*%A1%D4%*",
      "https://rush.yugioh-wiki.net/*%E3%80%8A*",
      "https://yugioh-wiki.net/*%E3%80%8A*"
    ],
  });
  chrome.contextMenus.create({
    parentId: contextParent1,
    id: 'context_google_search',
    title: 'カード名をGoogle検索',
    documentUrlPatterns: [
      "https://www.db.yugioh-card.com/*/*cid*",
      "https://yugioh-wiki.net/*%A1%D4%*",
      "https://rush.yugioh-wiki.net/*%E3%80%8A*",
      "https://yugioh-wiki.net/*%E3%80%8A*"
    ],
  });
  const contextParent2 = chrome.contextMenus.create({
    id: 'context_key_page_navigation_select',
    title: '遊戯王DB⇔Wiki',
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    parentId: contextParent2,
    id: 'context_select_db_search',
    title: '選択テキストを遊戯王OCGデータベースで検索',
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    parentId: contextParent2,
    id: 'context_select_rush_db_search',
    title: '選択テキストをラッシュデュエルデータベースで検索',
    contexts: ["selection"]
  });
});


const getCardName = (currentPageName, currentPageUrl) => {
  let cardName;
  let replacedCardName;
  let navPageUrl;

  const replacePDC = (writing1, writing2) => {
    const foundCardName = interconversionCardList.find((pdcKey) => pdcKey[writing1] == cardName);

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

    // ローマ数字をアルファベットで代用
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(key).join(value);
    }

    // アクセントがついた文字を代用
    for (const [key, value] of Object.entries(accentedCharacterList)) {
      replacedCardName = replacedCardName.split(key).join(value);
    }

    // 半角を全角に変換
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

    // DB検索において認識されない文字を半角スペースに変換
    for (const [key, value] of Object.entries(interconversionCharacterList)) {
      replacedCardName = replacedCardName.split(key).join(value);
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


const navigatePage = (adress) => {
  chrome.tabs.query(queryInfo, (tab) => {
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
    navigatePage(result.link);
  }
  // from popup.js
  if (request.message == 'get_name_url') {
    chrome.tabs.query(queryInfo, (tab) => {
      const result = getCardName(tab[0].title, tab[0].url)
      sendResponse(result);
    });
  }
  return true;
});


chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query(queryInfo, (tab) => {
    if (!discernUrl(tab[0].url)) return;
    else {
      const result = getCardName(tab[0].title, tab[0].url)

      if (command == 'key_page_navigation')
        navigatePage(result.link);

      if (command == 'key_google_search')
        navigatePage(`https://www.google.com/search?q=${result.name1}`);
    }
  });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query(queryInfo, (tab) => {
    const result = getCardName(tab[0].title, tab[0].url)
    let navPageUrl;
    let searchWord;

    switch (info.menuItemId) {
      case "context_wiki_page_navigation":
      case "context_db_page_navigation":
        navPageUrl = result.link;
        break;
      case "context_google_search":
        navPageUrl = `https://www.google.com/search?q=${result.name1}`;
        break;
      case "context_select_db_search":
        searchWord = info.selectionText;
        navPageUrl = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=100&page=1&keyword=${encodeURI(searchWord)}`;
        break;
      case "context_select_rush_db_search":
        searchWord = info.selectionText;
        navPageUrl = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=100&keyword=${searchWord}`;
        break;
      default:
        return;
    }

    navigatePage(navPageUrl);
  }

  )
});
