const displayNavIvon = () => {
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

  chrome.storage.sync.get({ icon_position_y: '200px', icon_position_x: '90%' }, (items) => {
    const positionTop = items.icon_position_y;
    const positionLeft = items.icon_position_x;

    navIcon.style.top = positionTop;
    navIcon.style.left = positionLeft;
  });

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

    if (iconMoved) return;

    chrome.runtime.sendMessage({ message: "page_navigation" });
  }
}

const removeNavIcon = () => {
  const navIcon = document.getElementById('navigation_icon');
  document.body.removeChild(navIcon);
}

chrome.storage.sync.get({
  setting_nav_icon: true

}, (items) => {
  if (!items.setting_nav_icon) return;

  else {
    displayNavIvon();

    document.getElementById('close').addEventListener('mouseup', (event) => {
      event.stopPropagation();
      removeNavIcon();
    });
  }
});
