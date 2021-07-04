const status = document.getElementById('status');

document.getElementById('save').addEventListener('click', () => {
  let settingNavIcon = document.getElementById('setting_nav_icon').checked;

  chrome.storage.sync.set({
    setting_nav_icon: settingNavIcon

  }, () => {
    status.textContent = '保存されました';
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  }
  );
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get({
    setting_nav_icon

  }, (items) => {
    document.getElementById('setting_nav_icon').checked = items.setting_nav_icon;
  });
});
