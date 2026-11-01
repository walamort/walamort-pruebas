const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');process.chdir(path.resolve(__dirname,'..'));
const core=require('../produccion-musical/core.js');
assert.equal(core.settings().volume,.25);assert.equal(core.settings().compressor,false);
assert.equal(core.settings({feedback:99}).feedback,.65);assert.equal(core.settings({tempo:NaN}).tempo,90);
for(const bad of [null,[],{kind:'other',version:1},{kind:'walamort-production',version:2,settings:{}}])assert.throws(()=>core.project(bad));
for(const values of [{volume:1},{feedback:.99},{tempo:'90'},{patch:'unknown'},{delay:'true'},{low:Infinity}])assert.throws(()=>core.project({kind:'walamort-production',version:1,settings:values}));
const project=core.project({kind:'walamort-production',version:1,settings:core.preset('space'),audio:'private',filename:'private'});assert(!JSON.stringify(project).includes('private'));
for(const tempo of [60,90,140]){
 const a=core.synth({tempo}),b=core.synth({tempo});assert.equal(a.duration,16*60/tempo);assert.equal(a.tracks.drums.length,Math.round(a.duration*a.sampleRate));
 for(const name of ['drums','bass','keys']){assert.deepEqual(a.tracks[name],b.tracks[name]);const m=core.metrics([a.tracks[name]]);assert(m.rms>0&&m.peak<1);}
}
const signatures=core.patches.map(patch=>{const data=core.synth({patch});return Buffer.from(data.tracks.keys.buffer).subarray(1000,20000).toString('base64')});assert.equal(new Set(signatures).size,4);
for(const rate of [24000,44100,48000]){const impulse=core.impulse(rate);assert.equal(impulse[0].length,Math.round(rate*1.6));assert.notDeepEqual(impulse[0],impulse[1]);assert(core.metrics(impulse).rms>0);}
const wav=core.wav([new Float32Array([-2,-1,0,.5,1,2]),new Float32Array([0,0,0,0,0,0])],44100),v=new DataView(wav);assert.equal(Buffer.from(wav).toString('ascii',0,4),'RIFF');assert.equal(v.getUint32(24,true),44100);assert.equal(v.getUint16(22,true),2);assert.equal(v.getInt16(44,true),-32768);assert.equal(v.getInt16(60,true),32767);assert.equal(v.getUint32(40,true),24);assert.equal(core.metrics([new Float32Array([1,-1,.5])]).clipped,2);assert.throws(()=>core.wav([new Float32Array([NaN])],44100));
function mockContext(rate){
 const nodes=[];const param=()=>({value:0,setTargetAtTime(value){this.value=value}});const ctx={sampleRate:rate,currentTime:0,destination:{name:'destination'},createBuffer(channels,length,sampleRate){return {sampleRate,duration:length/sampleRate,channels:Array.from({length:channels},()=>new Float32Array(length)),copyToChannel(data,i){this.channels[i].set(data)}}}};
 for(const method of ['createGain','createBiquadFilter','createDynamicsCompressor','createDelay','createConvolver','createStereoPanner','createAnalyser','createBufferSource'])ctx[method]=()=>{const node={name:method,edges:[],gain:param(),frequency:param(),Q:param(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param(),delayTime:param(),pan:param(),connect(to){this.edges.push(to)},disconnect(){this.edges=[];this.disconnected=true},start(t){this.started=t},stop(){this.stopped=true}};nodes.push(node);return node;};return {ctx,nodes};
}
const scope={window:{WalamortProduction:core}};vm.createContext(scope);vm.runInContext(fs.readFileSync('produccion-musical/engine.js','utf8'),scope);
for(const rate of [44100,48000]){
 const {ctx,nodes}=mockContext(rate),engine=scope.window.WalamortProductionAudio,graph=engine.graph(ctx,core.settings({volume:0}),false);
 const convolver=nodes.find(n=>n.name==='createConvolver');assert.equal(convolver.buffer.sampleRate,rate,'Convolution requires the context sample rate.');assert(nodes.filter(n=>n.name==='createDynamicsCompressor').some(n=>n.ratio.value===20));
 const data=core.synth(),sources=engine.sources(ctx,graph,data,core.settings(),true);sources.start(.1);const sourceNodes=nodes.filter(n=>n.name==='createBufferSource');assert.equal(sourceNodes.length,3);assert(sourceNodes.every(n=>n.loop&&n.started===.1));
 graph.update(core.preset('space'),true);sources.update(core.settings({drums:0}));sources.stop();graph.dispose();assert(sourceNodes.every(n=>n.stopped&&n.disconnected));assert(nodes.every(n=>n.disconnected),'All processors and source gain nodes must disconnect.');
 const second=mockContext(rate),g=engine.graph(second.ctx,core.settings()),file=engine.buffer(second.ctx,[new Float32Array(4410)],44100),one=engine.sources(second.ctx,g,{imported:file},core.settings());assert.equal(second.nodes.filter(n=>n.name==='createBufferSource').length,1);assert.equal(one.duration,.1);one.stop();g.dispose();
}
for(const file of ['produccion-musical/index.html','en/produccion-musical/index.html']){
 const html=fs.readFileSync(file,'utf8');assert(html.includes('hreflang="en"'));for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^(https?:|mailto:)/.test(m[1]))continue;assert(fs.existsSync(path.resolve(path.dirname(file),m[1].split(/[?#]/)[0])),file+' -> '+m[1]);}
}
assert(!fs.readdirSync('descargas').some(n=>n==='Walamort-Produccion-Cuaderno-01-Piloto.pdf'));
console.log('PASS: strict project bounds, deterministic stems/timbres, impulse rates, PCM encoding/clipping, live/offline graph controls, imported single source, cleanup, bilingual assets and private full workbook.');
