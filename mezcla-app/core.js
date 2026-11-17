(function(root){'use strict';
const ranges={tempo:[60,140,90],drums:[0,1,.55],bass:[0,1,.5],keys:[0,1,.4],drumsPan:[-1,1,0],bassPan:[-1,1,0],keysPan:[-1,1,.25],hp:[20,600,20],low:[-12,12,0],mid:[-12,12,0],freq:[200,6000,1200],q:[.3,6,1],high:[-12,12,0],threshold:[-48,0,0],ratio:[1,12,1],attack:[1,100,15],release:[50,1000,200],parallel:[0,1,1],reverb:[0,.6,0],delay:[0,.5,0],feedback:[0,.6,.2],volume:[0,.8,.3]};
function normalize(x={}){return Object.fromEntries(Object.entries(ranges).map(([k,[a,b,d]])=>[k,typeof x[k]==='number'&&Number.isFinite(x[k])?Math.max(a,Math.min(b,x[k])):d]));}
function transfer(input,threshold,ratio){return input<=threshold?input:threshold+(input-threshold)/ratio;}
function project(x){if(!x||x.version!==1||typeof x.name!=='string'||x.name.length>60||!x.settings||typeof x.settings!=='object'||Array.isArray(x.settings)||Object.entries(x.settings).some(([k,v])=>!Object.hasOwn(ranges,k)||typeof v!=='number'||!Number.isFinite(v)))throw Error('Proyecto no válido');return {version:1,name:x.name.trim()||'Mi mezcla',settings:normalize(x.settings)};}
function progress(x,lessons){const ids=new Set(lessons.map(l=>l.id));return Object.fromEntries(Object.entries(x||{}).filter(([id,v])=>ids.has(id)&&v===true));}
const api={ranges,normalize,transfer,project,progress};if(typeof module==='object'&&module.exports)module.exports=api;else root.MixCore=api;
})(typeof window==='object'?window:globalThis);

