// Gerenciamento de aviso de cookies (LGPD)
// - Aviso informativo, sem opção de recusa — apenas reconhecimento (OK)
// - Guarda o reconhecimento com timestamp em localStorage
// - Validade de 30 dias: dentro desse prazo, não mostra o aviso de novo
// - GTM, GA4 e a conversão do Google Ads só são carregados depois do clique em OK
(function () {
  var STORAGE_KEY = 'us_cookie_consent';
  var VALID_DAYS = 30;
  var VALID_MS = VALID_DAYS * 24 * 60 * 60 * 1000;
  var GTM_ID = 'GTM-5KSPBLLB';
  var GA_ID = 'G-K4B9Y9WNT5';
  var ADS_ID = 'AW-18388294473';

  function readConsent() {
    var raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null; // localStorage indisponível (modo privado etc.) — trata como sem decisão
    }
    if (!raw) return null;

    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return null;
    }
    if (!data || !data.status || !data.timestamp) return null;

    var age = Date.now() - data.timestamp;
    if (age > VALID_MS) return null; // sessão de consentimento expirada, volta a perguntar

    return data;
  }

  function saveConsent(status) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: status, timestamp: Date.now() }));
    } catch (e) {
      // se não der pra salvar, o banner volta a aparecer na próxima visita — comportamento aceitável
    }
  }

  function loadGoogleTags() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
    gtag('config', ADS_ID);
  }

  function loadGTM() {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);

    var ns = document.createElement('noscript');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + GTM_ID;
    iframe.height = 0;
    iframe.width = 0;
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    ns.appendChild(iframe);
    document.body.insertBefore(ns, document.body.firstChild);
  }

  function loadTrackers() {
    loadGoogleTags();
    loadGTM();
  }

  function init() {
    var consent = readConsent();

    if (consent && consent.status === 'accepted') {
      loadTrackers();
      return; // já reconheceu o aviso e ainda está dentro dos 30 dias — não mostra de novo
    }

    // sem reconhecimento registrado, ou expirado — mostra o banner de novo
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    banner.classList.add('active');

    var acceptBtn = document.getElementById('cookieAccept');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        saveConsent('accepted');
        loadTrackers();
        banner.classList.remove('active');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
