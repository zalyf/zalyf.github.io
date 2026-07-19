/**
 * 全站引导：统一背景图渐进加载
 * 与 effects.js 可并存；任意页面引入即可。
 */
(function () {
  if (window.__yiSiteInit) return;
  window.__yiSiteInit = true;

  var BG_URL = './static/images/R.jpg';

  function applyBackground(url) {
    var s = document.body.style;
    s.backgroundImage = 'url("' + url + '")';
    s.backgroundSize = 'cover';
    s.backgroundPosition = 'center center';
    s.backgroundRepeat = 'no-repeat';
    // iOS 对 fixed 支持不稳定，保持 CSS 默认；桌面用 fixed
    var isIOS = /iP(ad|hone|od)/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    s.backgroundAttachment = isIOS ? 'scroll' : 'fixed';
    document.body.classList.add('site-bg-ready');
  }

  function loadBg() {
    // 若已预加载或缓存，直接应用；否则异步解码后再切换，避免空白闪烁
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      if (img.decode) {
        img.decode().then(function () { applyBackground(BG_URL); }).catch(function () { applyBackground(BG_URL); });
      } else {
        applyBackground(BG_URL);
      }
    };
    img.onerror = function () {
      console.warn('Site background failed to load:', BG_URL);
    };
    img.src = BG_URL;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBg);
  } else {
    loadBg();
  }
})();
