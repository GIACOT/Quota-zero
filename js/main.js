// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
}

if (toggle && nav) {
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
}

// Anno corrente nel footer
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

// Header della home: trasparente sul video, pieno quando si scorre
const homeHeader = document.querySelector('.home-header');
if (homeHeader) {
  const update = () => homeHeader.classList.toggle('scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
}
