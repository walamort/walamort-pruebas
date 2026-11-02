const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),core=require('../produccion-musical/core.js');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalog=JSON.parse(read('banco-sonoro/catalog.json')).banks,integrity=JSON.parse(read('banco-sonoro/INTEGRITY.json'));
assert.equal(catalog.length,14);assert.equal(integrity.length,564);
for(const entry of integrity){const data=fs.readFileSync(path.join(root,'banco-sonoro',entry.path));assert.equal(data.length,entry.bytes);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),entry.sha256);}
assert.equal(catalog.reduce((n,b)=>n+b.count,0),564);
for(const b of catalog){assert(b.licenseURL.includes('creativecommons'));for(const midi of Object.keys(b.samples))assert(Number.isInteger(+midi));}
for(const input of [{keysBank:'missing'},{soundMode:'vst'},{spatial:'atmos'},{chords:[0,1,2]},{chords:[0,1,2,7]},{key:12},{seed:1.5},{sampleRoot:60.2}])assert.throws(()=>core.settings(input,true));
const s=core.settings();assert.deepEqual(core.variation(s),core.variation(s));assert.notEqual(core.variation(s).seed,s.seed);
assert.deepEqual(core.harmony({...s,key:2})[0],[62,66,69]);
for(const style of ['arpeggio','block','pad','random']){const plan=core.plan({...s,backingStyle:style});assert(plan.events.length);assert(plan.events.every(e=>e.beat>=0&&e.beat<16&&e.duration>0));assert.deepEqual(plan,core.plan({...s,backingStyle:style}));}
for(let a=-180;a<=180;a++){const g=core.surroundGains(a);assert.equal(g[3],0);assert(Math.abs(g.reduce((n,x)=>n+x*x,0)-1)<1e-10);}
assert(Math.abs(core.surroundGains(0)[2]-1)<1e-10);assert.deepEqual(core.spatialPoint(0,0,1),[0,0,-1]);
const scope={window:{WalamortProduction:core,WalamortSampleCatalog:{banks:catalog}},document:{currentScript:{src:'https://example.org/banco-sonoro/loader.js'}},URL,Float32Array,console,Blob,setTimeout,clearTimeout};
let fetches=0;scope.fetch=async()=>{fetches++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(10)}};
const audio={sampleRate:44100,numberOfChannels:1,getChannelData:()=>Float32Array.from({length:44100},(_,i)=>Math.sin(i/20)*.3)};
scope.window.OfflineAudioContext=class{async decodeAudioData(){return audio}};vm.createContext(scope);vm.runInContext(read('banco-sonoro/loader.js'),scope);
const samples=scope.window.WalamortSamples;
for(const b of catalog)for(let n=b.range[0];n<=b.range[1];n++){const got=samples.nearest(b.id,n);assert(b.samples[got.sample]);assert(got.rate>0);if(b.samples[n])assert(got.exact);}
const surround=require('../produccion-musical/surround.js'),bytes=surround.wav51(Array.from({length:6},(_,c)=>Float32Array.from([c/10,-c/10])),44100),v=new DataView(bytes);
assert.equal(v.getUint16(20,true),65534);assert.equal(v.getUint16(22,true),6);assert.equal(v.getUint32(40,true),0x60f);assert.equal(v.getUint32(64,true),24);assert.equal(v.getInt16(68+5*2,true),16384);assert.equal(v.getInt16(68+12+5*2,true),-16384);
assert.throws(()=>surround.wav51([new Float32Array(1)],44100));
vm.runInContext(read('produccion-musical/visuals.js'),scope);const compression=scope.window.WalamortProductionVisualMath.compression;assert.equal(compression(-40,-18,4),-40);assert.equal(compression(0,-18,4),-13.5);
vm.runInContext(read('produccion-musical/studio.js'),scope);const Recorder=scope.window.WalamortLocalRecorder;
(async()=>{
 await samples.load('piano',60);await samples.load('piano',60);assert.equal(fetches,1);
 const data=await samples.render({...s,tempo:180});assert.equal(data.sampleRate,44100);assert.equal(data.tracks.keys.length,2);assert(core.metrics(data.tracks.keys).rms>0);
 const custom=await samples.render({...s,soundMode:'synth'},audio);assert.equal(custom.tracks.keys.length,2);assert(core.metrics(custom.tracks.keys).rms>0);
 let resolve,stopped=0,states=[],ready=0,cancelled=0;
 const stream={getTracks:()=>[{stop(){stopped++}}]};
 class FakeRecorder{static isTypeSupported(){return true}constructor(){this.state='inactive';this.mimeType='audio/webm'}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable({data:new Blob(['audio'])});this.onstop();}}
 const recorder=new Recorder({mediaDevices:{getUserMedia:()=>new Promise(r=>resolve=r)},Recorder:FakeRecorder,onReady:async()=>ready++,onState:s=>states.push(s),timer:()=>1,cancel:()=>cancelled++});
 const pending=recorder.start();recorder.stop();resolve(stream);await pending;assert.equal(stopped,1);assert.equal(ready,0);assert(!recorder.active);
 recorder.mediaDevices.getUserMedia=async()=>stream;await recorder.start();assert(recorder.active);recorder.stop();await Promise.resolve();await Promise.resolve();assert.equal(ready,1);assert.equal(stopped,2);assert(cancelled);assert(states.includes('recording'));assert(!recorder.active);
 console.log('Studio: 564 hashes, catalog, settings, backing, sample loading/render, 5.1 header/routing, curves and recorder lifecycle passed.');
})().catch(e=>{console.error(e);process.exitCode=1});

