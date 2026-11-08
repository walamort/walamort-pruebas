(function(root){'use strict';
 const C=typeof module==='object'&&module.exports?require('./core.js'):root.WalamortProduction,maxItems=20,maxBytes=65536;
 function name(value){if(typeof value!=='string')throw Error('name');const text=value.normalize('NFC').trim();if(!text||text.length>60||/[\u0000-\u001f\u007f]/.test(text))throw Error('name');return text;}
 function record(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('record');for(const field of ['groove','tempo','swing','seed','pattern'])if(!Object.hasOwn(raw,field)||raw[field]===undefined)throw Error('record');const s=C.settings(raw,true);return {name:name(raw.name),groove:s.groove,tempo:s.tempo,swing:s.swing,seed:s.seed,pattern:s.pattern};}
 function validate(raw){if(!raw||raw.kind!=='walamort-drum-library'||raw.version!==1||!Array.isArray(raw.patterns)||raw.patterns.length>maxItems)throw Error('library');const patterns=raw.patterns.map(record),names=new Set(patterns.map(p=>p.name.toLowerCase()));if(names.size!==patterns.length)throw Error('duplicate');return {kind:'walamort-drum-library',version:1,patterns};}
 const blank=()=>({kind:'walamort-drum-library',version:1,patterns:[]});
 function add(raw,label,state){const library=validate(raw);if(library.patterns.length>=maxItems)throw Error('full');return validate({...library,patterns:[...library.patterns,record({...C.settings(state,true),name:label})]});}
 function merge(raw,incoming){const library=validate(raw),other=validate(incoming),names=new Set(library.patterns.map(p=>p.name.toLowerCase())),fresh=other.patterns.filter(p=>!names.has(p.name.toLowerCase()));return {library:validate({...library,patterns:[...library.patterns,...fresh]}),added:fresh.length,skipped:other.patterns.length-fresh.length};}
 function apply(raw,current,tempo=false){const p=record(raw),state=C.settings(current,true);return C.settings({...state,groove:p.groove,pattern:p.pattern,swing:p.swing,seed:p.seed,...(tempo?{tempo:p.tempo}:{})},true);}
 const api={maxItems,maxBytes,blank,validate,add,merge,apply};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortPatternLibrary=api;
})(typeof window==='object'?window:globalThis);
