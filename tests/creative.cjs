'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
process.chdir(path.resolve(__dirname,'..'));
const C=require('../estudio-creativo/core.js');
assert.deepEqual(C.scale('C'),[0,2,4,5,7,9,11]);assert.deepEqual(C.scale('F'),[5,7,9,10,0,2,4]);
assert.deepEqual(C.chord('C',0,false,0).notes,[48,52,55]);assert.deepEqual(C.chord('C',0,false,1).notes,[52,55,60]);assert.deepEqual(C.chord('C',0,false,2).notes,[55,60,64]);
assert.deepEqual(C.chord('C',4,true,0).notes,[55,59,62,65]);assert.equal(C.chord('C',4,true,0).suffix,'7');assert.equal(C.chord('C',0,true,0).suffix,'maj7');assert.equal(C.chord('C',6,true,0).roman,'viiø7');
assert.equal(C.chord('Am',4,false,0).quality,'minor');assert.equal(C.noteName(70,'en',true),'B♭4');assert.equal(C.noteName(60,'es'),'Do4');
for(const key of Object.keys(C.KEYS))for(let d=0;d<7;d++)for(const seventh of [true,false])for(let inv=0;inv<(seventh?4:3);inv++){const notes=C.chord(key,d,seventh,inv).notes;assert(notes.every((n,i)=>i===0||n>notes[i-1]));assert.equal(notes.length,seventh?4:3);assert(notes.every(n=>C.scale(key).includes(n%12)))}
const project=C.blank();project.title='Test';project.melody=[60,64,67,null,65,69,72,null,67,71,74,77,72,71,60,null];
assert.deepEqual(C.validate(JSON.parse(JSON.stringify(project))),project);assert.throws(()=>C.validate({...project,tempo:0}));assert.throws(()=>C.validate({...project,melody:[60]}));assert.throws(()=>C.validate({...project,chords:[{degree:99,seventh:false,inversion:0}]}));assert.throws(()=>C.validate({...project,instrument:'script'}));assert.throws(()=>C.validate({...project,melody:Array(16).fill(999)}));
const chromatic=C.blank();chromatic.melody[0]=61;chromatic.melody[1]=84;assert.deepEqual(C.observations(chromatic).outside,[0]);assert.deepEqual(C.observations(chromatic).leaps,[1]);assert.deepEqual(C.observations(chromatic).strong,[0]);
const midi=C.midi(project);assert.equal(Buffer.from(midi.subarray(0,4)).toString(),'MThd');assert.equal(Buffer.from(midi.subarray(14,18)).toString(),'MTrk');assert.equal(Buffer.from(midi).readUInt32BE(18),midi.length-22);
let pos=22,tick=0,on=0,off=0,active=new Set();function variable(){let n=0,b;do{b=midi[pos++];n=(n<<7)|(b&127)}while(b&128);return n}
while(pos<midi.length){tick+=variable();const status=midi[pos++];if(status===255){const type=midi[pos++],len=variable();if(type===47){assert.equal(len,0);break}pos+=len}else if((status&240)===192)pos++;else{const note=midi[pos++],velocity=midi[pos++],id=(status&15)+':'+note;if((status&240)===144&&velocity){assert(!active.has(id));active.add(id);on++}else{assert(active.has(id));active.delete(id);off++}}}
assert.equal(tick,1536);assert.equal(active.size,0);assert.equal(on,off);assert.equal(on,project.melody.filter(n=>n!==null).length+12);
function harness(lang='es'){
 const elements={},data={},calls=[];let listener=()=>{};
 function make(tag='div'){return {tagName:tag.toUpperCase(),value:'',checked:false,disabled:false,children:[],attributes:{},className:'',textContent:'',style:{},classList:{toggle(){}},setAttribute(k,v){this.attributes[k]=v},append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},addEventListener(k,fn){this[k]=fn},querySelectorAll(tag){const out=[];function visit(el){for(const n of el.children){if(n.tagName===tag.toUpperCase())out.push(n);visit(n)}}visit(this);return out},remove(){},click(){if(this.onclick)this.onclick()}}}
 function el(id){if(!elements[id]){elements[id]=make();elements[id].value=({key:'C',instrument:'piano',degree:'0',inversion:'0',tempo:'90'})[id]||'';if(id==='advance')elements[id].checked=true}return elements[id]}
 const window={location:{pathname:'/walamort-pruebas/estudio-creativo/',search:'',href:'https://example.test/walamort-pruebas/laboratorio-armonico/'},confirm:()=>false,print(){calls.push('print')},addEventListener(){},WalamortCreative:C,WalamortSound:{instrument:()=> 'piano'},WalamortCreativePlayer:{setStateListener(fn){listener=fn},stop(){listener(false)},play(events,bpm,a,b,beats,lock=true){calls.push(events);listener(true,lock);return Promise.resolve()}}};
 const context={window,document:{documentElement:{lang},getElementById:el,createElement:make,body:make(),addEventListener(){}},localStorage:{getItem:k=>data[k]||null,setItem:(k,v)=>data[k]=v},URLSearchParams,URL,Blob,Uint8Array,console,setTimeout,clearTimeout};vm.createContext(context);vm.runInContext(fs.readFileSync('estudio-creativo/copy.js','utf8'),context);return {context,el,data,calls};
}
(async()=>{
 for(const lang of ['es','en']){
  const h=harness(lang);vm.runInContext(fs.readFileSync('estudio-creativo/app.js','utf8'),h.context);
  assert.equal(h.el('steps').children.length,4);assert.equal(h.el('bars').children.length,4);
  h.el('title').value='My musical idea';h.el('title').oninput();h.el('example').onclick();h.el('save').onclick();assert.equal(JSON.parse(Object.values(h.data)[0]).title,'My musical idea');let saved=C.validate(JSON.parse(Object.values(h.data)[0]));assert.equal(saved.melody.filter(n=>n!==null).length,15);
  h.el('pitch').value='61';h.el('pitch').onchange();h.el('save').onclick();saved=C.validate(JSON.parse(Object.values(h.data)[0]));assert.equal(saved.melody[0],61);assert.equal(h.el('editor').disabled,false);
  h.el('undo').onclick();h.el('save').onclick();saved=C.validate(JSON.parse(Object.values(h.data)[0]));assert.equal(saved.melody[0],60);
  h.el('repeat').onclick();h.el('save').onclick();saved=C.validate(JSON.parse(Object.values(h.data)[0]));assert.deepEqual(saved.melody.slice(4,8),saved.melody.slice(0,4));
  h.el('play').onclick();assert.equal(h.el('editor').disabled,true);assert(h.calls.at(-1).length>16);h.el('stop').onclick();assert.equal(h.el('editor').disabled,false);
  const before=Object.values(h.data)[0];h.el('load').files=[{size:10,text:async()=>'{"version":999}'}];await h.el('load').onchange();h.el('save').onclick();assert.equal(Object.values(h.data)[0],before);
  h.el('load').files=[{size:1000,text:async()=>JSON.stringify({...project,title:'Imported'})}];await h.el('load').onchange();h.el('save').onclick();assert.equal(JSON.parse(Object.values(h.data)[0]).title,'Imported');
  const lab=harness(lang);vm.runInContext(fs.readFileSync('estudio-creativo/harmony.js','utf8'),lab.context);lab.el('seventh').checked=true;lab.el('seventh').onchange();lab.el('inversion').value='3';lab.el('inversion').onchange();assert.equal(lab.el('inversion').children.length,4);assert(lab.el('create').href.includes('inversion=3'));lab.el('seventh').checked=false;lab.el('seventh').onchange();assert.equal(lab.el('inversion').value,'2');
 }
 for(const file of ['estudio-creativo/index.html','laboratorio-armonico/index.html','en/estudio-creativo/index.html','en/laboratorio-armonico/index.html']){const html=fs.readFileSync(file,'utf8');for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^https?:/.test(match[1]))continue;assert(fs.existsSync(path.resolve(path.dirname(file),match[1].split('?')[0])),file+' -> '+match[1])}}
 console.log('PASS: diatonic triads/sevenths/inversions across five keys, project validation, note observations, MIDI timing and balanced notes, bilingual editing/undo/import, playback locks, harmony bridge and local assets.');
})().catch(e=>{console.error(e);process.exitCode=1});
