(function(root){
  'use strict';
  const ranges={tempo:[60,140,90],drums:[0,1,.65],bass:[0,1,.55],keys:[0,1,.55],low:[-12,12,0],mid:[-12,12,0],high:[-12,12,0],threshold:[-48,0,-18],ratio:[1,12,3],attack:[.001,.1,.015],release:[.05,1,.2],delayTime:[.06,.75,.25],feedback:[0,.65,.25],delayMix:[0,.6,0],reverbMix:[0,.6,0],pan:[-1,1,0],volume:[0,.8,.25]};
  const patches=['piano','guitar','flute','violin'];
  function settings(input={},strict=false){
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('settings');
    const out={};for(const [key,[min,max,fallback]] of Object.entries(ranges)){
      const value=input[key]===undefined?fallback:input[key];
      if(strict&&(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max))throw Error(key);
      out[key]=typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
    }
    for(const key of ['eq','compressor','delay','reverb']){if(strict&&input[key]!==undefined&&typeof input[key]!=='boolean')throw Error(key);out[key]=input[key]===undefined?key!=='compressor':input[key]===true;}
    if(strict&&input.patch!==undefined&&!patches.includes(input.patch))throw Error('patch');out.patch=patches.includes(input.patch)?input.patch:'piano';
    return out;
  }
  function project(input){if(!input||input.kind!=='walamort-production'||input.version!==1)throw Error('project');return {kind:'walamort-production',version:1,settings:settings(input.settings,true)};}
  const presets={neutral:{},warm:{low:3,mid:-2,high:-5},punch:{compressor:true,threshold:-30,ratio:6,attack:.025,release:.12},space:{delayMix:.25,feedback:.4,reverbMix:.3,delayTime:.375}};
  function preset(name){if(!Object.hasOwn(presets,name))throw Error('preset');return settings(presets[name]);}
  function random(seed=12345){let x=seed>>>0;return()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296*2-1;};}
  function synth(input,sampleRate=24000){
    const s=settings(input),beat=60/s.tempo,duration=16*beat,length=Math.round(duration*sampleRate),tracks={drums:new Float32Array(length),bass:new Float32Array(length),keys:new Float32Array(length)};
    const noise=random(9123),freq=m=>440*2**((m-69)/12);
    function add(track,start,seconds,fn){const from=Math.round(start*sampleRate),n=Math.min(Math.round(seconds*sampleRate),length-from);for(let j=0;j<n;j++)track[from+j]+=fn(j/sampleRate,j/n);}
    for(let b=0;b<16;b++){
      add(tracks.drums,b*beat,.25,t=>.55*Math.sin(2*Math.PI*(48*t+75*.035*(1-Math.exp(-t/.035))))*Math.exp(-t*22));
      if(b%4===1||b%4===3)add(tracks.drums,b*beat,.16,t=>noise()*.2*Math.exp(-t*30));
      for(let off of [0,.5])add(tracks.drums,(b+off)*beat,.055,t=>noise()*.07*Math.exp(-t*90));
      const midi=[36,33,41,31][Math.floor(b/4)],f=freq(midi);
      add(tracks.bass,b*beat,beat*.72,(t,p)=>.22*(Math.sin(2*Math.PI*f*t)+.25*Math.sin(4*Math.PI*f*t))*Math.min(1,t/.008)*Math.exp(-p*3));
    }
    const chords=[[60,64,67],[57,60,64],[60,65,69],[59,62,67]],harmonics={piano:[1,.35,.15,.05],guitar:[1,.5,.24,.12],flute:[1,.04,.12,.01],violin:[1,.55,.35,.25]}[s.patch];
    for(let step=0;step<32;step++){
      const f=freq(chords[Math.floor(step/8)][step%3]);
      add(tracks.keys,step*beat/2,beat*.46,(t,p)=>.13*harmonics.reduce((sum,h,k)=>sum+h*Math.sin(2*Math.PI*f*(k+1)*t),0)*Math.min(1,t/.012)*Math.exp(-p*(s.patch==='flute'||s.patch==='violin'?1.5:4)));
    }
    return {tracks,sampleRate,duration};
  }
  function impulse(sampleRate=24000){const n=Math.round(sampleRate*1.6),noise=random(8091),channels=[new Float32Array(n),new Float32Array(n)];for(const channel of channels)for(let i=0;i<n;i++)channel[i]=noise()*Math.exp(-i/sampleRate*5)*(i/sampleRate<.012?i/(sampleRate*.012):1)*.35;return channels;}
  function metrics(channels){let peak=0,sum=0,count=0,clipped=0;for(const channel of channels)for(const value of channel){if(!Number.isFinite(value))throw Error('sample');peak=Math.max(peak,Math.abs(value));sum+=value*value;count++;if(Math.abs(value)>=1)clipped++;}return{peak,rms:count?Math.sqrt(sum/count):0,clipped};}
  function wav(channels,sampleRate){
    if(!Array.isArray(channels)||channels.length<1||channels.length>2||!channels[0].length||channels.some(ch=>ch.length!==channels[0].length)||!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>192000)throw Error('wav');
    const length=channels[0].length,bytes=length*channels.length*2,buffer=new ArrayBuffer(44+bytes),view=new DataView(buffer),write=(pos,text)=>[...text].forEach((c,i)=>view.setUint8(pos+i,c.charCodeAt(0)));
    write(0,'RIFF');view.setUint32(4,36+bytes,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,channels.length,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*channels.length*2,true);view.setUint16(32,channels.length*2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,bytes,true);
    let pos=44;for(let i=0;i<length;i++)for(const channel of channels){if(!Number.isFinite(channel[i]))throw Error('sample');const v=Math.max(-1,Math.min(1,channel[i]));view.setInt16(pos,Math.round(v<0?v*32768:v*32767),true);pos+=2;}return buffer;
  }
  const api={ranges,patches,settings,project,preset,synth,impulse,metrics,wav};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortProduction=api;
})(typeof window==='object'?window:this);
