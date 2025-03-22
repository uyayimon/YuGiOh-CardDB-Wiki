// 機種依存文字の対応
export const interconversionCardList = [
  // 機種依存文字の読み方がカード名の読み方と一致するカード
  {
    official_name: "黄紡鮄デュオニギス",
    wiki_name: "黄紡ぼうデュオニギス"
  },
  {
    official_name: "契珖のヴルーレセンス",
    wiki_name: "契こうのヴルーレセンス"
  },
  {
    official_name: "S－Force プロフェッサー・Ϝ",
    wiki_name: "Ｓ－Ｆｏｒｃｅ プロフェッサー・ディガンマ"
  },
  {
    official_name: "機巧辰－高闇御津羽靇",
    wiki_name: "機巧辰－高闇御津羽オカミ"
  },
  {
    official_name: "登竜華恐巄門",
    wiki_name: "登竜華恐ろう門"
  },
  {
    official_name: "ユベル－Das Ewig Liebe Wächter",
    wiki_name: "ユベル－Ｄａｓ Ｅｗｉｇ Ｌｉｅｂｅ Ｗａｃｈｔｅｒ"
  },
  {
    official_name: "琰魔竜王 レッド・デーモン・カラミティ",
    wiki_name: "えん魔竜王 レッド・デーモン・カラミティ"
  },
  {
    official_name: "琰魔竜 レッド・デーモン",
    wiki_name: "えん魔竜 レッド・デーモン"
  },
  {
    official_name: "琰魔竜 レッド・デーモン・アビス",
    wiki_name: "えん魔竜 レッド・デーモン・アビス"
  },
  {
    official_name: "琰魔竜 レッド・デーモン・ベリアル",
    wiki_name: "えん魔竜 レッド・デーモン・ベリアル"
  },
  {
    official_name: "罡炎星－リシュンキ",
    wiki_name: "こう炎星－リシュンキ"
  },
  {
    official_name: "真閃珖竜 スターダスト・クロニクル",
    wiki_name: "真閃こう竜 スターダスト・クロニクル"
  },
  {
    official_name: "聖珖神竜 スターダスト・シフル",
    wiki_name: "聖こう神竜 スターダスト・シフル"
  },
  {
    official_name: "CiNo.1000 夢幻虚光神ヌメロニアス・ヌメロニア",
    wiki_name: "ＣｉＮｏ.１０００ 夢幻虚光神ヌメロニアス・ヌメロニア"
  },
  {
    official_name: "CNo.1000 夢幻虚神ヌメロニアス",
    wiki_name: "ＣＮｏ.１０００ 夢幻虚神ヌメロニアス"
  },
  {
    official_name: "神峰之天津靇",
    wiki_name: "神峰之天津オカミ"
  },
  {
    official_name: "炎舞－「天璣」",
    wiki_name: "炎舞－「天キ」"
  },
  {
    official_name: "恐巄竜華－㟴巴",
    wiki_name: "恐ろう竜華－かい巴"
  },
  {
    official_name: "Nouvellez Auberge 『À Table』",
    wiki_name: "Ｎｏｕｖｅｌｌｅｚ Ａｕｂｅｒｇｅ 『Ａ Ｔａｂｌｅ』"
  },
  {
    official_name: "魔界台本「魔界の宴咜女」",
    wiki_name: "魔界台本「魔界の宴タ女」"
  },
  {
    official_name: "炎舞－「天璇」",
    wiki_name: "炎舞－「天セン」"
  },
  {
    official_name: "Recette de Spécialité～料理長自慢のレシピ～",
    wiki_name: "Ｒｅｃｅｔｔｅ ｄｅ Ｓｐｅｃｉａｌｉｔｅ～料理長自慢のレシピ～"
  },

  // 機種依存文字の読み方がカード名の読み方と一致しないカード
  {
    official_name: "白棘鱏",
    wiki_name: "ホワイト・スティングレイ"
  },
  {
    official_name: "白鱓",
    wiki_name: "ホワイト・モーレイ"
  },
  {
    official_name: "絶火の祆現",
    wiki_name: "ヴリトラ・マギストス"
  },
  {
    official_name: "羅睺星辰",
    wiki_name: "ラーフ・ドラゴンテイル"
  },
  {
    official_name: "星墜つる地に立つ閃珖",
    wiki_name: "スターダスト・リ・スパーク"
  },

  // 異体字が使われているカード
  {
    official_name: "K９－ØØ号 ルプス",
    wiki_name: "Ｋ９－００号 ルプス"
  },
  {
    official_name: "K９－ØØ号 “Hound”",
    wiki_name: "Ｋ９－００号 “Ｈｏｕｎｄ”"
  },

  // 公式データベースでのみ異体字（機種依存文字）になっているカード
  {
    official_name: "俱利伽羅天童",
    wiki_name: "倶利伽羅天童"
  },

  // なんかしらんけど違うカード
  {
    official_name: "軍貫処 『海せん』",
    wiki_name: "軍貫処『海せん』"
  }
]


// ローマ数字の変換（Wiki向け）
export const romanNumeralList = {
  "Ⅹ": "Ｘ",
  "Ⅸ": "ＩＸ",
  "Ⅷ": "ＶＩＩＩ",
  "Ⅶ": "ＶＩＩ",
  "Ⅵ": "ＶＩ",
  "Ⅳ": "ＩＶ",
  "Ⅴ": "Ｖ",
  "Ⅲ": "ＩＩＩ",
  "Ⅱ": "ＩＩ",
  "Ⅰ": "Ｉ"
}


// 文字の変換（DB検索対策）
export const interconversionCharacterList = {
  "～": " ",
  "“": " ",
  "”": " ",
  "Ｘ": " ",
  "Ｖ": " ",
  "Ｉ": " "
}
