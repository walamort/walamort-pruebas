const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../academy-app/core.js'),N=require('../academy-app/notation.js'),P=require('../academy-app/pitch.js');
assert.equal(C.kinds.length,18);
for(const notation of ['solfege','letters']){assert(!/[0-9]/.test(C.displayNote(67,{notation},'es')));assert(C.displayNote(67,{notation,showOctave:true},'es').endsWith('4'));}
for(let i=0;i<300;i++)for(const level of [1,2,3]){
 const q=C.question('reading',level);assert.equal(new Set(q.options.map(n=>n%12)).size,q.options.length);
 const d=C.question('rhythmDictation',level);for(const pattern of d.options){const durations=pattern.split(',').map(Number);assert.equal(durations.reduce((s,n)=>s+Math.abs(n),0),4);assert(N.onsets(durations).every(n=>n>=0&&n<4));}
 const chord=C.question('chordTheory',level);if(chord.answer==='sus4')assert.equal(chord.spelled[1].diatonic,65);
 const key=C.question('keys',level);assert.equal(key.clef,'treble');
}
assert.deepEqual(N.onsets([1,-1,.5,.5,1]),[0,2,2.5,3]);assert.deepEqual(N.durations([0,.5,2,3]),[.5,1.5,1,1]);
assert(N.rhythm([1,-1,.5,.5,1],'<safe>').includes('&lt;safe&gt;'));
for(const f of [110,220,440,660,880]){const b=Float32Array.from({length:4096},(_,i)=>.3*Math.sin(2*Math.PI*f*i/48000));const r=P.analyze(b,48000);assert(Math.abs(r.frequency-f)<2,`${f}: ${r.frequency}`);}
assert(!P.analyze(new Float32Array(4096),48000).frequency);
// Mic permission denial and a permission result arriving after navigation.
(async()=>{let resolve,stopped=0;const elements={};const element=id=>elements[id]??(elements[id]={disabled:false,value:id==='voiceTolerance'?20:440,textContent:''});const host={set innerHTML(v){this.html=v;},querySelector:s=>element(s.slice(1))};const context={navigator:{mediaDevices:{getUserMedia:()=>new Promise(r=>resolve=r)}},WalamortPitch:P,setTimeout,clearTimeout,setInterval,clearInterval,performance,console};context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../academy-app/voice.js'),'utf8'),context);const api={T:(a)=>a,H:s=>s,settings:()=>({}),note:n=>String(n),exit(){},silence(){},pitchSettings(){}};
context.AcademyVoice.show(host,api);const pending=element('voiceStart').onclick();context.AcademyVoice.stop();resolve({getTracks:()=>[{stop(){stopped++;}}]});await pending;assert.equal(stopped,1);
context.navigator.mediaDevices.getUserMedia=async()=>{throw Error('denied')};context.AcademyVoice.show(host,api);await element('voiceStart').onclick();assert.equal(element('voiceStart').disabled,false);assert(element('voiceState').textContent.includes('permiso'));context.AcademyVoice.stop();
console.log('PASS: note naming, unambiguous choices, harmonic spelling, rhythm notation, synthetic pitch, microphone denial and late permission cleanup.');})().catch(e=>{console.error(e);process.exitCode=1});
