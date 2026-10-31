(() => {
  'use strict';
  let context, output, voices=[], timers=[], generation=0, listener=()=>{};
  function stop() {
    generation++;timers.forEach(clearTimeout);timers=[];
    voices.forEach(v=>{try{v.stop()}catch{}});voices=[];listener(false);
  }
  async function play(events, bpm, onStep=()=>{}, onEnd=()=>{}, beats=16, lock=true) {
    stop();const token=generation;listener(true,lock);
    try {
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error('audio');
      if(!context||context.state==='closed') {context=new AC();output=context.createGain();output.gain.value=.45;output.connect(context.destination)}
      if(context.state!=='running')await context.resume();
      if(token!==generation)return;
      if(context.state!=='running')throw Error('audio');
      const beat=60/bpm,start=context.currentTime+.12;
      const bus={destination:output,createOscillator:()=>context.createOscillator(),createGain:()=>context.createGain(),createPeriodicWave:(a,b)=>context.createPeriodicWave(a,b)};
      for(const event of events) voices.push(window.WalamortSound.schedule(bus,event.note,start+event.beat*beat,event.duration*beat,event.instrument));
      for(let i=0;i<beats;i++)timers.push(setTimeout(()=>{if(token===generation)onStep(i)},(start-context.currentTime+i*beat)*1000));
      timers.push(setTimeout(()=>{if(token!==generation)return;stop();onEnd()},(start-context.currentTime+beats*beat+.08)*1000));
    } catch(e) {if(token===generation)stop();throw e}
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});window.addEventListener('pagehide',stop);
  window.WalamortCreativePlayer={play,stop,setStateListener(fn){listener=fn}};
})();
