const status = document.getElementById('status');
const editSize = document.getElementById('edit_size');
const slider = document.getElementById('size_slider');
const setNavIconDisplayCheck = document.getElementById('setting_nav_icon_display');
const iconExample = document.getElementById('icon_example');
let size;


document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      setting_nav_icon_display: true,
      setting_nav_icon_size: 48
    }

    , (items) => {
      // ナビゲーションアイコンを表示する
      setNavIconDisplayCheck.checked = items.setting_nav_icon_display;

      // ナビゲーションアイコンの表示サイズ
      slider.value = items.setting_nav_icon_size;
      editSize.innerHTML = slider.value;
    });

  size = slider.value;
  editSize.textContent = this.value;
  iconExample.width = size;
  iconExample.height = size;
});


slider.addEventListener('change', function () {
  size = this.value;
  editSize.textContent = size;

  iconExample.width = size;
  iconExample.height = size;
});

document.getElementById('save').addEventListener('click', () => {
  chrome.storage.sync.set({
    setting_nav_icon_display: setNavIconDisplayCheck.checked,
    setting_nav_icon_size: slider.value

  }, () => {
    status.textContent = '保存しました';
    setTimeout(() => {
      status.textContent = '';
    }, 1500);
  }
  );
});
