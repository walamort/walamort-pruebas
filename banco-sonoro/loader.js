(function(root){
 'use strict';
 const base=new URL('.',document.currentScript.src),catalog=root.WalamortSampleCatalog.banks,cache=new Map();let decoder;
 function bank(id){const b=catalog.find(b=>b.id===id);if(!b)throw Error('bank');return b;}
 function nearest(id,note){const b=bank(id);if(!Number.isFinite(note))throw Error('note');const notes=Object.keys(b.samples).map(Number).sort((a,b)=>a-b),sample=notes.reduce((a,b)=>Math.abs(b-note)<Math.abs(a-note)?b:a,notes[0]);return {bank:b,note,sample,exact:sample===note,file:b.samples[sample],rate:2**((note-sample)/12)};}
 async function load(id,note){const n=nearest(id,note),url=new URL(n.file.split('/').map(encodeURIComponent).join('/'),base).href;let promise=cache.get(url);if(!promise){promise=(async()=>{const response=await fetch(url,{credentials:'same-origin'});if(!response.ok)throw Error('sample '+response.status);const bytes=await response.arrayBuffer();if(bytes.byteLength>10*1024*1024)throw Error('sample-size');const Offline=root.OfflineAudioContext||root.webkitOfflineAudioContext;if(!Offline)throw Error('audio');decoder??=new Offline(1,1,44100);return decoder.decodeAudioData(bytes.slice(0));})();cache.set(url,promise);promise.catch(()=>cache.delete(url));while(cache.size>48)cache.delete(cache.keys().next().value);}return {...n,audio:await promise};}
 function fold(note,range){let n=note;while(n<range[0])n+=12;while(n>range[1])n-=12;return n;}
 async function render(settings,custom=null,onProgress=()=>{}){
  const core=root.WalamortProduction,s=core.settings(settings),plan=core.plan(s),data=core.synth(s,44100);if(s.soundMode==='synth'&&!custom)return data;
  const events=plan.events.filter(event=>s.soundMode==='samples'||(custom&&event.track==='keys')).map(event=>{const id=event.track==='bass'?s.bassBank:s.keysBank,b=bank(id),note=fold(event.note,b.range);return {...event,id,note};}),needed=[...new Map(events.filter(e=>!custom||e.track!=='keys').map(e=>[e.id+':'+e.note,e])).values()],loaded=new Map();let done=0;
  // Bound concurrent network/decode work, including on slower mobile devices.
  const queue=[...needed];await Promise.all(Array.from({length:Math.min(4,queue.length)},async()=>{while(queue.length){const e=queue.shift();loaded.set(e.id+':'+e.note,await load(e.id,e.note));onProgress(++done,needed.length);}}));
  const length=Math.round(plan.duration*data.sampleRate);if(s.soundMode==='samples')data.tracks.bass=[new Float32Array(length),new Float32Array(length)];data.tracks.keys=[new Float32Array(length),new Float32Array(length)];
  for(const event of events){const sample=custom&&event.track==='keys'?{audio:custom,rate:2**((event.note-s.sampleRoot)/12)}:loaded.get(event.id+':'+event.note),input=sample.audio,ratio=sample.rate*input.sampleRate/data.sampleRate,start=Math.round(event.beat*60/s.tempo*data.sampleRate),duration=Math.min(Math.round(event.duration*60/s.tempo*data.sampleRate),length-start),gain=event.velocity*(event.track==='bass'?.55:.42);
   for(let channel=0;channel<2;channel++){const src=input.getChannelData(Math.min(channel,input.numberOfChannels-1)),out=data.tracks[event.track][channel];for(let i=0;i<duration;i++){const pos=i*ratio,index=Math.floor(pos);if(index+1>=src.length)break;const value=src[index]+(src[index+1]-src[index])*(pos-index),attack=Math.min(1,i/(data.sampleRate*.008)),release=Math.min(1,(duration-i)/(data.sampleRate*.04));out[start+i]+=value*attack*release*gain;}}
  }
  return data;
 }
 root.WalamortSamples={catalog,bank,nearest,load,render,fold};
})(window);
