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
  const googleSearchLink = document.getElementById('google_search_link');

  const pageName = tab[0].title;
  let cardName;
  let replacedCardName;
  let googleSearchWord;

  const urlMatched = (urlPartial) => {
    return tab[0].url.match(urlPartial);
  }

  if (urlMatched(/www.db.yugioh-card.com/)) {
    const barPosition = pageName.indexOf(' | ');
    cardName = pageName.substr(0, barPosition);

    // 機種依存文字の表記変換
    const foundCardName = platformDependentCharCardList.find(({ official_name }) => official_name == cardName);
    if (foundCardName != undefined) {
      replacedCardName = foundCardName.Wiki_name;
    }
    else {
      replacedCardName = cardName;
    }

    // ローマ数字をアルファベットに変換
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(key).join(value);
    }

    replacedCardName = replacedCardName.replace(/-/g, '－');

    // 半角アルファベットを全角に変換
    replacedCardName = replacedCardName.replace(/[A-Za-z0-9]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });

    if (urlMatched(/yugiohdb/)) {
      // 文字エンコード(encoding.js)
      const keywordArray = [];
      for (let i = 0; i < replacedCardName.length; i++) {
        keywordArray.push(replacedCardName.charCodeAt(i));
      }
      const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
      const encodedKeyword = Encoding.urlEncode(eucjpArray);

      siteLinkText.innerText = '遊戯王カードWikiで表示';
      siteLink.href = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
    }

    else if (urlMatched(/rushdb/)) {
      siteLinkText.innerText = 'ラッシュデュエルWikiで表示';
      siteLink.href = `https://yugioh-wiki.net/rush/index.php?《${replacedCardName}》`;
    }
  }

  if (urlMatched(/yugioh-wiki.net/)) {
    const leftBracket = pageName.indexOf('《');
    const rightBracket = pageName.indexOf('》');
    cardName = pageName.substring((leftBracket + 1), (rightBracket));

    // 機種依存文字の表記変換
    const foundCardName = platformDependentCharCardList.find(({ Wiki_name }) => Wiki_name == cardName);
    if (foundCardName != undefined) {
      replacedCardName = foundCardName.official_name;
    }
    else {
      replacedCardName = cardName;
    }

    // アルファベットをローマ数字に変換
    for (const [key, value] of Object.entries(romanNumeralList)) {
      replacedCardName = replacedCardName.split(value).join(key);
    }

    if (urlMatched(/rush/)) {
      siteLinkText.innerText = 'ラッシュデュエルデータベースで検索';
      siteLink.href = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=20&keyword=${replacedCardName}`;
    }
    else {
      siteLinkText.innerText = '遊戯王OCGデータベースで検索';
      siteLink.href = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=${replacedCardName}`;
    }

  }

  document.getElementById('card_name').innerText = cardName
    // + "\n" +
    // replacedCardName
    // + "\n" +
    // siteLink.href
    ;


  googleSearchLink.addEventListener('click', () => {
    if (document.getElementById('search_word').checked) {
      googleSearchWord = cardName + ' 遊戯王';
    }
    else {
      googleSearchWord = cardName;
    }

    googleSearchLink.href = `https://www.google.com/search?q=${googleSearchWord}`;
  });
});
