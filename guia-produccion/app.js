(function(){'use strict';
 const C=window.WalamortListeningJournal,$=id=>document.getElementById(id),words=$('journal').dataset,key='walamort-listening-journal-v1';let state=C.blank(),url=null,busy=false;
 function tell(text){$('journalStatus').textContent=text;}
 function render(){state.practices.forEach((p,i)=>{$('done'+i).checked=p.done;$('note'+i).value=p.note;});progress();}
 function progress(){$('journalProgress').textContent=state.practices.filter(p=>p.done).length+' / 3 · '+words.progress;}
 function persist(){try{localStorage.setItem(key,JSON.stringify(state));tell(words.saved);}catch{tell(words.unavailable);}progress();}
 try{const saved=localStorage.getItem(key);if(saved){if(new Blob([saved]).size>C.maxBytes)throw Error('size');state=C.validate(JSON.parse(saved));}}catch{tell(words.unavailable);}render();
 for(let i=0;i<3;i++){const update=()=>{if(busy)return;state.practices[i]={done:$('done'+i).checked,note:$('note'+i).value.slice(0,1200)};persist();};$('done'+i).onchange=update;$('note'+i).oninput=update;}
 function release(){if(url)URL.revokeObjectURL(url);url=null;}
 $('journalExport').onclick=()=>{release();url=URL.createObjectURL(new Blob([JSON.stringify(C.validate(state),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='walamort-listening-journal.json';a.click();tell(words.downloaded);};
 function lock(value){busy=value;for(let i=0;i<3;i++){$('done'+i).disabled=value;$('note'+i).disabled=value;}$('journalExport').disabled=value;$('journalImport').disabled=value;}
 $('journalImport').onchange=async()=>{const file=$('journalImport').files?.[0];if(!file||busy)return;lock(true);try{if(file.size>C.maxBytes)throw Error('size');const next=C.validate(JSON.parse(await file.text()));state=next;render();persist();if($('journalStatus').textContent===words.saved)tell(words.recovered);}catch{tell(words.invalid);}finally{$('journalImport').value='';lock(false);}};
 window.addEventListener('pagehide',release);
})();
