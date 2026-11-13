// Pagina Eventi: legge data/eventi.json e crea una card per ogni locandina
(function () {
    var grid = document.getElementById('eventi-grid');
    if (!grid) return;

    // Etichette per il campo "stato" (accetta anche "sold out", "soldout", "pochi posti"...)
    var STATI = {
        'pochi-posti': 'Pochi posti',
        'sold-out': 'Sold out',
        'soldout': 'Sold out',
        'iscrizioni-aperte': 'Iscrizioni aperte',
        'prossimamente': 'Prossimamente'
    };

    // Data di oggi nel formato AAAA-MM-GG, per capire quali eventi sono passati
    var oggi = new Date().toLocaleDateString('sv-SE');

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function card(e) {
        var passato = e._passato;
        var stato = String(e.stato || '').toLowerCase().replace(/[\s_]+/g, '-');
        var attivo = e.link && !passato && ['sold-out', 'soldout', 'prossimamente'].indexOf(stato) === -1;
        var tag = attivo ? 'a' : 'div';
        var attrs = attivo ? ' href="' + esc(e.link) + '" target="_blank" rel="noopener"' : '';
        var cls = 'event-card' + (passato ? ' is-past' : '') + (stato === 'prossimamente' && !passato ? ' is-soon' : '') + (attivo ? ' has-link' : '') + (e.locandina ? '' : ' no-image');
        var badge = '';
        if (passato) badge = '<span class="event-badge is-past">Concluso</span>';
        else if (STATI[stato]) badge = '<span class="event-badge ' + esc(stato) + '">' + STATI[stato] + '</span>';

        var img = e.locandina
            ? '<img src="../' + esc(e.locandina) + '" alt="' + esc(e.titolo) + '" loading="lazy" onerror="this.closest(\'.event-card\').classList.add(\'no-image\')">'
            : '';

        return '<' + tag + ' class="' + cls + '"' + attrs + '>' +
            img +
            '<span class="event-fallback">' + esc(e.titolo) + '</span>' +
            badge +
            (attivo ? '<span class="event-cta">Accedi al modulo di iscrizione <svg class="event-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M7 7H17V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' : '') +
            '</' + tag + '>';
    }

    fetch('../data/eventi.json')
        .then(function (r) { if (!r.ok) throw new Error('dati non disponibili'); return r.json(); })
        .then(function (items) {
            items.forEach(function (e) { e._passato = !!e.data && e.data < oggi; });

            // Prima i prossimi (dal più vicino), poi quelli passati (dal più recente)
            var prossimi = items.filter(function (e) { return !e._passato; })
                .sort(function (a, b) { return (a.data || '9999') < (b.data || '9999') ? -1 : 1; });
            var passati = items.filter(function (e) { return e._passato; })
                .sort(function (a, b) { return a.data < b.data ? 1 : -1; });

            var tutti = prossimi.concat(passati);
            grid.innerHTML = tutti.length
                ? tutti.map(card).join('')
                : '<p class="muted">Nuovi eventi in arrivo.</p>';
        })
        .catch(function () {
            grid.innerHTML = '<p class="muted">Non riusciamo a caricare gli eventi. Riprova tra poco.</p>';
        });
})();