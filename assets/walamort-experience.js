/* Walamort: progressive enhancement for responsive navigation. No tracking. */
(function(){
  "use strict";
  var toggle=document.querySelector(".wm-menu-toggle");
  var menu=document.getElementById("wm-nav-links");
  if(!toggle||!menu)return;
  function close(){menu.classList.remove("is-open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Abrir menú");}
  toggle.addEventListener("click",function(){var open=menu.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Cerrar menú":"Abrir menú");});
  menu.addEventListener("click",function(event){if(event.target.closest("a"))close();});
  document.addEventListener("keydown",function(event){if(event.key==="Escape")close();});
  document.addEventListener("click",function(event){if(!menu.contains(event.target)&&!toggle.contains(event.target))close();});
  window.addEventListener("resize",function(){if(window.innerWidth>860)close();});
})();

(() => {
  'use strict';
  const toggle = document.querySelector('.wm-menu-toggle');
  const menu = document.getElementById('wm-nav-links');
  if (toggle && menu) {
    document.documentElement.classList.add('experience-js');
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    }, true);
    document.addEventListener('focusin', event => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const search = document.getElementById('instrument-search');
  const family = document.getElementById('instrument-family');
  if (!search || !family) return;
  const cards = [...document.querySelectorAll('.instrument-card')];
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filter = () => {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const matches = (!family.value || family.value === card.dataset.family) &&
        terms.every(term => normalize(card.dataset.search).includes(term));
      card.hidden = !matches;
      if (matches) count++;
    });
    document.getElementById('instrument-count').textContent = `${count} ${count === 1 ? 'instrumento disponible' : 'instrumentos disponibles'}`;
    document.getElementById('instrument-empty').hidden = count !== 0;
  };
  search.addEventListener('input', filter);
  family.addEventListener('change', filter);
  search.form.addEventListener('submit', event => event.preventDefault());
  // Reset's default action runs after the event handlers and microtasks.
  search.form.addEventListener('reset', () => setTimeout(filter, 0));
})();
