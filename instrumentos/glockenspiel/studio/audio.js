(()=>{'use strict';
const G=window.WalamortGlockenspiel;
const script=document.currentScript,base=new URL('../samples/',script.src);
function graph(ctx,p){
 const input=ctx.createGain(),filter=ctx.createBiquadFilter(),master=ctx.createGain(),dry=ctx.createGain(),wet=ctx.createGain(),delayGain=ctx.createGain(),delay=ctx.createDelay(2),feedback=ctx.createGain(),convolver=ctx.createConvolver();
 filter.type='lowpass';filter.Q.value=.6;input.connect(filter);filter.connect(dry);dry.connect(master);filter.connect(convolver);convolver.connect(wet);wet.connect(master);filter.connect(delay);delay.connect(delayGain);delayGain.connect(master);delay.connect(feedback);feedback.connect(delay);
 const impulse=ctx.createBuffer(2,Math.floor(ctx.sampleRate*1.8),ctx.sampleRate);let seed=214013;for(let c=0;c<2;c++){const a=impulse.getChannelData(c);for(let i=0;i<a.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;a[i]=((seed/4294967296)*2-1)*Math.pow(1-i/a.length,3)*.35;}}convolver.buffer=impulse;delay.delayTime.value=.24;feedback.gain.value=.28;
 const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-6;limiter.knee.value=6;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.15;master.connect(limiter);limiter.connect(ctx.destination);
 function update(v){filter.frequency.value=2500+v.brightness*15500;dry.gain.value=1;wet.gain.value=v.room*.5;delayGain.gain.value=v.delay*.45;master.gain.value=v.volume*.48;}
 update(p);return {input,update,nodes:[input,filter,master,dry,wet,delayGain,delay,feedback,convolver,limiter]};
}
function voice(ctx,rack,sample,note,time,p,velocity,voices){
 const source=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();source.buffer=sample.buffer;source.playbackRate.value=G.frequency(note)/sample.rootHz;filter.type='lowpass';filter.frequency.value=p.mallet==='soft'?4200:20000;
 const life=Math.min(8,p.resonance),end=time+life;gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(Math.max(.001,velocity*sample.normalization),time+.002);gain.gain.setValueAtTime(velocity*sample.normalization,Math.min(end-.01,time+.03));gain.gain.exponentialRampToValueAtTime(.0001,end);
 source.connect(filter);filter.connect(gain);gain.connect(rack.input);if(voices){while(voices.size>=32){const first=voices.values().next().value;try{first.stop()}catch{}voices.delete(first);}voices.add(source);}
 source.onended=()=>{voices?.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};source.start(time);source.stop(end+.02);return source;
}
class SampleAudio{
 constructor(){this.ctx=null;this.samples=[];this.params={...G.defaults};this.voices=new Set();this.epoch=0;this.loading=null;}
 async ready(){
  const epoch=this.epoch,C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error('audio');
  if(!this.ctx){this.ctx=new C();this.rack=graph(this.ctx,this.params);}
  await this.ctx.resume();
  if(!this.loading)this.loading=this.load().catch(e=>{this.loading=null;throw e;});
  await this.loading;if(epoch!==this.epoch)throw Error('cancelled');if(this.ctx.state!=='running')throw Error('audio');return this.ctx;
 }
 async load(){const response=await fetch(new URL('manifest.json',base));if(!response.ok)throw Error('samples');const manifest=await response.json();const samples=await Promise.all(manifest.samples.map(async s=>{const r=await fetch(new URL(s.file,base));if(!r.ok)throw Error('samples');const buffer=await this.ctx.decodeAudioData(await r.arrayBuffer());let peak=0;for(let c=0;c<buffer.numberOfChannels;c++){const a=buffer.getChannelData(c);for(let i=0;i<a.length;i++)peak=Math.max(peak,Math.abs(a[i]));}return {...s,buffer,normalization:Math.min(24,.65/Math.max(.01,peak))};}));this.samples=samples;}
 set(params){this.params={...this.params,...params};this.rack?.update(this.params);}
 nearest(note){return this.samples.reduce((a,b)=>Math.abs(b.rootMidi-note)<Math.abs(a.rootMidi-note)?b:a);}
 strike(note,time,velocity=.75){G.frequency(note);if(!this.samples.length)return;return voice(this.ctx,this.rack,this.nearest(note),note,time,this.params,velocity,this.voices);}
 stop(){this.epoch++;for(const s of this.voices)try{s.stop()}catch{}this.voices.clear();if(this.rack){this.rack.nodes.forEach(n=>n.disconnect());this.rack=graph(this.ctx,this.params);}}
 async render(value){const melody=G.validate(value);await this.ready();const length=melody.events.reduce((n,e)=>n+e.beats,0)*60/melody.tempo+melody.params.resonance+2;const C=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!C)throw Error('offline');const ctx=new C(2,Math.ceil(length*44100),44100),rack=graph(ctx,melody.params);let time=.02;for(const e of melody.events){if(e.note!==null)voice(ctx,rack,this.nearest(e.note),e.note,time,melody.params,e.velocity);time+=e.beats*60/melody.tempo;}const buffer=await ctx.startRendering();return wav(buffer);}
}
function wav(buffer){const length=buffer.length,channels=2,view=new DataView(new ArrayBuffer(44+length*4));const string=(o,s)=>{for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i));};string(0,'RIFF');view.setUint32(4,36+length*4,true);string(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels,true);view.setUint32(24,buffer.sampleRate,true);view.setUint32(28,buffer.sampleRate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);string(36,'data');view.setUint32(40,length*4,true);const a=buffer.getChannelData(0),b=buffer.getChannelData(1);for(let i=0;i<length;i++){view.setInt16(44+i*4,Math.round(Math.max(-1,Math.min(1,a[i]))*32767),true);view.setInt16(46+i*4,Math.round(Math.max(-1,Math.min(1,b[i]))*32767),true);}return new Blob([view.buffer],{type:'audio/wav'});}
window.WalamortGlockAudio=SampleAudio;
})();
