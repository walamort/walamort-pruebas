const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'instrumentos/glockenspiel/studio/core.js'),'utf8'),G=require('../instrumentos/glockenspiel/studio/core.js');
assert.equal(G.notes.length,25);assert.equal(new Set(G.notes).size,25);
assert.equal(G.name(72),'Do5');assert.equal(G.name(96,'en'),'C7');assert(Math.abs(G.frequency(72)-523.251)<.001);assert(Math.abs(G.frequency(96)-2093.005)<.001);
for(const n of [71,97,NaN,72.5])assert.throws(()=>G.frequency(n));
assert.equal(G.tempo(''),72);assert.equal(G.tempo('bad'),72);assert.equal(G.tempo(200),160);assert.equal(G.tempo(1),45);
let seq=[72,74],p=new G.Practice(seq);seq[0]=96;assert.equal(p.answer(74).correct,false);assert.equal(p.errors,1);assert.equal(p.position,0);assert.equal(p.answer(72).correct,true);assert.equal(p.answer(74).done,true);assert.equal(p.answer(96).correct,null);assert.equal(p.errors,1);
for(const seq of [[],[71],[NaN]])assert.throws(()=>new G.Practice(seq));
let created=0,oscillators=[],pending;
class Context{constructor(){created++;this.state='suspended';this.sampleRate=44100;this.currentTime=0;this.destination={};}resume(){this.state='running';return Promise.resolve();}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){},value:0},connect(){},disconnect(){}};}createOscillator(){let o={frequency:{value:0},connect(){},disconnect(){},start(){},stop(){this.stopped=true;}};oscillators.push(o);return o;}}
const sandbox={module:{exports:{}},AudioContext:Context};vm.runInNewContext(source,sandbox);const Audio=sandbox.module.exports.Audio;
(async()=>{const a=new Audio();assert.equal(created,0);await a.ready();assert.equal(created,1);a.strike(96,0);assert(oscillators.every(o=>o.frequency.value<44100*.45));for(let i=0;i<40;i++)a.strike(72,0);assert(a.voices.size<=48);a.setVolume(99);assert.equal(a.volume,1);a.stop();assert.equal(a.voices.size,0);assert(oscillators.every(o=>o.stopped));
const b=new Audio();let ready=b.ready();b.stop();await assert.rejects(ready,/cancelled/);
for(const prefix of ['','en/','pt/'])for(const route of ['instrumentos/glockenspiel/','instrumentos/glockenspiel/studio/','guias/glockenspiel/']){const h=fs.readFileSync(path.join(root,prefix,route,'index.html'),'utf8');assert.equal((h.match(/<h1\b/g)||[]).length,1);assert(h.includes('hreflang="pt-BR"'));if(route==='guias/glockenspiel/')for(const level of ['Basico','Intermedio','Avanzado'])assert(h.includes('Cuaderno-Glockenspiel-'+level+'-Walamort.pdf'));}
for(const level of ['Basico','Intermedio','Avanzado']){const b=fs.readFileSync(path.join(root,'descargas','Cuaderno-Glockenspiel-'+level+'-Walamort.pdf'));assert.equal(b.subarray(0,5).toString(),'%PDF-');assert(b.length>100000);}
console.log('PASS: 25 concert pitches, tuning/range, tempo, honest sequence feedback, lazy audio, cancellation, voice limits, 9 localized pages and 3 PDFs.');})().catch(e=>{console.error(e);process.exitCode=1;});
