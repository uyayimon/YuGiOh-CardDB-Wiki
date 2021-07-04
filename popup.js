chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {

  const siteLink = document.getElementById('site_link');
  const siteLinkText = document.getElementById('site_link_text');
  const googleSearchLink = document.getElementById('google_search_link');
  const googleSearchLinkYugioh = document.getElementById('google_search_link_yugioh');

  const currentUrl = tab[0].url;

  const urlIncludes = (urlPartial) => {
    return currentUrl.includes(urlPartial);
  }

  chrome.runtime.sendMessage({ message: 'get_name' }, (response) => {
    const name1 = response.name1;
    const name2 = response.name2;
    const link = response.link

    siteLink.href = link;

    if (urlIncludes('www.db.yugioh-card.com')) {
      if (urlIncludes('rushdb')) {
        siteLinkText.innerText = '《ラッシュデュエルWikiで表示》';
        siteLinkText.classList.add('to_wiki');
      }
      else {
        siteLinkText.innerText = '《遊戯王カードWikiで表示》';
        siteLinkText.classList.add('to_wiki');
      }

      document.getElementById('card_name').innerText = name1
    }


    if (urlIncludes('yugioh-wiki.net')) {
      if (urlIncludes('rush')) {
        siteLinkText.innerText = 'ラッシュデュエル\nデータベースで検索';
        siteLinkText.classList.add('to_db');
      }
      else {
        siteLinkText.innerText = '遊戯王OCGデータベースで検索';
        siteLinkText.classList.add('to_db');
      }

      document.getElementById('card_name').innerText = name2
    }


    googleSearchLink.href = `https://www.google.com/search?q=${name2}`;
    googleSearchLinkYugioh.href = `https://www.google.com/search?q=${name2}\+遊戯王`;
  });
});
