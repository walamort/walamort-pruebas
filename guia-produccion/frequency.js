(function(root){'use strict';
 const min=40,max=10000;
 function frequency(value){const n=Number(value);if(!Number.isFinite(n)||n<min||n>max)throw Error('frequency');return n;}
 function fromPosition(value){const n=Number(value);if(!Number.isFinite(n)||n<0||n>100)throw Error('position');return Math.round(min*(max/min)**(n/100));}
 function position(value){return 100*Math.log(frequency(value)/min)/Math.log(max/min);}
 class Tone{constructor(Context){this.Context=Context;this.context=null;this.active=null;this.generation=0;}
 stop(){this.generation++;const v=this.active;this.active=null;if(v){try{v.osc.stop();}catch{}v.osc.disconnect();v.gain.disconnect();}}
 async play(value){const hz=frequency(value);this.stop();const token=this.generation;if(!this.Context)throw Error('unsupported');if(!this.context||this.context.state==='closed')this.context=new this.Context();const ctx=this.context;await ctx.resume();if(token!==this.generation)return false;if(ctx.state!=='running')throw Error('audio');const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.025,now+.03);gain.gain.setValueAtTime(.025,now+.55);gain.gain.linearRampToValueAtTime(0,now+.7);osc.connect(gain);gain.connect(ctx.destination);const active={osc,gain};this.active=active;osc.onended=()=>{osc.disconnect();gain.disconnect();if(this.active===active)this.active=null;};osc.start(now);osc.stop(now+.72);return true;}}
 const api={min,max,frequency,fromPosition,position,Tone};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortFrequency=api;
})(typeof window==='object'?window:globalThis);
