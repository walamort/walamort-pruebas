(function(root){
'use strict';
function titlePart(title){if(typeof title!=='string')throw Error('title');const slug=title.slice(0,256).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40).replace(/-+$/,'');return 'walamort-'+(slug?slug+'-':'');}
function fingerprint(bytes,max){if(!(bytes instanceof Uint8Array)||!bytes.length||bytes.length>max)throw Error('bytes');let hash=2166136261;for(const byte of bytes)hash=Math.imul(hash^byte,16777619)>>>0;return hash.toString(16).padStart(8,'0');}
function tempoPart(tempo){if(!Number.isFinite(tempo)||tempo<45||tempo>180)throw Error('tempo');return String(Number(tempo.toFixed(2))).replace('.','p')+'bpm-';}
function midi(kind,file,title=''){if(!['arrangement','drums-pattern','drums-arrangement'].includes(kind))throw Error('kind');if(!file||!Number.isInteger(file.bars)||file.bars<1||file.bars>16)throw Error('file');return titlePart(title)+tempoPart(file.tempo)+file.bars+(file.bars===1?'bar-':'bars-')+kind+'-'+fingerprint(file.bytes,1048576)+'.mid';}
function wav(file,title=''){if(!file||!['mix-dry','mix-fx','clip-dry','clip-fx'].includes(file.mode)||!Number.isFinite(file.duration)||file.duration<=0||file.duration>120)throw Error('file');return titlePart(title)+(file.mode.startsWith('clip-')?'':tempoPart(file.tempo))+String(Number(file.duration.toFixed(2))).replace('.','p')+'s-'+file.mode+'-'+fingerprint(file.bytes,32*1024*1024)+'.wav';}
function project(file,title=''){if(!file)throw Error('file');return titlePart(title)+tempoPart(file.tempo)+'project-'+fingerprint(file.bytes,65536)+'.json';}
const api={midi,wav,project};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortExportName=api;
})(typeof window==='object'?window:globalThis);
