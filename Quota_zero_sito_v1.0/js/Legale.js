// Pagine Privacy e Cookie: inserisce i dati del titolare letti da data/titolare.json
(function () {
    fetch('../data/titolare.json')
        .then(function (r) { if (!r.ok) throw new Error('dati non disponibili'); return r.json(); })
        .then(function (d) {
            document.querySelectorAll('[data-f]').forEach(function (el) {
                var v = String(d[el.getAttribute('data-f')] || '').trim();
                if (!v) return;
                el.textContent = v;
                el.classList.remove('da-compilare');
                if (el.hasAttribute('data-mailto')) el.setAttribute('href', 'mailto:' + v);
            });
        })
        .catch(function () { /* se il file manca restano i segnaposto */ });
})();