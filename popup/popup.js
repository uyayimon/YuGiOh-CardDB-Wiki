chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {

  const currentUrlString = tab[0].url;
  const urlObject = new URL(currentUrlString); const siteLink = document.getElementById('site_link');
  const siteLinkText = document.getElementById('site_link_text');
  const googleSearchLink = document.getElementById('google_search_link');
  const googleSearchLinkYugioh = document.getElementById('google_search_link_yugioh');

  const changePopupDefault = () => {
    const variable_elements = document.querySelectorAll('.variable_element');
    variable_elements.forEach((element) => {
      element.classList.add('disabled');
    });
    const default_elements = document.querySelectorAll('.default_element');
    default_elements.forEach((element) => {
      element.classList.remove('disabled');
    });
  }

  /**
   * 現在のURLがどの遊戯王関連サイトに該当するかを判定する
   * @param {URL} url - 現在のページのURLオブジェクト
   * @returns {'OCG_DB' | 'OCG_RUSH_DB' | 'WIKI_OCG' | 'WIKI_RUSH' | 'UNKNOWN'}
   */
  const getUrlType = (url) => {
    const host = url.host;
    // URLのパス名とクエリ文字列を結合して、エンコードされた文字（《や【など）を判定しやすくする
    const pathAndSearch = url.pathname + url.search;

    // A. OCG/RUSH DB 判定 (db.yugioh-card.com and cid=)
    if (host.includes('db.yugioh-card.com') && url.searchParams.has('cid')) {
      return host.includes('rushdb') ? 'OCG_RUSH_DB' : 'OCG_DB';
    }

    // B. OCG/RUSH Wiki 判定 (yugioh-wiki.net and specific symbols)
    // %A1%D4 => '《'
    // %E3%80%8A => '《'
    if (host.includes('yugioh-wiki.net') && (pathAndSearch.includes('%A1%D4') || pathAndSearch.includes('%E3%80%8A'))) {
      return host.includes('rush') ? 'WIKI_RUSH' : 'WIKI_OCG';
    }

    return 'UNKNOWN';
  };

  const urlType = getUrlType(urlObject);

  // 取得したデータとURLタイプに基づいて、ポップアップの要素を設定する
  const setPopupElements = (name1, name2, link, type) => {
    // リンク先を設定
    siteLink.href = link;

    // カード名を設定 (DB系ならname1、Wiki系ならname2を使用)
    document.getElementById('card_name').innerText =
      (type === 'OCG_DB' || type === 'OCG_RUSH_DB') ? name1 : name2;

    // URLタイプに応じて表示テキストとクラスを設定
    switch (type) {
      case 'OCG_DB':
        siteLinkText.innerText = '《遊戯王カードWikiで表示》';
        siteLinkText.classList.add('to_wiki');
        break;

      case 'OCG_RUSH_DB':
        siteLinkText.innerText = '《ラッシュデュエルWikiで表示》';
        siteLinkText.classList.add('to_wiki');
        break;

      case 'WIKI_OCG':
        siteLinkText.innerText = '遊戯王ニューロンで検索\n(OCGデータベース)';
        siteLinkText.classList.add('to_ocg_db');
        break;

      case 'WIKI_RUSH':
        siteLinkText.innerText = '遊戯王ニューロンで検索\n(ラッシュデュエルデータベース)';
        siteLinkText.classList.add('to_rush_db');
        break;

      default:
        changePopupDefault();
        return;
    }

    // Google検索リンクを設定
    googleSearchLink.href = `https://www.google.com/search?q=${name2}`;
    googleSearchLinkYugioh.href = `https://www.google.com/search?q=${name2}\+遊戯王`;
  };


  // 判定されたURLタイプがKNOWNな場合のみ、バックグラウンドスクリプトにメッセージを送る
  if (urlType !== 'UNKNOWN') {
    chrome.runtime.sendMessage({ message: 'get_name_url' }, (response) => {
      console.log(response);
      const name1 = response.name1;
      const name2 = response.name2;
      const link = response.link;

      setPopupElements(name1, name2, link, urlType);
    });
  } else {
    // 関連性のないページの場合はポップアップをデフォルトのまま表示
    changePopupDefault();
  }


  const displayNavIcon = document.getElementById('display_nav_icon');

  // to nav-icon.js
  chrome.tabs.sendMessage(tab[0].id, { message: 'presence' }, (response) => {
    displayNavIcon.checked = response;
  });

  displayNavIcon.addEventListener('change', () => {
    // to nav-icon.js
    chrome.tabs.sendMessage(tab[0].id, {
      message: 'display_icon',
      checked: displayNavIcon.checked
    });

    chrome.storage.sync.set({
      setting_nav_icon_display: displayNavIcon.checked
    });

  });
});
