const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),G=require('../instrumentos/glockenspiel/studio/core.js');
assert.equal(G.notes.length,25);assert.equal(G.name(72),'Do5');assert.equal(G.name(96,'en'),'C7');assert(Math.abs(G.frequency(72)-523.251)<.001);assert(Math.abs(G.frequency(96)-2093.005)<.001);
for(const n of [71,97,NaN,72.5])assert.throws(()=>G.frequency(n));
assert.equal(G.tempo(''),72);assert.equal(G.tempo(200),160);assert.equal(G.tempo(1),45);
let seq=[72,74],p=new G.Practice(seq);seq[0]=96;assert.equal(p.answer(74).correct,false);assert.equal(p.errors,1);assert.equal(p.answer(72).correct,true);assert.equal(p.answer(74).done,true);
for(const key of Object.keys(G.scales))for(const length of [8,16,32])for(let i=0;i<20;i++){const m=G.generate(key,length);assert.equal(m.events.length,length);assert(m.events.every(e=>e.note===null||G.scales[key].includes(e.note%12)));assert.deepEqual(G.validate(JSON.parse(JSON.stringify(m))),m);}
const m=G.generate('C',8,()=>.4);m.events[0].note=null;const data=G.midi(m);assert.equal(Buffer.from(data.subarray(0,4)).toString(),'MThd');assert.equal(new DataView(data.buffer).getUint32(18),data.length-22);
for(const bad of [{...m,instrument:'other'},{...m,version:2},{...m,events:[]},{...m,tempo:999},{...m,params:{volume:NaN}},{...m,events:[{note:200,beats:1,velocity:1}]},{...m,events:Array(17).fill({note:72,beats:4,velocity:1})}])assert.throws(()=>G.validate(bad));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'instrumentos/glockenspiel/samples/manifest.json')));assert.equal(manifest.license,'CC0-1.0');assert.equal(manifest.samples.length,4);
for(const sample of manifest.samples){const b=fs.readFileSync(path.join(root,'instrumentos/glockenspiel/samples',sample.file));assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(crypto.createHash('sha256').update(b).digest('hex'),sample.sha256);assert(sample.rootHz>700&&sample.rootHz<2200);}
for(const prefix of ['','en/','pt/']){
 const h=fs.readFileSync(path.join(root,prefix,'instrumentos/glockenspiel/studio/index.html'),'utf8');assert(h.includes('audio.js?v=2'));for(const id of ['generate','exportJson','exportMidi','exportWav','importProject','savedMelodies','brightness','room','delay'])assert(h.includes('id="'+id+'"'));
 const guide=fs.readFileSync(path.join(root,prefix,'guias/glockenspiel/index.html'),'utf8');assert(guide.includes('Glockenspiel-Primeros-Pasos-Walamort.pdf'));assert(!guide.includes('Cuaderno-Glockenspiel-'));assert(!guide.includes('pay.hotmart.com/'));
}
assert(!fs.readdirSync(path.join(root,'descargas')).some(n=>/^(Metodo-|Cuaderno-)Glockenspiel/.test(n)));
console.log('PASS: acoustic sample hashes/license, tuning, random palettes, strict project limits, MIDI container, free/paid separation and localized controls.');
