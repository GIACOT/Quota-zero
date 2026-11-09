// Banner dei cookie + Google Analytics (si attiva SOLO dopo il consenso)
(function () {
  var GA_ID = 'G-XXXXXXXXXX';          // <-- metti qui il tuo ID di misurazione di Google Analytics
  var KEY = 'qz-consenso';
  var SEI_MESI = 1000 * 60 * 60 * 24 * 182;
  var base = document.currentScript.src.replace(/js\/consenso\.js.*$/, '');
  var infoUrl = base + 'pages/cookie.html';

  function leggi() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      return c && Date.now() - c.t < SEI_MESI ? c.v : null;
    } catch (e) { return null; }
  }
  function salva(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  function caricaGA() {
    if (window.__gaCaricato) return;
    window.__gaCaricato = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function cancellaCookieGA() {
    var host = location.hostname;
    var domini = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var nome = c.split('=')[0].trim();
      if (nome.indexOf('_ga') !== 0) return;
      domini.forEach(function (d) {
        document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  function stile() {
    if (document.getElementById('consenso-stile')) return;
    var st = document.createElement('style');
    st.id = 'consenso-stile';
    st.textContent =
      '.consenso{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:720px;margin:0 auto;padding:20px 22px;border-radius:16px;background:#101f32;color:#fff;box-shadow:0 18px 50px rgba(0,0,0,.35);font:15px/1.5 Manrope,Arial,sans-serif}' +
      '.consenso p{margin:0 0 14px}.consenso a{color:#ff762e;font-weight:700;text-decoration:underline}' +
      '.consenso-btn{display:flex;gap:12px;flex-wrap:wrap}' +
      '.consenso button{flex:1 1 140px;padding:12px 18px;border:2px solid #ff762e;border-radius:10px;font:800 15px Manrope,Arial,sans-serif;cursor:pointer;background:transparent;color:#fff}' +
      '.consenso button:hover{background:#ff762e;color:#101f32}';
    document.head.appendChild(st);
  }

  function mostra() {
    stile();
    var vecchio = document.getElementById('consenso');
    if (vecchio) vecchio.remove();
    var b = document.createElement('div');
    b.id = 'consenso';
    b.className = 'consenso';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Preferenze sui cookie');
    b.innerHTML =
      '<p>Questo sito usa Google Analytics per raccogliere statistiche anonime sulle visite, solo se acconsenti. ' +
      'Puoi rifiutare senza perdere nessuna funzione. <a href="' + infoUrl + '">Maggiori informazioni</a></p>' +
      '<div class="consenso-btn"><button type="button" data-v="no">Rifiuta</button><button type="button" data-v="si">Accetta</button></div>';
    b.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-v');
      if (!v) return;
      salva(v);
      b.remove();
      if (v === 'si') caricaGA(); else cancellaCookieGA();
    });
    document.body.appendChild(b);
  }

  window.apriConsenso = mostra;   // usata dal link "Gestisci cookie" nel footer

  var scelta = leggi();
  if (scelta === 'si') caricaGA();
  else if (scelta === null) mostra();
})();