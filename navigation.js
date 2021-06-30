// 要素の生成
const newElement = document.createElement('div');
newElement.setAttribute('id', 'navigation_icon');

const img_element = document.createElement('img');
const iconURL = chrome.extension.getURL('icons/iconDW.png');
img_element.src = iconURL;
newElement.appendChild(img_element);

const p1 = document.createElement('p');
const text1 = document.createTextNode('×');
newElement.appendChild(p1);
p1.appendChild(text1);
p1.setAttribute('id', 'close');

document.body.appendChild(newElement);
const navIcon = document.getElementById('navigation_icon');

chrome.storage.local.get({ icon_position_y: '200px', icon_position_x: '90%' }, (items) => {
  const positionTop = items.icon_position_y;
  const positionLeft = items.icon_position_x;

  navIcon.style.top = positionTop;
  navIcon.style.left = positionLeft;
});

const navigatePage = () => {
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

  const pageName = document.title;
  const currentUrl = location.href;
  let cardName;
  let replacedCardName;

  const urlIncludes = (urlPartial) => {
    return currentUrl.includes(urlPartial);
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
      window.open("https://yugioh-wiki.net/rush/index.php?《" + replacedCardName + "》");
    }

    else {
      // エンコード
      const keywordArray = [];
      for (let i = 0; i < replacedCardName.length; i++) {
        keywordArray.push(replacedCardName.charCodeAt(i));
      }
      const eucjpArray = Encoding.convert(keywordArray, 'EUCJP', 'AUTO');
      const encodedKeyword = Encoding.urlEncode(eucjpArray);

      window.open("https://yugioh-wiki.net/index.php?%A1%D4" + encodedKeyword + "%A1%D5");
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

    let url;
    if (urlIncludes('rush')) {
      url = `https://www.db.yugioh-card.com/rushdb/card_search.action?ope=1&sess=1&rp=100&keyword=${replacedCardName}`;
    }
    else {
      utfCardName = encodeURI(replacedCardName);

      url = `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=100&page=1&keyword=${utfCardName}`;
    }

    window.open(url);
  }
}


navIcon.ondragstart = (event) => {
  return false;
}

let iconMoved  = false;

const onMouseMove = (event) => {
  let x = event.clientX;
  let y = event.clientY;
  let width = navIcon.offsetWidth;
  let height = navIcon.offsetHeight;
  navIcon.style.top = (y - height / 2) + 'px';
  navIcon.style.left = (x - width / 2) + 'px';

  iconMoved = true;
}

navIcon.onmousedown = (event) => {
  document.addEventListener('mousemove', onMouseMove);
  iconMoved = false;
}

navIcon.onmouseup = (event) => {
  document.removeEventListener('mousemove', onMouseMove);

  const window_w = window.innerWidth;
  const window_h = window.innerHeight;
  const clientRect = navIcon.getBoundingClientRect();
  const iconX = clientRect.left;
  const iconY = clientRect.top;

  chrome.storage.local.set(
    {
      icon_position_y: (iconY / window_h) * 100 + '%',
      icon_position_x: (iconX / window_w) * 100 + '%'
    }
  );

  if (iconMoved) {
    return;
  }
  navigatePage();
}


document.getElementById('close').addEventListener('mouseup', (event) => {
  event.stopPropagation();
  document.body.removeChild(navIcon);
});
