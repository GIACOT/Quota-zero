// Pagina Diventa socio: legge data/Iscrizione.json e crea le card delle quote
(function () {
  var grid = document.getElementById('quote-grid');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function card(q) {
    var style = q.immagine ? ' style="background-image:url(\'../' + esc(q.immagine) + '\')"' : '';
    var voci = (q.voci || []).map(function (v) {
      return '<li><span>' + esc(v.nome) + '</span><strong>' + esc(v.importo) + '</strong></li>';
    }).join('');
    return '<article class="quote-card"' + style + '>' +
      (q.etichetta ? '<span class="quote-tag">' + esc(q.etichetta) + '</span>' : '') +
      '<div class="quote-main">' +
      '<div class="quote-price">' + esc(q.prezzo) + '</div>' +
      '<h3>' + esc(q.titolo) + '</h3>' +
      (voci ? '<ul class="quote-list">' + voci + '</ul>' : '') +
      '</div>' +
      (q.nota ? '<p class="quote-note">' + esc(q.nota).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>' : '') +
      '</article>';
  }

  fetch('../data/Iscrizione.json')
    .then(function (r) { if (!r.ok) throw new Error('dati non disponibili'); return r.json(); })
    .then(function (items) {
      grid.innerHTML = items.map(card).join('');
    })
    .catch(function () {
      grid.innerHTML = '<p class="muted">Non riusciamo a caricare le quote. Scrivici per i dettagli.</p>';
    });
})();