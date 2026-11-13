// Header e footer UNICI per tutte le pagine del sito.
// Per cambiare menu, link o testi del footer si modifica solo questo file.
(function () {
  // '' per index.html, '../' per le pagine dentro pages/ (vedi data-root nel tag <script>)
  var root = (document.currentScript && document.currentScript.dataset.root) || '';

  var header =
    '<header class="site-header home-header">' +
    '<a class="brand" href="' + root + 'index.html"><img class="brand-logo" src="' + root + 'assets/img/logo.svg" alt="Quota Zero"><span>QUOTA ZERO<small>GRISIGNANO DI ZOCCO</small></span></a>' +
    '<button class="menu-toggle" aria-label="Apri il menu" aria-expanded="false">☰</button>' +
    '<nav class="main-nav" aria-label="Navigazione principale">' +
    '<a href="' + root + 'index.html">Home</a>' +
    '<a href="' + root + 'pages/associazione.html">Chi siamo</a>' +
    '<a href="' + root + 'pages/attivita.html">Attività</a>' +
    '<a href="' + root + 'pages/eventi.html">Eventi</a>' +
    '<a href="' + root + 'pages/sponsor.html">Convenzioni</a>' +
    '<a href="' + root + 'pages/faq.html">FAQ</a>' +
    '<a class="nav-cta" href="' + root + 'pages/diventa-socio.html">Iscriviti</a>' +
    '</nav>' +
    '</header>';
  var social = [
    {
      nome: 'Instagram',
      url: 'https://www.instagram.com/quota_zero_outdoor/',
      icona: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
    },
    {
      nome: 'Facebook',
      url: 'https://www.facebook.com/quota_zero_outdoor/',
      icona: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>'
    }
  ];

  var socialHtml = social.map(function (s) {
    return '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.nome + '">' + s.icona + '</a>';
  }).join('');
  var footer =
    '<footer class="site-footer">' +
    '<div class="container footer-main">' +
    '<div>' +
    '<a class="brand brand-footer" href="' + root + 'index.html"><img class="brand-logo" src="' + root + 'assets/img/favicon.svg" alt="Quota Zero"><span>QUOTA ZERO<small>GRISIGNANO DI ZOCCO</small></span></a>' + '<p>Sci, outdoor &amp; many more</p>' +
    '</div>' +
    '<div class="footer-right">' +
    '<div class="footer-links">' +
    '<a href="' + root + 'pages/contatti.html">Contatti</a>' +
    '<a href="' + root + 'pages/privacy.html">Privacy</a>' +
    '<a href="' + root + 'pages/cookie.html">Cookie</a>' +
    '<a href="#" onclick="window.apriConsenso && apriConsenso(); return false;">Gestisci cookie</a>' +
    '</div>' +
    '<div class="footer-social">' + socialHtml + '</div>' +
    '</div>' +
    '</div>' +
    '<div class="container footer-bottom"><span>© ' + new Date().getFullYear() + ' A.S.D. Quota Zero · Grisignano di Zocco (VI) · C.F. 04673120244 · P.IVA 04673120244</span><span>Vivere la montagna.</span></div>' + '</footer>';

  // Header: inserito subito, così non lampeggia
  var headerSlot = document.getElementById('site-header');
  if (headerSlot) headerSlot.outerHTML = header;

  // Voce di menu della pagina corrente
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a:not(.nav-cta)').forEach(function (a) {
    if (a.getAttribute('href').split('/').pop() === here) a.setAttribute('aria-current', 'page');
  });

  // Footer: inserito a pagina caricata
  document.addEventListener('DOMContentLoaded', function () {
    var footerSlot = document.getElementById('site-footer');
    if (footerSlot) footerSlot.outerHTML = footer;
  });
  var consenso = document.createElement('script');
  consenso.src = root + 'js/consenso.js';
  document.head.appendChild(consenso);
})();