(function(root){
  'use strict';
  const core=root.WalamortProduction;
  function buffer(context,channels,sampleRate){const out=context.createBuffer(channels.length,channels[0].length,sampleRate);channels.forEach((data,i)=>out.copyToChannel(data,i));return out;}
  function graph(context,input,bypass=false){
    const s=core.settings(input),nodes=[],make=method=>{const node=context[method]();nodes.push(node);return node;};
    const sum=make('createGain'),dry=make('createGain'),wet=make('createGain'),low=make('createBiquadFilter'),mid=make('createBiquadFilter'),high=make('createBiquadFilter'),compressor=make('createDynamicsCompressor');
    const hp=make('createBiquadFilter'),lp=make('createBiquadFilter'),filterDry=make('createGain'),filterWet=make('createGain'),sat=make('createWaveShaper'),satDry=make('createGain'),satWet=make('createGain');hp.type='highpass';lp.type='lowpass';hp.Q.value=.707;lp.Q.value=.707;sat.oversample='4x';
    low.type='lowshelf';low.frequency.value=200;mid.type='peaking';mid.frequency.value=1000;mid.Q.value=1;high.type='highshelf';high.frequency.value=4000;
    const spatial=make('createGain'),direct=make('createGain'),delay=context.createDelay(2),feedback=make('createGain'),delayGain=make('createGain'),convolver=make('createConvolver'),reverbGain=make('createGain'),pan=make('createStereoPanner'),master=make('createGain'),guard=make('createDynamicsCompressor'),analyser=make('createAnalyser');nodes.push(delay);
    const field=make('createGain'),split=context.createChannelSplitter(2),merge=context.createChannelMerger(2),ll=make('createGain'),lr=make('createGain'),rl=make('createGain'),rr=make('createGain');nodes.push(split,merge);field.channelCount=2;field.channelCountMode='explicit';field.channelInterpretation='speakers';field.connect(split);split.connect(ll,0);split.connect(lr,0);split.connect(rl,1);split.connect(rr,1);ll.connect(merge,0,0);rl.connect(merge,0,0);lr.connect(merge,0,1);rr.connect(merge,0,1);merge.connect(pan);
    convolver.buffer=buffer(context,core.impulse(context.sampleRate),context.sampleRate);compressor.knee.value=12;guard.threshold.value=-3;guard.knee.value=0;guard.ratio.value=20;guard.attack.value=.003;guard.release.value=.1;analyser.fftSize=1024;
    sum.connect(dry);dry.connect(field);sum.connect(filterDry);filterDry.connect(low);sum.connect(hp);hp.connect(lp);lp.connect(filterWet);filterWet.connect(low);low.connect(mid);mid.connect(high);high.connect(satDry);satDry.connect(compressor);high.connect(sat);sat.connect(satWet);satWet.connect(compressor);compressor.connect(direct);direct.connect(spatial);
    compressor.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(delayGain);delayGain.connect(spatial);compressor.connect(convolver);convolver.connect(reverbGain);reverbGain.connect(spatial);spatial.connect(wet);wet.connect(field);pan.connect(master);master.connect(guard);guard.connect(analyser);analyser.connect(context.destination);
    let initial=true,lastDrive=-1;
    function param(p,v){if(initial)p.value=v;else if(p.setTargetAtTime)p.setTargetAtTime(v,context.currentTime,.015);else p.value=v;}
    function update(value,isBypass=false){const v=core.settings(value);param(dry.gain,isBypass?1:0);param(wet.gain,isBypass?0:1);param(filterDry.gain,v.filters?0:1);param(filterWet.gain,v.filters?1:0);param(hp.frequency,v.highpass);param(lp.frequency,Math.min(v.lowpass,context.sampleRate*.49));param(mid.frequency,v.midFreq);param(mid.Q,v.midQ);if(lastDrive!==v.drive){sat.curve=core.curve(v.drive);lastDrive=v.drive;}param(satDry.gain,v.saturation?1-v.saturationMix:1);param(satWet.gain,v.saturation?v.saturationMix:0);param(ll.gain,(1+v.width)/2);param(rr.gain,(1+v.width)/2);param(lr.gain,(1-v.width)/2);param(rl.gain,(1-v.width)/2);param(low.gain,v.eq?v.low:0);param(mid.gain,v.eq?v.mid:0);param(high.gain,v.eq?v.high:0);param(compressor.threshold,v.compressor?v.threshold:0);param(compressor.ratio,v.compressor?v.ratio:1);param(compressor.attack,v.attack);param(compressor.release,v.release);param(delay.delayTime,core.delaySeconds(v));param(feedback.gain,v.feedback);param(delayGain.gain,v.delay?v.delayMix:0);param(reverbGain.gain,v.reverb?v.reverbMix:0);param(pan.pan,v.pan);param(master.gain,v.volume);}
    update(s,bypass);initial=false;
    return{input:sum,analyser,compressor,update,dispose(){nodes.forEach(node=>{try{node.disconnect();}catch{}});}};
  }
  function sources(context,graph,data,input,loop=false){
    const s=core.settings(input),sources=[],gains={},pans={};let duration;
    const entries=data.imported?[['file',data.imported]]:Object.entries(data.tracks).map(([name,samples])=>[name,buffer(context,[samples],data.sampleRate)]);
    const level=(name,v)=>name==='file'?1:v[name+'Mute']||(v.solo!=='none'&&v.solo!==name)?0:v[name];
    for(const [name,audio] of entries){const source=context.createBufferSource(),gain=context.createGain(),pan=context.createStereoPanner();source.buffer=audio;source.loop=loop;gain.gain.value=level(name,s);pan.pan.value=name==='file'?0:s[name+'Pan'];source.connect(gain);gain.connect(pan);pan.connect(graph.input);sources.push(source);gains[name]=gain;pans[name]=pan;duration=audio.duration;}
    return{duration,start(when){sources.forEach(source=>source.start(when));},update(v){for(const [name,gain] of Object.entries(gains)){gain.gain.setTargetAtTime(level(name,v),context.currentTime,.015);pans[name].pan.setTargetAtTime(name==='file'?0:v[name+'Pan'],context.currentTime,.015);}},stop(){sources.forEach(source=>{try{source.stop();}catch{}try{source.disconnect();}catch{}});Object.values(gains).forEach(gain=>gain.disconnect());Object.values(pans).forEach(pan=>pan.disconnect());}};
  }
  root.WalamortProductionAudio={graph,sources,buffer};
})(window);

