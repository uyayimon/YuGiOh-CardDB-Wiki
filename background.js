import "./js/encoding.js"
// Encoding.convert() and Encoding.urlEncode() are functions by

// encoding.js
// Copyright (c) 2014-2019 Polygon Planet
// https://github.com/polygonplanet/encoding.js
// MIT License
// https://github.com/polygonplanet/encoding.js/blob/master/LICENSE


async function checkInterconversionListVer() {
  // リモートファイルの読み込み
  try {
    const url = "https://raw.githubusercontent.com/uyayimon/YuGiOh-CardDB-Wiki_cardList/refs/heads/main/list_version.json";
    const res = await fetch(url);
    const remoteVersion = (await res.json()).version;

    const { interconversion_meta } = await chrome.storage.local.get("interconversion_meta");

    console.log("current version:", interconversion_meta ? interconversion_meta.version : null);
    console.log("new version:", remoteVersion);

    return (!interconversion_meta || interconversion_meta.version < remoteVersion) ? remoteVersion : null;

  } catch (error) {
    console.error("リモートバージョンファイルの読み込みに失敗しました:", error);
    return null;
  }
}

async function loadInterconversionListUpdated() {
  const updatedVersion = await checkInterconversionListVer();

  if (!updatedVersion) return false; // 更新なし

  // リモートファイルの読み込み
  try {
    const url = "https://raw.githubusercontent.com/uyayimon/YuGiOh-CardDB-Wiki_cardList/refs/heads/main/interconversion_list.json";
    const res = await fetch(url);
    const jsonData = await res.json();

    await chrome.storage.local.set({
      interconversion_meta: { version: updatedVersion },
      interconversion_list: jsonData.data
    });

    console.log("Interconversion list updated:", jsonData.version);
  } catch (error) {
    console.error("リモートカードリストファイルの読み込みに失敗しました:", error);
  }

  let { interconversion_list } = await chrome.storage.local.get("interconversion_list");

  // fallback: storageに未ロードなら内臓リストから読み込み
  if (!interconversion_list) {
    console.warn("interconversion_list not loaded. load in js/interconversion_list.json ...");
    try {
      let url = chrome.runtime.getURL("js/interconversion_list.json");
      let res = await fetch(url);
      let jsonData = await res.json();

      await chrome.storage.local.set({
        interconversion_meta: { version: jsonData.version },
        interconversion_list: jsonData.data
      });
      console.log("Interconversion list updated:", jsonData.version);
    } catch (error) {
      console.error("機種依存文字変換リストの読み込みに失敗しました:", error);
    }
  }

  // 最終確認: storageから取得できるかチェック
  const { interconversion_list: finalPdcList } = await chrome.storage.local.get("interconversion_list");
  if (!finalPdcList) {
    console.error("機種依存文字変換リストの読み込みに失敗しました:");
  }
}

// 起動時更新
chrome.runtime.onInstalled.addListener(loadInterconversionListUpdated);
chrome.runtime.onStartup.addListener(loadInterconversionListUpdated);

const queryInfo = { active: true, currentWindow: true }

/**
 * URLオブジェクトから現在のページのタイプを判定する
 * @param {string} urlString - URL文字列
 * @returns {'OCG_DB' | 'RUSH_DB' | 'OCG_WIKI' | 'RUSH_WIKI' | 'UNKNOWN'}
 */
