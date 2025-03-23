chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {

  const siteLink = document.getElementById('site_link');
  const siteLinkText = document.getElementById('site_link_text');
  const googleSearchLink = document.getElementById('google_search_link');
  const googleSearchLinkYugioh = document.getElementById('google_search_link_yugioh');

  const currentUrl = tab[0].url;

  const urlIncludes = (urlPartial) => {
    return currentUrl.includes(urlPartial);
  }

  const urlIncludesParts = (target, ...urlPartial) => {
    return urlPartial.every(element => target.includes(element));
  }

  // to background.js
  chrome.runtime.sendMessage({ message: 'get_name&url' }, (response) => {
    const name1 = response.name1;
    const name2 = response.name2;

    siteLink.href = response.link;

    if (urlIncludesParts(currentUrl, 'www.db.yugioh-card.com', 'cid=')) {
      if (urlIncludes('rushdb')) {
        siteLinkText.innerText = '《ラッシュデュエルWikiで表示》';
      }
      else {
        siteLinkText.innerText = '《遊戯王カードWikiで表示》';
      }

      siteLinkText.classList.add('to_wiki');
      document.getElementById('card_name').innerText = name1
    }

    else if (urlIncludesParts(currentUrl, 'yugioh-wiki.net', '%A1%D4') || urlIncludesParts(currentUrl, 'yugioh-wiki.net', '%E3%80%8A')) {
      if (urlIncludes('rush')) {
        siteLinkText.innerText = 'ラッシュデュエル\nデータベースで検索';
      }
      else {
        siteLinkText.innerText = '遊戯王OCGデータベースで検索';
      }

      siteLinkText.classList.add('to_db');
      document.getElementById('card_name').innerText = name2
    }

    else {
      siteLinkText.classList.add('disabled');
      googleSearchLink.classList.add('disabled');
      googleSearchLinkYugioh.classList.add('disabled');
      document.getElementById('nav_icon_display').classList.add('disabled');

      document.getElementById('card_name').innerText = 'リンク集';
      const elements = document.querySelectorAll('.default_link');
      elements.forEach((element) => {
        console.log(element.classList);
        element.classList.remove('disabled');
      });
    }


    googleSearchLink.href = `https://www.google.com/search?q=${name2}`;
    googleSearchLinkYugioh.href = `https://www.google.com/search?q=${name2}\+遊戯王`;
  });


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
