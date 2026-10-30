(()=>{"use strict";
const presets={piano:{harmonics:[1,.45,.22,.1,.05],attack:.008,decay:true},guitar:{harmonics:[1,.65,.3,.16,.12,.06],attack:.005,decay:true},flute:{harmonics:[1,.07,.025],attack:.04},violin:{harmonics:[1,.65,.45,.3,.2,.14,.1],attack:.06}};
let context,epoch=0,active=[];const select=document.getElementById("instrument");
try{const saved=localStorage.getItem("walamort-instrument-v1");if(select&&presets[saved])select.value=saved}catch{}
function instrument(){return select&&presets[select.value]?select.value:"piano"}
function schedule(ctx,midi,time,duration,instr=instrument()){
 const preset=presets[instr]||presets.piano,o=ctx.createOscillator(),gain=ctx.createGain(),imag=new Float32Array(preset.harmonics.length+1);preset.harmonics.forEach((v,i)=>imag[i+1]=v);o.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(imag.length),imag));o.frequency.value=440*2**((midi-69)/12);const d=Math.max(.08,duration),attack=Math.min(preset.attack,d/4);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.2,time+attack);if(preset.decay){gain.gain.exponentialRampToValueAtTime(.05,time+d*.65)}else gain.gain.setValueAtTime(.16,time+d*.7);gain.gain.linearRampToValueAtTime(0,time+d);o.connect(gain);gain.connect(ctx.destination);o.onended=()=>{o.disconnect();gain.disconnect();active=active.filter(v=>v!==o)};o.start(time);o.stop(time+d+.02);return o;
}
function stop(){epoch++;active.forEach(o=>{try{o.stop()}catch{}});active=[]}
async function play(midi){const token=epoch,C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error("This browser does not support audio.");if(!context||context.state==="closed")context=new C();if(context.state!=="running")await context.resume();if(token!==epoch)return;if(context.state!=="running")throw Error("Press again to enable audio.");active.push(schedule(context,midi,context.currentTime+.02,.85))}
if(select)select.addEventListener("change",()=>{stop();try{localStorage.setItem("walamort-instrument-v1",instrument())}catch{}});
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});window.addEventListener("pagehide",stop);window.WalamortSound={schedule,play,stop,instrument};
})();