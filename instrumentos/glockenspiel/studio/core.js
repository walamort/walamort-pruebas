(function(root){'use strict';
const naturals=[0,2,4,5,7,9,11],notes=Array.from({length:25},(_,i)=>72+i),exercises={scale:[72,74,76,77,79,81,83,84],motif:[72,76,79,76,77,74,72],chromatic:[72,73,74,75,76,77,78,79,80,81,82,83,84]};
function name(midi,lang='es'){if(!notes.includes(midi))throw Error('note');const names=lang==='en'?['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']:['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];return names[midi%12]+(Math.floor(midi/12)-1);}
function tempo(value){const n=Number(value);return Number.isFinite(n)&&n>0?Math.max(45,Math.min(160,n)):72;}
function frequency(midi){if(!notes.includes(midi))throw Error('note');return 440*2**((midi-69)/12);}
class Practice{constructor(sequence){if(!Array.isArray(sequence)||!sequence.length||sequence.some(n=>!notes.includes(n)))throw Error('sequence');this.sequence=[...sequence];this.position=0;this.errors=0;}answer(note){if(this.position===this.sequence.length)return {done:true,correct:null};const correct=note===this.sequence[this.position];if(correct)this.position++;else this.errors++;return {correct,done:this.position===this.sequence.length};}}

const scales={C:[0,2,4,5,7,9,11],G:[0,2,4,6,7,9,11],Am:[0,2,4,5,7,9,11],pentatonic:[0,2,4,7,9]};
const defaults={volume:.65,resonance:4,brightness:.7,room:.18,delay:.08,mallet:'bright'};
function validate(value){
 if(!value||(value.instrument&&value.instrument!=='glockenspiel')||value.version!==1||!Array.isArray(value.events)||!value.events.length||value.events.length>64)throw Error('melody');
 const events=value.events.map(e=>{if(!e||!(e.note===null||notes.includes(e.note))||![.5,1,1.5,2,4].includes(e.beats)||!Number.isFinite(e.velocity)||e.velocity<.15||e.velocity>1)throw Error('event');return {note:e.note,beats:e.beats,velocity:e.velocity};});
 if(events.reduce((a,e)=>a+e.beats,0)>64)throw Error('duration');
 if(!Number.isFinite(value.tempo)||value.tempo<45||value.tempo>160)throw Error('tempo');
 const params={...defaults};for(const k of ['volume','brightness','room','delay'])if(value.params&&k in value.params){const v=value.params[k];if(!Number.isFinite(v)||v<0||v>1)throw Error('parameter');params[k]=v;}
 if(value.params&&'resonance' in value.params){const v=value.params.resonance;if(!Number.isFinite(v)||v<.3||v>8)throw Error('resonance');params.resonance=v;}
 if(value.params&&'mallet' in value.params){if(!['bright','soft'].includes(value.params.mallet))throw Error('mallet');params.mallet=value.params.mallet;}
 return {version:1,instrument:'glockenspiel',title:typeof value.title==='string'?value.title.trim().slice(0,80):'Glockenspiel',tempo:value.tempo,params,events};
}
function generate(key='C',length=16,random=Math.random){
 if(!scales[key]||![8,16,32].includes(length))throw Error('generation');
 const pool=notes.filter(n=>n<=84&&scales[key].includes(n%12)),tonic=key==='Am'?81:key==='G'?79:72;let index=pool.indexOf(tonic);
 const events=Array.from({length},(_,i)=>{index=Math.max(0,Math.min(pool.length-1,index+[-2,-1,0,1,2][Math.min(4,Math.floor(random()*5))]));return {note:i===0||i===length-1?tonic:(random()<.12?null:pool[index]),beats:i===length-1?2:(random()<.3?.5:1),velocity:.55+random()*.3};});
 return validate({version:1,title:'Glockenspiel',tempo:88,events,params:defaults});
}
function midi(value){
 const m=validate(value),bytes=[],push=(...x)=>bytes.push(...x),vl=n=>{const a=[n&127];while(n>>=7)a.unshift((n&127)|128);return a;},us=Math.round(60000000/m.tempo);
 push(0,255,81,3,(us>>16)&255,(us>>8)&255,us&255,0,192,9);let pending=0;
 for(const e of m.events){const ticks=Math.round(e.beats*480);if(e.note===null){pending+=ticks;continue;}push(...vl(pending),144,e.note,Math.round(e.velocity*127),...vl(ticks),128,e.note,0);pending=0;}
 push(...vl(pending),255,47,0);const n=bytes.length;return new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,1,224,77,84,114,107,(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255,...bytes]);
}
const api={notes,naturals,exercises,name,frequency,tempo,Practice,scales,defaults,validate,generate,midi};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortGlockenspiel=api;
})(typeof window==='object'?window:globalThis);
