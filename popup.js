chrome.tabs.getSelected(null, function (tab) {

  // 機種依存文字の対応
  const cardArray = [
    ["黄紡鮄デュオニギス", "黄紡ぼうデュオニギス"],
    ["契珖のヴルーレセンス", "契こうのヴルーレセンス"],
    ["S－Force プロフェッサー・Ϝ", "Ｓ－Ｆｏｒｃｅ プロフェッサー・ディガンマ"],
    ["機巧辰－高闇御津羽靇", "機巧辰－高闇御津羽オカミ"],
    ["琰魔竜王 レッド・デーモン・カラミティ", "えん魔竜王 レッド・デーモン・カラミティ"],
    ["琰魔竜 レッド・デーモン", "えん魔竜 レッド・デーモン"],
    ["琰魔竜 レッド・デーモン・アビス", "えん魔竜 レッド・デーモン・アビス"],
    ["琰魔竜 レッド・デーモン・ベリアル", "えん魔竜 レッド・デーモン・ベリアル"],
    ["罡炎星－リシュンキ", "こう炎星－リシュンキ"],
    ["真閃珖竜 スターダスト・クロニクル", "真閃こう竜 スターダスト・クロニクル"],
    ["聖珖神竜 スターダスト・シフル", "聖こう神竜 スターダスト・シフル"],
    ["CiNo.1000 夢幻虚光神ヌメロニアス・ヌメロニア", "ＣｉＮｏ.１０００ 夢幻虚光しんヌメロニアス・ヌメロニア"],
    ["CNo.1000 夢幻虚神ヌメロニアス", "ＣＮｏ.１０００ 夢幻虚しんヌメロニアス"],
    ["神峰之天津靇", "神峰之天津オカミ"],
    ["炎舞－「天璣」", "炎舞－「天キ」"],
    ["魔界台本「魔界の宴咜女」", "魔界台本「魔界の宴タ女」"],
    ["炎舞－「天璇」", "炎舞－「天セン」"],
    ["白棘鱏", "ホワイト・スティングレイ"],
    ["白鱓", "ホワイト・モーレイ"],
    ["絶火の祆現", "ヴリトラ・マギストス"],
    ["星墜つる地に立つ閃珖", "スターダスト・リ・スパーク"]
  ]

  // ローマ数字の対応
  const romanNumeral = [
    ["Ⅰ", "Ｉ"],
    ["Ⅱ", "ＩＩ"],
    ["Ⅲ", "ＩＩＩ"],
    ["Ⅳ", "ＩＶ"],
    ["Ⅴ", "Ｖ"],
    ["Ⅵ", "ＶＩ"],
    ["Ⅶ", "ＶＩＩ"],
    ["Ⅷ", "ＶＩＩＩ"],
    ["Ⅸ", "ＩⅩ"],
    ["Ⅹ", "Ｘ"]
  ]

  // 半角→全角
  const hankaku2Zenkaku = function (str) {
    return str.replace(/[A-Za-z0-9]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
  }

  const pageName = tab.title;

  let cardName;
  let substitutedCardName;
  let googleSearchWord;

  const dbWikiLink = document.querySelector('#site_link');
  const googleSearchLink = document.querySelector('#google_search_link');


  if (tab.url.match(/www.db.yugioh-card.com/)) {

    const bar = pageName.indexOf(' | ');
    cardName = pageName.substr(0, bar);

    substitutedCardName = cardName;

    // 機種依存文字の表記変換
    for (let i in cardArray) {
      if (cardName == cardArray[i][0]) {
        substitutedCardName = cardArray[i][1];
        break;
      }
    }

    // ローマ数字
    for (let i in romanNumeral) {
      substitutedCardName = substitutedCardName.split(romanNumeral[i][0]).join(romanNumeral[i][1]);
    }

    substitutedCardName = substitutedCardName.replace(/-/g, '－');


    // 半角文字を全角に変換
    const zenkakuCardName = hankaku2Zenkaku(substitutedCardName);


    // 文字エンコード
    const keywordArray = [];
    for (let i = 0; i < zenkakuCardName.length; i++) {
      keywordArray.push(zenkakuCardName.charCodeAt(i));
    }
    const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
    const encodedKeyword = Encoding.urlEncode(eucjpArray);

    substitutedCardName = zenkakuCardName;

    dbWikiLink.innerHTML = '遊戯王カードWikiで表示';
    dbWikiLink.href = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
  }

  if (tab.url.match(/yugioh-wiki.net/)) {
    const leftBracket = pageName.indexOf('《');
    const rightBracket = pageName.indexOf('》');
    cardName = pageName.substring((leftBracket + 1), (rightBracket));

    substitutedCardName = cardName;

    // 機種依存文字の表記変換
    for (let i in cardArray) {
      if (cardName == cardArray[i][1]) {
        substitutedCardName = cardArray[i][0];
        break;
      }
    }

    dbWikiLink.innerHTML = '遊戯王公式データベースで検索';
    dbWikiLink.href = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=${substitutedCardName}`;
  }

  document.querySelector('#card_name').innerHTML = `${cardName}<br>${substitutedCardName}`;


  googleSearchLink.addEventListener('click', function () {
    if (document.querySelector('#search_word').checked) {
      googleSearchWord = `https://www.google.com/search?q=${cardName} 遊戯王`;
    }
    else {
      googleSearchWord = `https://www.google.com/search?q=${cardName}`;
    }

    googleSearchLink.href = googleSearchWord;
  });
});