const getUrlType = (urlString) => {
  try {
    const url = new URL(urlString);
    const host = url.host;
    const pathAndSearch = url.pathname + url.search;

    // A. OCG/RUSH DB 判定 (db.yugioh-card.com and cid=)
    if (host.includes('db.yugioh-card.com') && pathAndSearch.includes('cid')) {
      return pathAndSearch.includes('rushdb') ? 'RUSH_DB' : 'OCG_DB';
    }

    // B. OCG/RUSH Wiki 判定 (yugioh-wiki.net and specific symbols)
    if (host.includes('yugioh-wiki.net') && (pathAndSearch.includes('%A1%D4') || pathAndSearch.includes('%E3%80%8A'))) {
      return host.includes('rush') ? 'RUSH_WIKI' : 'OCG_WIKI';
    }

  } catch (e) {
    return 'UNKNOWN';
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // URLがまだ読み込まれていないか、変更がない場合はスキップ
  if (changeInfo.status !== 'complete' || !tab.url) {
    return;
  }

  // URLタイプを判定
  const urlType = getUrlType(tab.url);

  // 判定されたURLタイプがKNOWN（該当サイト）の場合にのみ、アクションアイコンを有効化
  if (urlType !== 'UNKNOWN') {
    chrome.action.enable(tabId);
  }
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
    title: '遊戯王ニューロンデータベースで検索',
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


/**
 * 現在のページ情報からカード名を取得し、ナビゲーション用のURLを作成する
 */
const getCardName = async (currentPageName, currentPageUrl) => {
  const urlObject = new URL(currentPageUrl);
  const urlType = getUrlType(urlObject);

  // UNKNOWNの場合は処理を中断
  if (urlType === 'UNKNOWN') {
    console.warn("URL type is UNKNOWN, skipping card name processing.");
    return null;
  }

  // JSONから取得し、storageに保持してある値
  const { interconversion_list } = await chrome.storage.local.get("interconversion_list");
  if (!interconversion_list) {
    console.error("機種依存文字変換リストの読み込みに失敗しました:");
    return null;
  }

  const {
    interconversionCardList,
    romanNumeralList,
    accentedCharacterList,
    interconversionCharacterList
  } = interconversion_list;

  let cardName;
  let replacedCardName;
  let navPageUrl;

  // 関数: カード名リストによる置換
  const replacePDC = (writing1, writing2) => {
    const foundCardName = interconversionCardList.find((pdcKey) => pdcKey[writing1] === cardName);
    replacedCardName = (foundCardName !== undefined) ? foundCardName[writing2] : cardName;
  }

  // URLタイプに応じて処理を分岐
  switch (urlType) {
    case 'OCG_DB':
    case 'RUSH_DB': {
      // ページタイトルからカード名を取得
      const barPosition = currentPageName.indexOf(' | ');
      cardName = currentPageName.substring(0, barPosition);

      // 機種依存文字を含まない名前に変換
      replacePDC('official_name', 'wiki_name');

      // ローマ数字・アクセント文字の置換
      [romanNumeralList, accentedCharacterList].forEach(list => {
        for (const [key, value] of Object.entries(list)) {
          replacedCardName = replacedCardName.split(key).join(value);
        }
      });

      // 半角記号・英数字の全角への変換
      replacedCardName = replacedCardName.replace(/-/g, '－');
      replacedCardName = replacedCardName.replace(/[A-Za-z0-9]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
      });

      // ナビゲーションURLの決定（Wikiへ）
      if (urlType === 'RUSH_DB') {
        navPageUrl = `https://rush.yugioh-wiki.net/index.php?《${replacedCardName}》`;
      } else {
        // エンコード
        const keywordArray = [];
        for (let i = 0; i < replacedCardName.length; i++) {
          keywordArray.push(replacedCardName.charCodeAt(i));
        }
        const keywordArray_euc = [];
        for (let i = 0; i < replacedCardName.length; i++) {
          keywordArray_euc.push(replacedCardName.charCodeAt(i));
        }
        const eucjpArray = Encoding.convert(keywordArray_euc, 'EUCJP', 'AUTO');
        const encodedKeyword = Encoding.urlEncode(eucjpArray);
        navPageUrl = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
      }
      break;
    }

    case 'OCG_WIKI':
    case 'RUSH_WIKI': {
      // ページタイトルからカード名を取得（《...》の部分）
      const leftBracket = currentPageName.indexOf('《');
      const rightBracket = currentPageName.indexOf('》');
      cardName = currentPageName.substring((leftBracket + 1), rightBracket);

      // 機種依存文字を含む名前に変換 (DB検索用)
      replacePDC('wiki_name', 'official_name');

      // DB検索で認識されない文字を半角スペースに変換
      for (const [key, value] of Object.entries(interconversionCharacterList)) {
        replacedCardName = replacedCardName.split(key).join(value);
      }

      // ナビゲーションURLの決定（DBへ）
      if (urlType === 'RUSH_WIKI') {
        // RUSH DB 検索
        navPageUrl = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=100&keyword=${replacedCardName}`;
      } else {
        // OCG DB 検索 (encodeURIを使用)
        navPageUrl = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=100&page=1&keyword=${encodeURI(replacedCardName)}`;
      }
      break;
    }
  }

  return {
    name1: cardName, // 取得元のページでのカード名（例：DBの日本語タイトル）
    name2: replacedCardName, // 変換後のカード名（例：Wiki名またはDB検索キーワード）
    link: navPageUrl // ナビゲーション先URL
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
    (async () => {
      const result = await getCardName(sender.tab.title, sender.tab.url);
      navigatePage(result.link);
    })();
  }
  // from popup.js
  if (request.message == 'get_name_url') {
    (async () => {
      // chrome.tabs.query を await で使う
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

      const tab = tabs[0];
      const result = await getCardName(tab.title, tab.url);

      sendResponse(result);
    })();

    return true;  // 非同期レスポンスを有効化
  }
});


chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query(queryInfo, async (tab) => {
    if (getUrlType(tab[0].url) == 'UNKNOWN') return;
    else {
      const result = await getCardName(tab[0].title, tab[0].url)

      if (command == 'key_page_navigation')
        navigatePage(result.link);

      if (command == 'key_google_search')
        navigatePage(`https://www.google.com/search?q=${result.name1}`);
    }
  });
});


chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query(queryInfo, async (tab) => {
    const result = await getCardName(tab[0].title, tab[0].url)
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
  })
});
