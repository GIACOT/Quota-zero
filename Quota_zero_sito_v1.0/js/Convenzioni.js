// Pagina Convenzioni: legge data/convenzioni.json e crea la stella del negozio e le card degli skipass
(function () {
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Cime in alto alle card (roccia + neve)
  var PEAKS =
    '<svg class="peaks" viewBox="0 0 400 80" width="100%" height="80" preserveAspectRatio="none" aria-hidden="true">' +
    '<path class="peaks-rock" d="M0,80 L0,54 L70,12 L135,44 L200,0 L265,48 L330,10 L400,50 L400,80 Z"/>' +
    '<path class="peaks-snow" d="M200,0 L229.8,22 L216,17 L206,31 L196,17 L182,24 L167.5,22 Z' +
    ' M70,12 L106.6,30 L92,26 L81,38 L68,27 L54,31 L40,30 Z' +
    ' M330,10 L361.5,28 L347,24 L337,36 L326,25 L312,30 L299.2,28 Z"/>' +
    '</svg>';

  function rental(r) {
    var items = r.items.map(function (i) {
      return '<li><strong>' + esc(i.value) + '</strong><span>' + esc(i.label) + '</span></li>';
    }).join('');
    var shopShort = esc(r.shop.split(' ')[0]);
    var shopRest = esc(r.shop.split(' ').slice(1).join(' '));
    return '<div class="rental">' +
      '<div class="star-badge" role="img" aria-label="' + esc(r.shop) + '">' +
      '<div class="star-badge-shape"></div>' +
      '<div class="star-badge-inner">' +
      '<img src="../' + esc(r.logo) + '" alt="" onerror="this.closest(\'.star-badge\').classList.add(\'no-logo\')">' +
      '<span class="star-badge-name">' + shopShort + '<small>' + shopRest + '</small></span>' +
      '</div>' +
      '</div>' +
      '<div class="rental-offers">' +
      '<p class="rental-intro">In collaborazione con</p>' +
      '<h3>' + esc(r.shop) + '</h3>' +
      '<ul class="rental-list">' + items + '</ul>' +
      '</div>' +
      '</div>';
  }

  function card(c) {
    var h = '<article class="peak-card' + (c.wide ? ' is-wide' : '') + '">' + PEAKS + '<div class="peak-card-body">';
    h += '<div class="peak-kicker">' + esc(c.kicker || '') + '</div>';
    h += '<h3>' + esc(c.name) + '</h3>';

    if (c.deal) {
      h += '<div class="peak-deal"><strong>' + esc(c.deal.value) + '</strong><span>' + esc(c.deal.label) + '</span></div>';
    }
    if (c.prices) {
      h += '<div class="peak-prices">' + c.prices.map(function (p) {
        return '<div class="peak-price"><strong>' + esc(p.value) + '</strong><span>' + esc(p.label) + '</span></div>';
      }).join('') + '</div>';
    }
    if (c.text) {
      h += '<p class="peak-text' + (c.soon ? ' peak-soon' : '') + '">' + esc(c.text) + '</p>';
    }
    if (c.notes) {
      h += '<ul class="peak-list">' + c.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
    }
    if (c.how) {
      h += '<p class="peak-text">' + esc(c.how.text) + ' <a href="mailto:' + esc(c.how.email) + '">' + esc(c.how.email) + '</a> ' +
        esc(c.how.text2) + ' <a href="' + esc(c.how.url) + '" target="_blank" rel="noopener">' + esc(c.how.urlLabel) + '</a>.</p>';
    }
    if (c.excluded) {
      h += '<div class="peak-excluded"><b>Esclusi</b><ul>' +
        c.excluded.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>';
    }
    return h + '</div></article>';
  }

  fetch('../data/convenzioni.json')
    .then(function (r) { if (!r.ok) throw new Error('dati non disponibili'); return r.json(); })
    .then(function (d) {
      document.getElementById('rental').innerHTML = rental(d.noleggio);
      document.getElementById('ski-grid').innerHTML = d.skipass.map(card).join('');
      if (location.hash) {
        var target = document.querySelector(location.hash);
        if (target) {
          requestAnimationFrame(function () { target.scrollIntoView(); });
        }
      }
    })
    .catch(function () {
      document.getElementById('conv-error').hidden = false;
    });
})();