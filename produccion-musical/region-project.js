(function(root){
 'use strict';
 const R=typeof module==='object'&&module.exports?require('./regions-core.js'):root.WalamortRegions,P=typeof module==='object'&&module.exports?require('./core.js'):root.WalamortProduction;
 const maxJSONBytes=65536,maxFileBytes=20*1024*1024;
 function identity(value){if(!value||value.type!=='file-sha256'||typeof value.hash!=='string'||!/^[a-f0-9]{64}$/.test(value.hash)||!Number.isInteger(value.bytes)||value.bytes<1||value.bytes>maxFileBytes)throw Error('identity');return {type:'file-sha256',hash:value.hash,bytes:value.bytes};}
 async function identify(bytes,subtle){const size=bytes?.byteLength;if(!Number.isInteger(size)||size<1||size>maxFileBytes||!subtle?.digest)throw Error('identity');const digest=await subtle.digest('SHA-256',bytes);return identity({type:'file-sha256',hash:Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join(''),bytes:size});}
 function validate(raw){if(!raw||raw.kind!=='walamort-region-project'||raw.version!==1)throw Error('project');return {kind:'walamort-region-project',version:1,source:identity(raw.source),regions:R.definitions(raw.regions),settings:P.project({kind:'walamort-production',version:1,settings:raw.settings}).settings};}
 function create(source,regions,settings){return validate({kind:'walamort-region-project',version:1,source,regions,settings:P.settings({...settings,fileMode:'clip'},true)});}
 function matches(project,source){try{const a=identity(project.source),b=identity(source);return a.hash===b.hash&&a.bytes===b.bytes;}catch{return false;}}
 function restore(raw,source,audio,retainedBytes=0){const p=validate(raw);if(!matches(p,source))throw Error('mismatch');R.plan(audio,p.regions,retainedBytes);return p;}
 const api={maxJSONBytes,identify,identity,validate,create,matches,restore};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortRegionProject=api;
})(typeof window==='object'?window:globalThis);
