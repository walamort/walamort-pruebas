(function(root){'use strict';class Voice{
 constructor(){this.context=null;this.master=null;this.voices=new Map();this.volume=.2;}
 async enable(){const AC=root.AudioContext||root.webkitAudioContext;if(!AC)throw Error('audio');if(!this.context||this.context.state==='closed'){this.context=new AC();this.master=this.context.createGain();this.master.gain.value=this.volume;this.master.connect(this.context.destination);}await this.context.resume();if(this.context.state!=='running')throw Error('audio');}
 level(value){this.volume=Math.max(0,Math.min(.4,Number(value)||0));if(this.master)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.015);}
 on(key,note,velocity,instrument){if(!this.context||this.context.state!=='running')return;this.off(key);if(this.voices.size>=16)this.off(this.voices.keys().next().value);const ctx=this.context,o=ctx.createOscillator(),g=ctx.createGain(),harmonics={piano:[1,.45,.22,.1],guitar:[1,.65,.3,.16],flute:[1,.07,.025],violin:[1,.65,.45,.3,.2]}[instrument]||[1];const imag=new Float32Array(harmonics.length+1);harmonics.forEach((v,i)=>imag[i+1]=v);o.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(imag.length),imag));o.frequency.value=440*2**((note-69)/12);const now=ctx.currentTime;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(Math.max(.01,Math.min(1,velocity/127))*.12,now+.012);g.gain.setTargetAtTime(.08*(velocity/127),now+.04,.4);g.gain.setTargetAtTime(0,now+7.8,.03);o.connect(g);g.connect(this.master);const voice={o,g};this.voices.set(key,voice);o.onended=()=>{o.disconnect();g.disconnect();if(this.voices.get(key)===voice)this.voices.delete(key);};o.start(now);o.stop(now+8);}
 off(key){const v=this.voices.get(key);if(!v)return;this.voices.delete(key);const now=this.context.currentTime;v.g.gain.cancelScheduledValues(now);v.g.gain.setTargetAtTime(0,now,.02);try{v.o.stop(now+.12);}catch{}}
 stop(){for(const key of Array.from(this.voices.keys()))this.off(key);}
 }
 root.WalamortMIDIVoice=Voice;
})(typeof window==='object'?window:globalThis);

