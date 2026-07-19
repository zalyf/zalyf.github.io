/**
 * Light atmosphere bootstrap — injects mist + ink specks once.
 * No canvas / no third-party libs. Safe to include on any page.
 */
(function () {
  if (window.__yiFxInit) return;
  window.__yiFxInit = true;

  function inject() {
    if (document.querySelector('.fx-layer.fx-mist')) return;

    var mist = document.createElement('div');
    mist.className = 'fx-layer fx-mist';
    mist.setAttribute('aria-hidden', 'true');

    var specks = document.createElement('div');
    specks.className = 'fx-layer fx-specks';
    specks.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 6; i++) {
      specks.appendChild(document.createElement('span'));
    }

    document.body.insertBefore(mist, document.body.firstChild);
    document.body.insertBefore(specks, mist.nextSibling);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
