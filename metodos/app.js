(() => {
  'use strict';
  const en=document.documentElement.lang==='en',$=id=>document.getElementById(id),cards=[...document.querySelectorAll('#products .card')];
  const allowed=['all','instrument','creative',...cards.map(card=>card.dataset.topic)];
  const chosen=new URLSearchParams(location.search).get('interest');
  $('interest').value=allowed.includes(chosen)?chosen:'all';
  function render(){
    const value=$('interest').value;let count=0;
    cards.forEach(card=>{card.hidden=!(value==='all'||card.dataset.topic===value||card.dataset.kind===value);if(!card.hidden)count++;});
    $('count').textContent=count+(en?' options shown.':' opciones disponibles para explorar.');
    const url=new URL(location.href);url.search='';if(value!=='all')url.searchParams.set('interest',value);history.replaceState(null,'',url);
    $('language').href=document.body.dataset.base+(en?'':'en/')+'metodos/'+(value==='all'?'':'?interest='+value);
  }
  $('filters').hidden=false;$('interest').onchange=render;$('resetFilter').onclick=()=>{$('interest').value='all';render();};render();
})();
