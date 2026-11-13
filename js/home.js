// Carica le ultime notizie nella home (max 3)
async function loadCards(file, targetId, fallbackTag) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error('Dati non disponibili');
    const items = await response.json();
    if (!items.length) {
      target.innerHTML = '<p class="muted">Stiamo preparando i contenuti. Torna a trovarci!</p>';
      return;
    }
    target.innerHTML = items.slice(0, 3).map(item => `
      <article class="content-card">
        ${item.image ? `<img src="${item.image}" alt="${item.imageAlt || ''}" loading="lazy">` : ''}
        <div class="content-card-body">
          <span class="tag">${item.category || fallbackTag}</span>
          <div class="date-label">${item.date || ''}</div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </div>
      </article>`).join('');
  } catch (e) {
    target.innerHTML = '<p class="muted">I contenuti saranno disponibili prossimamente.</p>';
  }
}


// Elementi che compaiono quando entrano nello schermo
const revealItems = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-visible'));
}

// Sciatore che scende la montagna mentre si scorre
const skiSection = document.getElementById('intro');
const skiTrail = document.getElementById('ski-trail');
const skier = document.getElementById('skier');

if (skiSection && skiTrail && skier) {
  const trailLength = skiTrail.getTotalLength();
  skiTrail.style.strokeDasharray = trailLength;
  const reduceSki = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateSkier() {
    const rect = skiSection.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const raw = scrollable > 0 ? -rect.top / scrollable : 1;
    // piccola pausa all'inizio e alla fine (5%) così si vede la cima e l'arrivo
    const startAt = 0.05;
    const endAt = 0.9;
  

    const p = reduceSki
      ? 1
      : Math.min(1, Math.max(0, (raw - startAt) / (endAt - startAt)));

    const d = p * trailLength;
    const pt = skiTrail.getPointAtLength(d);
    const a = skiTrail.getPointAtLength(Math.max(0, d - 1));
    const b = skiTrail.getPointAtLength(Math.min(trailLength, d + 1));

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const goingLeft = dx < 0;
    const angle = Math.atan2(dy, goingLeft ? -dx : dx) * 180 / Math.PI;

    skier.setAttribute('transform',
      `translate(${pt.x} ${pt.y}) scale(${goingLeft ? -1 : 1} 1) rotate(${angle})`);
    skiTrail.style.strokeDashoffset = trailLength - d;
  }

  updateSkier();
  window.addEventListener('scroll', updateSkier, { passive: true });
  window.addEventListener('resize', updateSkier);
}
