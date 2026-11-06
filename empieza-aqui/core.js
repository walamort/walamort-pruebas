(function(root){'use strict';const routes=['learn','admission','create','produce'],ids=routes.flatMap(r=>[1,2,3,4].map(n=>r+'-'+n)),maxBytes=8192;
 function blank(){return {kind:'walamort-start-paths',version:1,sessions:[],last:null};}
 function validate(v){if(!v||v.kind!=='walamort-start-paths'||v.version!==1||!Array.isArray(v.sessions)||v.sessions.length>16||v.sessions.some(id=>!ids.includes(id))||new Set(v.sessions).size!==v.sessions.length||v.last!==null&&!routes.includes(v.last))throw Error('schema');return {kind:'walamort-start-paths',version:1,sessions:ids.filter(id=>v.sessions.includes(id)),last:v.last};}
 const api={routes,ids,maxBytes,blank,validate};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortStartPaths=api;
})(typeof window==='object'?window:globalThis);
