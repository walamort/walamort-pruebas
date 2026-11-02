(function(root){
  'use strict';
  const ranges={tempo:[60,180,90],drums:[0,1,.65],bass:[0,1,.55],keys:[0,1,.55],low:[-12,12,0],mid:[-12,12,0],high:[-12,12,0],threshold:[-48,0,-18],ratio:[1,12,3],attack:[.001,.1,.015],release:[.05,1,.2],delayTime:[.06,.75,.25],feedback:[0,.65,.25],delayMix:[0,.6,0],reverbMix:[0,.6,0],pan:[-1,1,0],volume:[0,.8,.25],swing:[0,.6,0],drumsPan:[-1,1,0],bassPan:[-1,1,0],keysPan:[-1,1,0],highpass:[20,1000,20],lowpass:[1000,20000,20000],midFreq:[200,5000,1000],midQ:[.3,6,1],drive:[0,20,0],saturationMix:[0,1,0],width:[0,1.5,1],seed:[1,999999,123],sampleRoot:[21,108,60],drumsAz:[-180,180,-30],bassAz:[-180,180,0],keysAz:[-180,180,30],elevation:[-60,60,0],distance:[.5,8,1.5],lfeSend:[0,.5,0]};
  const bankIds=['piano','guitar-acoustic','guitar-nylon','guitar-electric','bass-electric','contrabass','flute','violin','cello','trumpet','saxophone','fluid-bright_acoustic_piano','fluid-electric_piano_1','fluid-electric_piano_2'];
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
    for(const key of ['seed','sampleRoot']){if(strict&&!Number.isInteger(out[key]))throw Error(key);out[key]=Math.round(out[key]);}
    for(const key of flags){if(strict&&input[key]!==undefined&&typeof input[key]!=='boolean')throw Error(key);out[key]=input[key]===undefined?['eq','delay','reverb'].includes(key):input[key]===true;}
    if(strict&&input.patch!==undefined&&!patches.includes(input.patch))throw Error('patch');out.patch=patches.includes(input.patch)?input.patch:'piano';
    for(const [key,allowed,fallback] of [['groove',Object.keys(grooves),'rock'],['solo',['none','drums','bass','keys'],'none'],['delaySync',['free','quarter','eighth','dotted','triplet'],'free']]){if(strict&&input[key]!==undefined&&!allowed.includes(input[key]))throw Error(key);out[key]=allowed.includes(input[key])?input[key]:fallback;}
    for(const [key,allowed,fallback] of [['soundMode',['samples','synth'],'samples'],['keysBank',bankIds,'piano'],['bassBank',bankIds,'bass-electric'],['scaleMode',['major','minor'],'major'],['backingStyle',['arpeggio','block','pad','random'],'arpeggio'],['spatial',['stereo','binaural'],'stereo'],['fileMode',['clip','instrument'],'clip']]){if(strict&&input[key]!==undefined&&!allowed.includes(input[key]))throw Error(key);out[key]=allowed.includes(input[key])?input[key]:fallback;}
    if(strict&&input.key!==undefined&&(!Number.isInteger(input.key)||input.key<0||input.key>11))throw Error('key');out.key=Number.isInteger(input.key)&&input.key>=0&&input.key<=11?input.key:0;
    if(strict&&input.chords!==undefined&&(!Array.isArray(input.chords)||input.chords.length!==4||input.chords.some(v=>!Number.isInteger(v)||v<0||v>6)))throw Error('chords');out.chords=Array.isArray(input.chords)&&input.chords.length===4&&input.chords.every(v=>Number.isInteger(v)&&v>=0&&v<=6)?[...input.chords]:[0,5,3,4];
    out.pattern=pattern(out.groove);
    if(input.pattern!==undefined){if(!input.pattern||typeof input.pattern!=='object'||lanes.some(l=>!Array.isArray(input.pattern[l])||input.pattern[l].length!==16||input.pattern[l].some(v=>typeof v!=='number'||!Number.isFinite(v)||v<0||v>1))){if(strict)throw Error('pattern');}else out.pattern=Object.fromEntries(lanes.map(l=>[l,[...input.pattern[l]]]));}
    return out;
  }
  function project(input){if(!input||input.kind!=='walamort-production'||input.version!==1)throw Error('project');return {kind:'walamort-production',version:1,settings:settings(input.settings,true)};}
  const presets={neutral:{},warm:{low:3,mid:-2,high:-5},punch:{compressor:true,threshold:-30,ratio:6,attack:.025,release:.12},space:{delayMix:.25,feedback:.4,reverbMix:.3,delayTime:.375},telephone:{filters:true,highpass:400,lowpass:2800,mid:3,midFreq:1800},dub:{delaySync:'dotted',delayMix:.4,feedback:.6,reverbMix:.18},lofi:{filters:true,highpass:100,lowpass:5000,saturation:true,drive:6,saturationMix:.3,width:.65}};
  function preset(name){if(!Object.hasOwn(presets,name))throw Error('preset');return settings(presets[name]);}
  function random(seed=12345){let x=seed>>>0;return()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296*2-1;};}
  function harmony(input){const s=settings(input),scale=s.scaleMode==='minor'?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11];return s.chords.map(degree=>[0,2,4].map(n=>60+s.key+scale[(degree+n)%7]+12*Math.floor((degree+n)/7)));}
  function plan(input){const s=settings(input),chords=harmony(s),events=[],rng=random(s.seed);for(let bar=0;bar<4;bar++){const chord=chords[bar];let bass=chord[0]-24;while(bass>43+s.key)bass-=12;for(let b=0;b<4;b++)events.push({track:'bass',note:bass,beat:bar*4+b,duration:.72,velocity:.6});if(['block','pad'].includes(s.backingStyle)){const count=s.backingStyle==='pad'?1:4;for(let b=0;b<count;b++)for(const note of chord)events.push({track:'keys',note,beat:bar*4+b*(4/count),duration:s.backingStyle==='pad'?3.8:.75,velocity:.36});}else for(let step=0;step<8;step++){const index=s.backingStyle==='random'?Math.floor((rng()+1)/2*3)%3:step%3;events.push({track:'keys',note:chord[index],beat:bar*4+step/2,duration:.72,velocity:.45});}}return {duration:16*60/s.tempo,events};}
  function variation(input){const s=settings(input),rng=random(s.seed),next=()=>Math.floor((rng()+1)/2*7)%7;s.chords=[0,next(),next(),[0,4][next()%2]];for(const lane of lanes)for(let step=0;step<16;step++)if((rng()+1)/2<.15)s.pattern[lane][step]=s.pattern[lane][step]?0:.5;s.seed=s.seed%999999+1;return s;}
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
    const harmonics={piano:[1,.35,.15,.05],guitar:[1,.5,.24,.12],flute:[1,.04,.12,.01],violin:[1,.55,.35,.25]}[s.patch];
    for(const event of plan(s).events){const f=freq(event.note);add(tracks[event.track],event.beat*beat,event.duration*beat,(t,p)=>(event.track==='bass'?.22:.13)*(event.track==='bass'?Math.sin(2*Math.PI*f*t)+.25*Math.sin(4*Math.PI*f*t):harmonics.reduce((sum,h,k)=>sum+h*Math.sin(2*Math.PI*f*(k+1)*t),0))*Math.min(1,t/.012)*Math.exp(-p*(s.backingStyle==='pad'?1.2:3)));}
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
  function spatialPoint(az,elevation,distance){const a=az*Math.PI/180,e=elevation*Math.PI/180;return [Math.sin(a)*Math.cos(e)*distance,Math.sin(e)*distance,-Math.cos(a)*Math.cos(e)*distance];}
  function surroundGains(az){const speakers=[[-110,4],[-30,0],[0,2],[30,1],[110,5]],a=((az+180)%360+360)%360-180;for(let i=0;i<speakers.length;i++){const left=speakers[i],right=i===speakers.length-1?[speakers[0][0]+360,speakers[0][1]]:speakers[i+1],angle=a<left[0]?a+360:a;if(angle>=left[0]&&angle<=right[0]){const t=(angle-left[0])/(right[0]-left[0]),g=Array(6).fill(0);g[left[1]]=Math.cos(t*Math.PI/2);g[right[1]]=Math.sin(t*Math.PI/2);return g;}}throw Error('azimuth');}
  const api={ranges,patches,bankIds,flags,lanes,grooves,pattern,delaySeconds,curve,settings,project,preset,random,harmony,plan,variation,synth,impulse,metrics,wav,spatialPoint,surroundGains};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortProduction=api;
})(typeof window==='object'?window:this);
