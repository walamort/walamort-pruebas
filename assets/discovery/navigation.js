(function(root){
 'use strict';
 const catalog=root.WalamortDiscoveryCatalog;
 const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function search(query,group='all',language='es'){
  const terms=normalize(query).trim().slice(0,100).split(/\s+/).filter(Boolean).slice(0,8);
  return catalog.filter(entry=>group==='all'||entry.group===group).map(entry=>{const title=normalize(entry[language].title),description=normalize(entry[language].description),all=title+' '+description+' '+normalize(entry.tags)+' '+normalize(entry.es.title)+' '+normalize(entry.en.title)+' '+normalize(entry.pt?.title||'')+' '+normalize(entry.pt?.description||'');return {entry,score:terms.every(term=>all.includes(term))?terms.reduce((score,term)=>score+(title.startsWith(term)?8:title.includes(term)?4:description.includes(term)?2:1),0):-1};}).filter(row=>row.score>=0).sort((a,b)=>b.score-a.score||Number(a.entry.id)-Number(b.entry.id)).map(row=>row.entry);
 }
 root.WalamortDiscovery={search,normalize};if(!root.document)return;
 const doc=root.document,en=doc.documentElement.lang==='en',pt=doc.documentElement.lang.toLowerCase().startsWith('pt'),language=pt?'pt':en?'en':'es',words={'destino encontrado':'destino encontrado','destinos encontrados':'destinos encontrados','No encontramos resultados. Prueba «dictado», «guitarra», «mezcla» o una categoría.':'Nenhum resultado. Experimente «ditado», «violão», «mixagem» ou uma categoria.'},t=(a,b)=>pt?(words[a]||a):en?b:a,base=new URL('../../',doc.currentScript.src),nav=doc.querySelector('.wm-global-nav'),dialog=doc.getElementById('wm-search-dialog');
 const href=entry=>new URL(pt&&entry.portuguese?entry.portuguese:en&&entry.english?entry.english:entry.path,base).href;
 const groups=[...doc.querySelectorAll('.wm-nav-group')],locale=doc.querySelector('.wm-locale');
 function closeGroups(except){for(const group of groups)if(group!==except)group.open=false;if(locale&&locale!==except)locale.open=false;}
 if(nav){doc.documentElement.classList.add('wm-nav-ready');const toggle=nav.querySelector('.wm-nav-toggle'),menu=nav.querySelector('.wm-nav-groups');toggle.hidden=false;
  const mobile=()=>root.matchMedia('(max-width:1100px)').matches;const offset=()=>doc.documentElement.style.setProperty('--wm-nav-offset',mobile()?'0px':nav.getBoundingClientRect().height+'px');if(root.ResizeObserver)new ResizeObserver(offset).observe(nav);offset();
  function closeMenu(focus=false){closeGroups();menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');if(focus)toggle.focus();}
  toggle.onclick=()=>{const open=!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));if(!open)closeGroups();};
  groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)closeGroups(group);}));locale?.addEventListener('toggle',()=>{if(locale.open)closeGroups(locale);});
  nav.addEventListener('click',event=>{if(event.target.closest('.wm-dropdown a'))closeMenu();});
  doc.addEventListener('click',event=>{if(!nav.contains(event.target))closeMenu();});
  nav.addEventListener('keydown',event=>{if(event.key==='Escape'){const group=groups.find(g=>g.open)||(locale?.open?locale:null);if(group){group.open=false;group.querySelector('summary').focus();}else closeMenu(true);event.preventDefault();}});
  nav.addEventListener('focusout',()=>setTimeout(()=>{if(!nav.contains(doc.activeElement)&&!dialog?.open)closeMenu();},0));
  root.addEventListener('resize',()=>{offset();if(!mobile())closeMenu();});
 }
 function bindSearch(input,filter,list,count){
  function render(){const found=search(input.value,filter.value,language);list.replaceChildren();count.textContent=found.length+' '+t(found.length===1?'destino encontrado':'destinos encontrados',found.length===1?'destination found':'destinations found');
   for(const entry of found){const li=doc.createElement('li'),link=doc.createElement('a'),title=doc.createElement('strong'),desc=doc.createElement('span');title.textContent=entry[language].title;desc.textContent=entry[language].description;if(pt&&!entry.portuguese){desc.textContent+=' · Ferramenta em espanhol';}else if(en&&!entry.english){desc.textContent+=' · Spanish';}link.href=href(entry);link.append(title,desc);li.append(link);list.append(li);}
   if(!found.length){const li=doc.createElement('li');li.className='wm-empty';li.textContent=t('No encontramos resultados. Prueba «dictado», «guitarra», «mezcla» o una categoría.','No results found. Try “dictation”, “guitar”, “mixing” or a category.');list.append(li);}
  }
  input.addEventListener('input',render);filter.addEventListener('change',render);input.form?.addEventListener('submit',event=>{event.preventDefault();list.querySelector('a')?.focus();});render();return render;
 }
 if(dialog&&typeof dialog.showModal==='function'){
  const input=doc.getElementById('wm-search-input'),filter=doc.getElementById('wm-search-category'),refresh=bindSearch(input,filter,doc.getElementById('wm-search-results'),doc.getElementById('wm-search-count'));let opener;
  const open=event=>{event?.preventDefault();opener=doc.activeElement;closeGroups();if(!dialog.open)dialog.showModal();refresh();input.focus();};
  doc.querySelectorAll('[data-wm-search]').forEach(link=>link.addEventListener('click',open));doc.getElementById('wm-search-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();dialog.close();}});dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  doc.addEventListener('keydown',event=>{if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.isComposing&&!dialog.open&&!event.target.isContentEditable&&!event.target.closest('input,textarea,select')){open(event);}});
 }
 const pageInput=doc.getElementById('wm-page-search');if(pageInput){pageInput.value=new URLSearchParams(location.search).get('q')?.slice(0,100)||'';bindSearch(pageInput,doc.getElementById('wm-page-category'),doc.getElementById('wm-page-results'),doc.getElementById('wm-page-count'));}
})(typeof window==='object'?window:globalThis);
