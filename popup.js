// Encoding.convert() and Encoding.urlEncode() are functions by

// encoding.js
// Copyright (c) 2014-2019 Polygon Planet
// https://github.com/polygonplanet/encoding.js
// MIT License
// https://github.com/polygonplanet/encoding.js/blob/master/LICENSE


chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {

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

  const siteLink = document.getElementById('site_link');
  const siteLinkText = document.getElementById('site_link_text');

  const pageName = tab[0].title;
  let cardName;
  let replacedCardName;

  const urlIncludes = (urlPartial) => {
    return tab[0].url.includes(urlPartial);
  }

  const replacePDC = (writing1, writing2) => {
    const foundCardName = platformDependentCharCardList.find(( pdcKey ) => pdcKey[writing1] == cardName);

    if (foundCardName != undefined) {
      replacedCardName = foundCardName[writing2];
    }
    else {
      replacedCardName = cardName;
    }
  }


  if (urlIncludes('www.db.yugioh-card.com')) {
    const barPosition = pageName.indexOf(' | ');
    cardName = pageName.substr(0, barPosition);

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
      siteLinkText.innerText = '《ラッシュデュエルWikiで表示》';
      siteLinkText.classList.add('to_wiki');
      siteLink.href = `https://yugioh-wiki.net/rush/index.php?《${replacedCardName}》`;
    }

    else {
      // エンコード
      const keywordArray = [];
      for (let i = 0; i < replacedCardName.length; i++) {
        keywordArray.push(replacedCardName.charCodeAt(i));
      }
      const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
      const encodedKeyword = Encoding.urlEncode(eucjpArray);

      siteLinkText.innerText = '《遊戯王カードWikiで表示》';
      siteLinkText.classList.add('to_wiki');
      siteLink.href = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
    }
  }

  if (urlIncludes('yugioh-wiki.net')) {
    const leftBracket = pageName.indexOf('《');
    const rightBracket = pageName.indexOf('》');
    cardName = pageName.substring((leftBracket + 1), (rightBracket));

    // 機種依存文字を含む名前に変換
    replacePDC('wiki_name', 'official_name');

    // アルファベット→ローマ数字
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(value).join(key);
    }

    if (urlIncludes('rush')) {
      siteLinkText.innerText = 'ラッシュデュエル\nデータベースで検索';
      siteLinkText.classList.add('to_db');
      siteLink.href = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=100&keyword=${replacedCardName}`;
    }
    else {
      siteLinkText.innerText = '遊戯王OCGデータベースで検索';
      siteLinkText.classList.add('to_db');
      siteLink.href = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=100&page=1&keyword=${replacedCardName}`;
    }
  }

  document.getElementById('card_name').innerText = cardName;

  siteLink.focus();


  const googleSearchLink = document.getElementById('google_search_link');
  const googleSearchLinkYugioh = document.getElementById('google_search_link_yugioh');

  googleSearchWord = cardName;

  if (urlIncludes('yugioh-wiki.net')) {
    googleSearchWord = replacedCardName;
  }

  googleSearchLink.href = `https://www.google.com/search?q=${googleSearchWord}`;
  googleSearchLinkYugioh.href = `https://www.google.com/search?q=${googleSearchWord}\+遊戯王`;
});
