(function(){'use strict';const C=window.WalamortStartPaths,$=id=>document.getElementById(id),words=$('pathRecord').dataset,key='walamort-start-paths-v1',checks=Array.from(document.querySelectorAll('[data-session]'));let state=C.blank(),busy=false,url=null;
 function tell(s){$('pathStatus').textContent=s;}
 function render(){const resume=$('resumeRoute');resume.hidden=!state.last;if(state.last){resume.href='#'+state.last;}checks.forEach(el=>{el.checked=state.sessions.includes(el.dataset.session)});$('pathProgress').textContent=state.sessions.length+' / 16 · '+words.progress;}
 function save(){try{localStorage.setItem(key,JSON.stringify(state));tell(words.saved);return true;}catch{tell(words.failed);return false;}}
 try{const raw=localStorage.getItem(key);if(raw){if(new Blob([raw]).size>C.maxBytes)throw Error('size');state=C.validate(JSON.parse(raw));}}catch{tell(words.failed);}render();
 checks.forEach(el=>el.onchange=()=>{if(busy)return;const next=new Set(state.sessions);if(el.checked)next.add(el.dataset.session);else next.delete(el.dataset.session);state=C.validate({...state,sessions:[...next]});render();save();});
 function remember(){const route=location.hash.slice(1);if(!C.routes.includes(route))return;state.last=route;render();save();}window.addEventListener('hashchange',remember);
 function release(){if(url)URL.revokeObjectURL(url);url=null;}
 $('pathExport').onclick=()=>{release();url=URL.createObjectURL(new Blob([JSON.stringify(C.validate(state),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='walamort-start-paths.json';a.click();tell(words.exported);};
 $('pathImport').onchange=async()=>{const file=$('pathImport').files?.[0];if(!file||busy)return;busy=true;for(const el of checks)el.disabled=true;$('pathExport').disabled=true;$('pathImport').disabled=true;try{if(file.size>C.maxBytes)throw Error('size');const next=C.validate(JSON.parse(await file.text()));state=next;render();if(save())tell(words.restored);}catch{tell(words.invalid);}finally{busy=false;for(const el of checks)el.disabled=false;$('pathExport').disabled=false;$('pathImport').disabled=false;$('pathImport').value='';}};
 window.addEventListener('pagehide',release);
})();
