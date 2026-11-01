(function(root){
  'use strict';
  const ranges={tempo:[60,180,90],drums:[0,1,.65],bass:[0,1,.55],keys:[0,1,.55],low:[-12,12,0],mid:[-12,12,0],high:[-12,12,0],threshold:[-48,0,-18],ratio:[1,12,3],attack:[.001,.1,.015],release:[.05,1,.2],delayTime:[.06,.75,.25],feedback:[0,.65,.25],delayMix:[0,.6,0],reverbMix:[0,.6,0],pan:[-1,1,0],volume:[0,.8,.25],swing:[0,.6,0],drumsPan:[-1,1,0],bassPan:[-1,1,0],keysPan:[-1,1,0],highpass:[20,1000,20],lowpass:[1000,20000,20000],midFreq:[200,5000,1000],midQ:[.3,6,1],drive:[0,20,0],saturationMix:[0,1,0],width:[0,1.5,1]};
  const patches=['piano','guitar','flute','violin'];
  const lanes=['kick','snare','hat','perc'],flags=['eq','compressor','delay','reverb','filters','saturation','drumsMute','bassMute','keysMute'];
  const hits=indices=>Array.from({length:16},(_,i)=>indices.includes(i)?1:0),grooves={
    rock:{es:'Pop / rock',en:'Pop / rock',tempo:100,kick:[0,8],snare:[4,12],hat:[0,2,4,6,8,10,12,14],perc:[]},
    house:{es:'House · cuatro al piso',en:'House · four on the floor',tempo:124,kick:[0,4,8,12],snare:[4,12],hat:[2,6,10,14],perc:[3,11]},
    hiphop:{es:'Hip hop · espaciado',en:'Hip hop · spacious',tempo:84,kick:[0,7,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],perc:[15]},
    funk:{es:'Funk · sincopado',en:'Funk · syncopated',tempo:108,kick:[0,3,6,10],snare:[4,12],hat:[0,1,2,4,6,7,8,10,12,13,14],perc:[5,11,15]},
    dembow:{es:'Dembow · inspirado',en:'Dembow · inspired',tempo:96,kick:[0,8],snare:[3,6,11,14],hat:[0,2,4,6,8,10,12,14],perc:[7,15]},
    pulse332:{es:'Pulso 3-3-2',en:'3-3-2 pulse',tempo:104,kick:[0,6,12],snare:[4,12],hat:[0,2,4,6,8,10,12,14],perc:[0,6,12]}
  };
  function pattern(groove='rock'){const g=grooves[groove]||grooves.rock;return Object.fromEntries(lanes.map(lane=>[lane,hits(g[lane])]));}
  function delaySeconds(s){return s.delaySync==='free'?s.delayTime:60/s.tempo*({'quarter':1,'eighth':.5,'dotted':.75,'triplet':1/3}[s.delaySync]||.5);}
  function curve(drive){const a=10**(drive/20),n=4097,out=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;out[i]=drive===0?x:Math.tanh(a*x)/Math.tanh(a);}return out;}
  function settings(input={},strict=false){
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('settings');
    const out={};for(const [key,[min,max,fallback]] of Object.entries(ranges)){
      const value=input[key]===undefined?fallback:input[key];
      if(strict&&(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max))throw Error(key);
      out[key]=typeof value==='number'&&Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
    }
    for(const key of flags){if(strict&&input[key]!==undefined&&typeof input[key]!=='boolean')throw Error(key);out[key]=input[key]===undefined?['eq','delay','reverb'].includes(key):input[key]===true;}
    if(strict&&input.patch!==undefined&&!patches.includes(input.patch))throw Error('patch');out.patch=patches.includes(input.patch)?input.patch:'piano';
    for(const [key,allowed,fallback] of [['groove',Object.keys(grooves),'rock'],['solo',['none','drums','bass','keys'],'none'],['delaySync',['free','quarter','eighth','dotted','triplet'],'free']]){if(strict&&input[key]!==undefined&&!allowed.includes(input[key]))throw Error(key);out[key]=allowed.includes(input[key])?input[key]:fallback;}
    out.pattern=pattern(out.groove);
    if(input.pattern!==undefined){if(!input.pattern||typeof input.pattern!=='object'||lanes.some(l=>!Array.isArray(input.pattern[l])||input.pattern[l].length!==16||input.pattern[l].some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>1))){if(strict)throw Error('pattern');}else out.pattern=Object.fromEntries(lanes.map(l=>[l,[...input.pattern[l]]]));}
    return out;
  }
  function project(input){if(!input||input.kind!=='walamort-production'||input.version!==1)throw Error('project');return {kind:'walamort-production',version:1,settings:settings(input.settings,true)};}
  const presets={neutral:{},warm:{low:3,mid:-2,high:-5},punch:{compressor:true,threshold:-30,ratio:6,attack:.025,release:.12},space:{delayMix:.25,feedback:.4,reverbMix:.3,delayTime:.375},telephone:{filters:true,highpass:400,lowpass:2800,mid:3,midFreq:1800},dub:{delaySync:'dotted',delayMix:.4,feedback:.6,reverbMix:.18},lofi:{filters:true,highpass:100,lowpass:5000,saturation:true,drive:6,saturationMix:.3,width:.65}};
  function preset(name){if(!Object.hasOwn(presets,name))throw Error('preset');return settings(presets[name]);}
  function random(seed=12345){let x=seed>>>0;return()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296*2-1;};}
  function synth(input,sampleRate=24000){
    const s=settings(input),beat=60/s.tempo,duration=16*beat,length=Math.round(duration*sampleRate),tracks={drums:new Float32Array(length),bass:new Float32Array(length),keys:new Float32Array(length)};
    const noise=random(9123),freq=m=>440*2**((m-69)/12);
    function add(track,start,seconds,fn){const from=Math.round(start*sampleRate),n=Math.min(Math.round(seconds*sampleRate),length-from);for(let j=0;j<n;j++)track[from+j]+=fn(j/sampleRate,j/n);}
    for(let bar=0;bar<4;bar++)for(let step=0;step<16;step++){
      const start=(bar*4+step/4+(step%2?s.swing/4:0))*beat;
      for(const lane of lanes){const velocity=s.pattern[lane][step];if(!velocity)continue;
        if(lane==='kick')add(tracks.drums,start,.25,t=>velocity*.55*Math.sin(2*Math.PI*(48*t+75*.035*(1-Math.exp(-t/.035))))*Math.exp(-t*22));
        if(lane==='snare')add(tracks.drums,start,.16,t=>velocity*(noise()*.18+Math.sin(2*Math.PI*180*t)*.07)*Math.exp(-t*30));
        if(lane==='hat')add(tracks.drums,start,.055,t=>velocity*noise()*.07*Math.exp(-t*90));
        if(lane==='perc')add(tracks.drums,start,.12,t=>velocity*.17*Math.sin(2*Math.PI*650*t)*Math.exp(-t*40));
      }
    }
    for(let b=0;b<16;b++){
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
  const api={ranges,patches,flags,lanes,grooves,pattern,delaySeconds,curve,settings,project,preset,synth,impulse,metrics,wav};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortProduction=api;
})(typeof window==='object'?window:this);
