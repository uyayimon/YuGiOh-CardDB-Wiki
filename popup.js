chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {

  // 機種依存文字の対応
  const substituteCardList = [
    {
      "official_name": "黄紡鮄デュオニギス",
      "Wiki_name": "黄紡ぼうデュオニギス"
    },
    {
      "official_name": "契珖のヴルーレセンス",
      "Wiki_name": "契こうのヴルーレセンス"
    },
    {
      "official_name": "S－Force プロフェッサー・Ϝ",
      "Wiki_name": "Ｓ－Ｆｏｒｃｅ プロフェッサー・ディガンマ"
    },
    {
      "official_name": "機巧辰－高闇御津羽靇",
      "Wiki_name": "機巧辰－高闇御津羽オカミ"
    },
    {
      "official_name": "琰魔竜王 レッド・デーモン・カラミティ",
      "Wiki_name": "えん魔竜王 レッド・デーモン・カラミティ"
    },
    {
      "official_name": "琰魔竜 レッド・デーモン",
      "Wiki_name": "えん魔竜 レッド・デーモン"
    },
    {
      "official_name": "琰魔竜 レッド・デーモン・アビス",
      "Wiki_name": "えん魔竜 レッド・デーモン・アビス"
    },
    {
      "official_name": "琰魔竜 レッド・デーモン・ベリアル",
      "Wiki_name": "えん魔竜 レッド・デーモン・ベリアル"
    },
    {
      "official_name": "罡炎星－リシュンキ",
      "Wiki_name": "こう炎星－リシュンキ"
    },
    {
      "official_name": "真閃珖竜 スターダスト・クロニクル",
      "Wiki_name": "真閃こう竜 スターダスト・クロニクル"
    },
    {
      "official_name": "聖珖神竜 スターダスト・シフル",
      "Wiki_name": "聖こう神竜 スターダスト・シフル"
    },
    {
      "official_name": "CiNo.1000 夢幻虚光神ヌメロニアス・ヌメロニア",
      "Wiki_name": "ＣｉＮｏ.１０００ 夢幻虚光しんヌメロニアス・ヌメロニア"
    },
    {
      "official_name": "CNo.1000 夢幻虚神ヌメロニアス",
      "Wiki_name": "ＣＮｏ.１０００ 夢幻虚しんヌメロニアス"
    },
    {
      "official_name": "神峰之天津靇",
      "Wiki_name": "神峰之天津オカミ"
    },
    {
      "official_name": "炎舞－「天璣」",
      "Wiki_name": "炎舞－「天キ」"
    },
    {
      "official_name": "魔界台本「魔界の宴咜女」",
      "Wiki_name": "魔界台本「魔界の宴タ女」"
    },
    {
      "official_name": "炎舞－「天璇」",
      "Wiki_name": "炎舞－「天セン」"
    },
    {
      "official_name": "白棘鱏",
      "Wiki_name": "ホワイト・スティングレイ"
    },
    {
      "official_name": "白鱓",
      "Wiki_name": "ホワイト・モーレイ"
    },
    {
      "official_name": "絶火の祆現",
      "Wiki_name": "ヴリトラ・マギストス"
    },
    {
      "official_name": "星墜つる地に立つ閃珖",
      "Wiki_name": "スターダスト・リ・スパーク"
    }
  ]

  // ローマ数字の対応
  const romanNumeralList = [
    ["Ⅹ", "Ｘ"],
    ["Ⅸ", "ＩⅩ"],
    ["Ⅷ", "ＶＩＩＩ"],
    ["Ⅶ", "ＶＩＩ"],
    ["Ⅵ", "ＶＩ"],
    ["Ⅴ", "Ｖ"],
    ["Ⅳ", "ＩＶ"],
    ["Ⅲ", "ＩＩＩ"],
    ["Ⅱ", "ＩＩ"],
    ["Ⅰ", "Ｉ"]
  ]

  const siteLink = document.getElementById('site_link');
  const siteLinkText = document.getElementById('site_link_text');
  const googleSearchLink = document.getElementById('google_search_link');

  const pageName = tab[0].title;
  let cardName;
  let substitutedCardName;
  let googleSearchWord;

  if (tab[0].url.match(/www.db.yugioh-card.com/)) {
    const barPosition = pageName.indexOf(' | ');
    cardName = pageName.substr(0, barPosition);

    // 機種依存文字の表記変換
    const foundCardName = substituteCardList.find(({ official_name }) => official_name == cardName);

    if (foundCardName != undefined) {
      substitutedCardName = foundCardName.Wiki_name;
    }
    else {
      substitutedCardName = cardName;
    }

    // ローマ数字をアルファベットに変換
    for (let i in romanNumeralList) {
      substitutedCardName = substitutedCardName.split(romanNumeralList[i][0]).join(romanNumeralList[i][1]);
    }

    // ハイフンを全角に変換
    substitutedCardName = substitutedCardName.replace(/-/g, '－');

    // 半角アルファベットを全角に変換
    substitutedCardName = substitutedCardName.replace(/[A-Za-z0-9]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });

    // 文字エンコード(encoding.js)
    const keywordArray = [];
    for (let i in substitutedCardName) {
      keywordArray.push(substitutedCardName.charCodeAt(i));
    }
    const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
    const encodedKeyword = Encoding.urlEncode(eucjpArray);

    siteLinkText.innerText = '遊戯王カードWikiで表示';
    siteLink.href = `https://yugioh-wiki.net/index.php?%A1%D4${encodedKeyword}%A1%D5`;
  }

  if (tab[0].url.match(/yugioh-wiki.net/)) {
    const leftBracket = pageName.indexOf('《');
    const rightBracket = pageName.indexOf('》');
    cardName = pageName.substring((leftBracket + 1), (rightBracket));

    // 機種依存文字の表記変換
    const foundCardName = substituteCardList.find(({ Wiki_name }) => Wiki_name == cardName);

    if (foundCardName != undefined) {
      substitutedCardName = foundCardName.official_name;
    }
    else {
      substitutedCardName = cardName;
    }

    // アルファベットをローマ数字に変換
    for (let i in romanNumeralList) {
      substitutedCardName = substitutedCardName.split(romanNumeralList[i][1]).join(romanNumeralList[i][0]);
    }

    siteLinkText.innerText = '遊戯王公式データベースで検索';
    siteLink.href = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=${substitutedCardName}`;
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
