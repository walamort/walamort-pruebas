const assert=require('node:assert/strict');const C=require('../pulso/core.js'),P=require('../pulso/pitch.js');
for(const p of C.presets){const v=C.validate(p.pattern);assert.equal(v.rows[0].length,C.meters[v.meter].steps*v.bars);for(const bpm of [30,90,260])for(const swing of [0,.8]){const ev=C.events(v,bpm,swing),duration=C.meters[v.meter].beats*v.bars*60/bpm;assert(ev.every(e=>e.time>=0&&e.time<duration));assert(ev.every((e,i)=>!i||ev[i-1].time<=e.time));}assert.deepEqual(C.project({version:1,name:' prueba ',bpm:90,pattern:v}).pattern,v);}
assert.deepEqual(C.presets.find(x=>x.id==='clave32').pattern.rows[3].flatMap((v,i)=>v?[i]:[]),[0,6,12,20,24]);
assert.deepEqual(C.presets.find(x=>x.id==='clave23').pattern.rows[3].flatMap((v,i)=>v?[i]:[]),[4,8,16,22,28]);
for(const x of [null,{}, {meter:'__proto__',rows:[]},{...C.presets[0].pattern,rows:[[9]]}])assert.throws(()=>C.validate(x));
assert.throws(()=>C.events(C.presets[0].pattern,Infinity));assert.throws(()=>C.project({version:1,name:'x',bpm:2,pattern:C.presets[0].pattern}));
assert.equal(C.tapTempo([0,500,1000,1500]),120);assert.equal(C.tapTempo([0,500]),null);assert.equal(C.written(60,'bb'),62);assert.equal(C.written(60,'eb'),69);assert.equal(C.nearest(82.4,[40,45,50]),40);
for(const sampleRate of [44100,48000])for(const f of [30.8677,41.203,65.406,82.407,196,440,659.255,1046.5,2093]){const b=Float32Array.from({length:8192},(_,i)=>.2*Math.sin(2*Math.PI*f*i/sampleRate)+.08*Math.sin(4*Math.PI*f*i/sampleRate));const result=P.analyze(b,sampleRate,{minFrequency:25,maxFrequency:2400,threshold:.003});assert(result.frequency,`${f} Hz detected`);assert(Math.abs(P.cents(result.frequency,f))<4,`${f} accuracy ${result.frequency}`);}
assert.equal(P.analyze(new Float32Array(8192),48000,{minFrequency:25,maxFrequency:2400}).frequency,null);
assert.equal(P.analyze(new Float32Array(8192).fill(1),48000).frequency,null);
console.log('Pulso: 14 grooves, two-bar claves, malformed imports, transposition, tap tempo, 18 pitch fixtures passed');
