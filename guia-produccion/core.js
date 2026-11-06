(function(root){'use strict';
 const maxBytes=16384,blank=()=>({kind:'walamort-listening-journal',version:1,practices:Array.from({length:3},()=>({done:false,note:''}))});
 function validate(value){if(!value||value.kind!=='walamort-listening-journal'||value.version!==1||!Array.isArray(value.practices)||value.practices.length!==3)throw Error('schema');return {kind:'walamort-listening-journal',version:1,practices:value.practices.map(p=>{if(!p||typeof p.done!=='boolean'||typeof p.note!=='string'||p.note.length>1200)throw Error('practice');return {done:p.done,note:p.note};})};}
 const api={maxBytes,blank,validate};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortListeningJournal=api;
})(typeof window==='object'?window:globalThis);
