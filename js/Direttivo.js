// Pagina Chi siamo: legge data/direttivo.json e crea i cerchi con le foto del direttivo
(function () {
    var box = document.getElementById('direttivo');
    if (!box) return;

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function iniziali(nome) {
        return String(nome || '').split(/\s+/).filter(Boolean).slice(0, 2)
            .map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
    }

    // Due cerchi aperti: arancione (esterno) e blu (interno), con le aperture in punti diversi
    var ANELLI =
        '<svg class="dir-rings" viewBox="0 0 240 240" aria-hidden="true">' +
        '<circle class="ring-outer" cx="120" cy="120" r="112" stroke-dasharray="548.9 154.8" transform="rotate(-5 120 120)"/>' +
        '<circle class="ring-inner" cx="120" cy="120" r="100" stroke-dasharray="490.1 138.2" transform="rotate(175 120 120)"/>' +
        '</svg>';

    function membro(m) {
        var foto = m.foto
            ? '<img src="../' + esc(m.foto) + '" alt="' + esc(m.nome) + '" loading="lazy" onerror="this.closest(\'.dir-photo\').classList.add(\'no-photo\')">'
            : '';
        return '<article class="dir-member">' +
            '<div class="dir-photo' + (m.foto ? '' : ' no-photo') + '">' +
            ANELLI +
            '<div class="dir-img">' + foto + '<span class="dir-initials">' + esc(iniziali(m.nome)) + '</span></div>' +
            '</div>' +
            '<h3>' + esc(m.nome) + '</h3>' +
            '<p>' + esc(m.descrizione) + '</p>' +
            '</article>';
    }
    box.addEventListener('mouseover', function (e) {
        var p = e.target.closest('.dir-photo');
        if (!p || p.contains(e.relatedTarget) || p._busy) return;
        p._busy = true;
        p._n = (p._n || 0) + 1;
        p.style.setProperty('--r', p._n);
        setTimeout(function () { p._busy = false; }, 1400);
    });
    fetch('../data/direttivo.json')
        .then(function (r) { if (!r.ok) throw new Error('dati non disponibili'); return r.json(); })
        .then(function (items) { box.innerHTML = items.map(membro).join(''); })
        .catch(function () { box.innerHTML = ''; });

})();
