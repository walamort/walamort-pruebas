(function(root){'use strict';
 const C=typeof module==='object'&&module.exports?require('./core.js'):root.WalamortProduction;
 const fingerprint=s=>JSON.stringify([s.groove,C.lanes.map(l=>s.pattern[l]),s.seed]);
 class Comparison{
  constructor(){this.clear();}
  clear(){this.pair=null;this.active=null;}
  capture(before,after){const a=C.settings(before,true),b=C.settings(after,true);if(a.groove!==b.groove)throw Error('groove');this.pair=[a,b];this.active=1;}
  observe(raw){if(!this.pair)return false;const state=C.settings(raw,true),key=fingerprint(state),index=this.pair.findIndex(s=>fingerprint(s)===key);if(index<0){this.clear();return false;}this.active=index;return true;}
  select(raw,index){if(![0,1].includes(index)||!this.observe(raw))throw Error('comparison');const state=C.settings(raw,true),saved=this.pair[index];state.pattern=Object.fromEntries(C.lanes.map(l=>[l,[...saved.pattern[l]]]));state.seed=saved.seed;this.active=index;return state;}
 }
 const api={Comparison};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortPatternCompare=api;
})(typeof window==='object'?window:globalThis);
