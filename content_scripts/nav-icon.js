const currentUrl = location.href;

const urlIncludes = (urlPartial) => {
  return currentUrl.includes(urlPartial);
}

const getTooltipText = () => {
  let navText;
  let navClass;

  if (urlIncludes('www.db.yugioh-card.com')) {
    navText = '《カードWikiで表示》';
    navClass = 'to_wiki';
  }

  else if (urlIncludes('yugioh-wiki.net')) {
    navText = '公式データベースで検索';
    navClass = 'to_db';
  }

  return {
    text: navText,
    class: navClass
  }
}

const removeNavIcon = () => {
  const navIcon = document.getElementById('icon_whole');
  document.body.removeChild(navIcon);

  chrome.storage.sync.set({ icon_position_y: '200px', icon_position_x: '90%' });
}


const displayNavIcon = () => {
  // 要素の生成
  const newElement = document.createElement('div');
  newElement.setAttribute('id', 'icon_whole');

  const p1 = document.createElement('p');
  const text_x = document.createTextNode('×');
  newElement.appendChild(p1);
  p1.appendChild(text_x);
  p1.setAttribute('id', 'close_btn');

  const img_element = document.createElement('img');
  const iconURL = chrome.runtime.getURL('icons/iconDW-128x128.png');
  img_element.src = iconURL;
  img_element.setAttribute('id', 'icon_navigate');

  chrome.storage.sync.get({ setting_nav_icon_size: 48 }, (items) => {
    const size_value = items.setting_nav_icon_size + 'px';
    img_element.style.width = size_value;
    img_element.style.height = size_value;
  });

  newElement.appendChild(img_element);

  const tooltip = document.createElement('span');
  const tooltipText1 = document.createTextNode(getTooltipText().text);
  newElement.appendChild(tooltip);
  tooltip.appendChild(tooltipText1);
  tooltip.setAttribute('id', 'tooltip_text');
  tooltip.setAttribute('class', getTooltipText().class);

  document.body.appendChild(newElement);
  const navIcon = document.getElementById('icon_whole');

  const setIconPosition = () => {
    chrome.storage.sync.get({ icon_position_y: '200px', icon_position_x: '90%' }, (items) => {
      const positionTop = items.icon_position_y;
      const positionLeft = items.icon_position_x;

      navIcon.style.top = positionTop;
      navIcon.style.left = positionLeft;
    });
  }

  setIconPosition();

  navIcon.ondragstart = (event) => {
    return false;
  }

  let iconMoved = false;

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

    chrome.storage.sync.set(
      {
        icon_position_y: (iconY / window_h) * 100 + '%',
        icon_position_x: (iconX / window_w) * 100 + '%'
      }
    );
  }


  window.addEventListener('resize', setIconPosition);

  document.getElementById('icon_navigate').addEventListener('click', () => {
    if (iconMoved) return;
    else
      // to background.js
      chrome.runtime.sendMessage({ message: "page_navigation" });
  });

  document.getElementById('close_btn').addEventListener('click', (event) => {
    event.stopPropagation();
    removeNavIcon();
    chrome.storage.sync.set({ setting_nav_icon_display: false });
  });

}

chrome.storage.sync.get({
  setting_nav_icon_display: true

}, (items) => {
  if (!items.setting_nav_icon_display) return;

  else displayNavIcon();
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // from popup.js
  if (request.message == 'presence')
    sendResponse(!!document.getElementById("icon_whole"));

  // from popup.js
  else if (request.message == 'display_icon') {
    if (request.checked) {
      if (!document.getElementById("icon_whole"))
        displayNavIcon();
    }
    else
      removeNavIcon();
  }

  return true;
});
