chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {

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
  const hankaku2Zenkaku = (str) => {
    return str.replace(/[A-Za-z0-9]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
  }

  let cardName;
  let substitutedCardName;
  let googleSearchWord;

  const pageName = tab[0].title;

  const dbWikiLink = document.getElementById('site_link');
  const dbWikitext = document.getElementById('site_link_text');
  const googleSearchLink = document.getElementById('google_search_link');

  if (tab[0].url.match(/www.db.yugioh-card.com/)) {

    const barPosition = pageName.indexOf(' | ');
    cardName = pageName.substr(0, barPosition);

    // 機種依存文字の表記変換
    for (let i in cardArray) {
      if (cardName == cardArray[i][0]) {
        substitutedCardName = cardArray[i][1];
        break;
      }
      substitutedCardName = cardName;
    }

    // ローマ数字をアルファベットに変換
    for (let i in romanNumeral) {
      substitutedCardName = substitutedCardName.split(romanNumeral[i][0]).join(romanNumeral[i][1]);
    }

    // ハイフンを全角に変換
    substitutedCardName = substitutedCardName.replace(/-/g, '－');

    // 半角アルファベットを全角に変換
    const zenkakuCardName = hankaku2Zenkaku(substitutedCardName);

    // 文字エンコード
    const keywordArray = [];
    for (let i in zenkakuCardName) {
      keywordArray.push(zenkakuCardName.charCodeAt(i));
    }
    const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
    const encodedKeyword = Encoding.urlEncode(eucjpArray);

    substitutedCardName = zenkakuCardName;

    dbWikitext.innerText = '遊戯王カードWikiで表示';
    dbWikiLink.href = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
  }

  if (tab[0].url.match(/yugioh-wiki.net/)) {
    const leftBracket = pageName.indexOf('《');
    const rightBracket = pageName.indexOf('》');
    cardName = pageName.substring((leftBracket + 1), (rightBracket));

    // 機種依存文字の表記変換
    for (let i in cardArray) {
      if (cardName == cardArray[i][1]) {
        substitutedCardName = cardArray[i][0];
        break;
      }
      substitutedCardName = cardName;
    }

    dbWikitext.innerText = '遊戯王公式データベースで検索';
    dbWikiLink.href = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=${substitutedCardName}`;
  }

  document.getElementById('card_name').innerText = cardName;


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
