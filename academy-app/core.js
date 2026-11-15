(function(root){'use strict';
const kinds=['reading','interval','chord','scale','dictation','rhythm','intervalTheory','chordTheory','rhythmTheory','rhythmDictation','keys','progression','direction','scaleDegree','inversion','meterTheory','pitchMemory','chordColor'];
const names=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
const letters=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const intervals=[2,4,5,7,9,12];const chords={major:[0,4,7],minor:[0,3,7],sus4:[0,5,7],dim:[0,3,6],aug:[0,4,8],dom7:[0,4,7,10],maj7:[0,4,7,11],min7:[0,3,7,10]};
const scales={major:[0,2,4,5,7,9,11,12],minor:[0,2,3,5,7,8,10,12],pentMajor:[0,2,4,7,9,12],pentMinor:[0,3,5,7,10,12],dorian:[0,2,3,5,7,9,10,12],mixolydian:[0,2,4,5,7,9,10,12]};
const dictionary=root.AcademyDictionary||(typeof module==='object'&&module.exports?require('./dictionary.js'):null);for(const entry of dictionary?.scales||[])scales[entry.id]=[...entry.intervals,12];
const natural=n=>[0,2,4,5,7,9,11].includes(n%12);const note=(n,lang='es')=>(lang==='en'?letters:lang==='pt'?['Dó','Dó♯','Ré','Ré♯','Mi','Fá','Fá♯','Sol','Sol♯','Lá','Lá♯','Si']:names)[n%12]+(Math.floor(n/12)-1);
function shuffle(a,r=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(a,r){return a[Math.floor(r()*a.length)];}
const rhythmLibrary=root.AcademyRhythm||(typeof module==='object'&&module.exports?require('./rhythm-core.js'):null);
function question(kind,level=1,r=Math.random){if(!kinds.includes(kind)||![1,2,3].includes(level))throw Error('Invalid exercise');
 const q={kind,level};
 if(kind==='reading'){
  q.clef=level===1?'treble':pick(level===2?['treble','bass']:['treble','bass','alto'],r);
  const roots={treble:64,bass:43,alto:53};q.bottom=roots[q.clef];const inner=Array.from({length:16},(_,i)=>q.bottom+i).filter(natural).slice(0,9);const pool=level===1?inner:Array.from({length:25},(_,i)=>q.bottom-5+i).filter(natural);
  q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle([...new Map(pool.filter(n=>n%12!==q.answer%12).map(n=>[n%12,n])).values()],r).slice(0,3)],r);q.notes=[q.answer];
 }else if(kind==='interval'){
  const pool=level===1?[2,4,7,12]:level===2?intervals:[1,2,3,4,5,6,7,8,9,10,11,12];q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);const n=level===1?60:60+Math.floor(r()*8);q.notes=[n,n+q.answer];
 }else if(kind==='chord'||kind==='scale'){
  const map=kind==='chord'?chords:scales;const pool=kind==='chord'?Object.keys(map).slice(0,level===1?2:level===2?4:8):Object.keys(map).slice(0,level===1?2:level===2?4:Object.keys(map).length);q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);const n=level===1?60:60+Math.floor(r()*12);q.root=n;q.notes=map[q.answer].map(x=>n+x);
 }else if(kind==='dictation'){
  const pool=level===1?[60,62,64,65,67]:[60,62,64,65,67,69,71];q.notes=Array.from({length:level+2},()=>pick(pool,r));q.answer=q.notes.slice();q.keyboard=pool;
 }else if(kind==='rhythm'){
  q.bpm=level===1?72:level===2?88:104;const generated=rhythmLibrary.generate('4/4',level,q.bpm,1,r);q.durations=generated.bars[0];q.answer=rhythmLibrary.events(generated).attacks;q.notes=[];
 }else if(kind==='intervalTheory'){
 const pool=level===1?[2,4,5,7]:[2,3,4,5,7,9,12];q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);q.notes=[60,60+q.answer];q.bottom=64;q.clef='treble';q.spelled=[{midi:60,diatonic:60,accidental:''},{midi:q.notes[1],diatonic:({2:62,3:64,4:64,5:65,7:67,9:69,12:72})[q.answer],accidental:q.answer===3?'♭':''}];
 }else if(kind==='chordTheory'){
 const pool=Object.keys(chords).slice(0,level===1?2:level===2?4:8);q.answer=pick(pool,r);q.options=shuffle(pool,r);q.root=60;q.notes=chords[q.answer].map(n=>60+n);q.bottom=64;q.clef='treble';const positions=[60,q.answer==='sus4'?65:64,67,71];q.spelled=q.notes.map((n,i)=>({midi:n,diatonic:positions[i],accidental:n===positions[i]?'':n<positions[i]?'♭':'♯'}));
 }else if(kind==='rhythmTheory'){
 const pool=level===1?[.5,1,2,4]:[.25,.5,.75,1,1.5,2,3,4];q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);q.figure=q.answer;q.rest=level>1&&r()<.35;q.notes=[];
 }else if(kind==='rhythmDictation'){
 let seed=Math.floor(r()*4294967295)>>>0;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;},pool=[];for(let i=0;i<32&&pool.length<4;i++){const v=rhythmLibrary.generate('4/4',level,80,1,random).bars[0].join(',');if(!pool.includes(v))pool.push(v);}for(const v of ['1,1,1,1','2,1,1','1,1,2','0.5,0.5,1,2'])if(pool.length<4&&!pool.includes(v))pool.push(v);q.answer=pick(pool,r);q.options=shuffle(pool,r);q.durations=q.answer.split(',').map(Number);q.bpm=72+level*8;q.notes=[];
 }else if(kind==='keys'){
 const pool=level===1?['C','G','F']:level===2?['C','G','D','F','Bb']:['C','G','D','A','E','F','Bb','Eb'];q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(k=>k!==q.answer),r).slice(0,3)],r);q.clef='treble';q.bottom=64;q.signature={C:0,G:1,D:2,A:3,E:4,F:-1,Bb:-2,Eb:-3}[q.answer];q.notes=[];
 }else if(kind==='progression'){
 const pool=level===1?['I–IV–V–I','I–V–IV–I']:['I–IV–V–I','I–V–vi–IV','ii–V–I','vi–IV–I–V'];q.answer=pick(pool,r);q.options=shuffle(pool,r);const map={'I':[60,64,67],'ii':[62,65,69],'IV':[65,69,72],'V':[67,71,74],'vi':[57,60,64]};q.progression=q.answer.split('–').map(x=>map[x]);q.notes=q.progression.flat();
 }else if(kind==='pitchMemory'){
 const pcs=level===1?[0,2,4,7]:level===2?[0,2,4,5,7,9,11]:[0,1,2,3,4,5,6,7,8,9,10,11],pc=pick(pcs,r);q.answer=60+pc;q.options=shuffle([q.answer,...shuffle(pcs.filter(x=>x!==pc),r).slice(0,3).map(x=>60+x)],r);q.notes=[(level===3?pick([48,60,72],r):60)+pc];
 }else if(kind==='chordColor'){
 const lib=root.AcademyChords||(typeof module==='object'&&module.exports?require('./chords.js'):null),pool=lib.types.filter(t=>level===1?['major','minor','sus2','sus4'].includes(t.id):level===2?['triad','sus','seventh','added'].includes(t.family):true);q.answer=pick(pool,r).id;q.options=shuffle([q.answer,...shuffle(pool.filter(t=>t.id!==q.answer),r).slice(0,3).map(t=>t.id)],r);q.root=level===1?60:60+Math.floor(r()*12);q.notes=lib.types.find(t=>t.id===q.answer).intervals.map(n=>q.root+n);
 }else if(kind==='direction'){
 const distance=pick(level===1?[0,7,12]:level===2?[0,2,3,4,5,7,12]:[0,1,2,3,4,5,6,7,8,9,10,11,12],r),sign=distance===0?0:pick([-1,1],r),n=60+Math.floor(r()*6);q.answer=sign===0?'same':sign>0?'up':'down';q.options=shuffle(['up','down','same'],r);q.notes=[n,n+sign*distance];
 }else if(kind==='scaleDegree'){
 const roots=dictionary.roots,root=level===1?roots[0]:pick(roots,r),scale=pick(level===1?['major']:level===2?['major','minor']:dictionary.scales.map(x=>x.id),r),c=dictionary.collection(root.id,scale),i=Math.floor(r()*c.notes.length);q.rootId=root.id;q.scaleId=scale;q.degree=c.notes[i].degree;q.answer=c.notes[i].midi;q.options=shuffle([q.answer,...shuffle(c.notes.map(n=>n.midi).filter(n=>n!==q.answer),r).slice(0,3)],r);q.notes=[...c.notes.map(n=>n.midi),c.notes[0].midi+12];
 }else if(kind==='inversion'){
 q.quality=level===1?'major':pick(level===2?['major','minor']:['dom7','maj7','min7'],r);q.root=level===1?60:pick([60,62,65],r);const source=chords[q.quality];q.answer=Math.floor(r()*source.length);q.options=shuffle(source.map((_,i)=>i),r);q.notes=source.map((n,i)=>q.root+n+(i<q.answer?12:0)).sort((a,b)=>a-b);
 }else if(kind==='meterTheory'){
 q.meter=pick(level===1?['2/4','3/4','4/4']:level===2?['6/8','9/8','12/8']:['2/4','3/4','4/4','6/8','9/8','12/8'],r);const m=rhythmLibrary.meters[q.meter];q.answer=m.groups.length;q.options=shuffle([2,3,4,6],r);q.durations=Array(m.n).fill(4/m.d);q.notes=[];
 }return q;
}
function staffStep(n,bottom){const index=n=>Math.floor(n/12)*7+[0,0,1,1,2,3,3,4,4,5,5,6][n%12];return index(n)-index(bottom);}
function evaluateRhythm(expected,taps,bpm){const result=rhythmLibrary.evaluate(expected,taps,bpm,0,Math.max(20,Math.min(200,60000/bpm*.26)));return {score:result.score,matched:result.matched,expected:expected.length,taps:taps.length,meanMs:result.meanAbsMs};}
function validSession(s){return s&&typeof s.id==='string'&&/^[a-zA-Z0-9_.:-]{1,100}$/.test(s.id)&&[...kinds,'intonation','rhythmLab'].includes(s.kind)&&[1,2,3].includes(s.level)&&Number.isInteger(s.score)&&s.score>=0&&s.score<=100&&Number.isInteger(s.total)&&s.total>=1&&s.total<=20&&Number.isFinite(Date.parse(s.date))&&/^\d{4}-\d\d-\d\dT/.test(s.date)&&s.date.length<35;}
function validateBackup(x,lessonIds){if(!x||x.version!==1||!Array.isArray(x.sessions)||x.sessions.length>300||!x.sessions.every(validSession)||!Array.isArray(x.lessons)||x.lessons.length>lessonIds.length||!x.lessons.every(v=>lessonIds.includes(v)))throw Error('Invalid backup');const s=x.settings;if(!s||!['es','en','pt'].includes(s.lang)||![1,2,3].includes(s.level)||!['beginner','university','creative'].includes(s.goal)||![5,10,15].includes(s.minutes)||![5,10].includes(s.questions)||!Number.isFinite(s.volume)||s.volume<0||s.volume>1)throw Error('Invalid settings');const patterns=x.patterns===undefined?[]:x.patterns;if(!Array.isArray(patterns)||patterns.length>12)throw Error('Invalid patterns');const checkedPatterns=patterns.map(v=>rhythmLibrary.project(v));return {version:1,patterns:checkedPatterns,sessions:x.sessions.map(v=>({id:v.id,kind:v.kind,level:v.level,score:v.score,total:v.total,date:v.date})),lessons:[...new Set(x.lessons)],settings:{lang:s.lang,level:s.level,goal:s.goal,minutes:s.minutes,questions:s.questions,volume:s.volume,instrument:['piano','guitar','flute','violin'].includes(s.instrument)?s.instrument:'piano',notation:['solfege','letters'].includes(s.notation)?s.notation:'solfege',chordNotation:['names','symbols'].includes(s.chordNotation)?s.chordNotation:'names',showOctave:s.showOctave===true,autoAdvance:s.autoAdvance!==false,a4:Number.isFinite(s.a4)&&s.a4>=430&&s.a4<=450?s.a4:440,tolerance:[10,20,30].includes(s.tolerance)?s.tolerance:20}};}
function mergeBackup(a,b){return {...a,patterns:[...new Map([...(a.patterns||[]),...(b.patterns||[])].map(p=>[p.id,p])).values()].slice(-12),sessions:[...new Map([...a.sessions,...b.sessions].map(s=>[s.id,s])).values()].sort((x,y)=>Date.parse(x.date)-Date.parse(y.date)).slice(-300),lessons:[...new Set([...a.lessons,...b.lessons])]};}
function routine(data){const seq=data.settings.goal==='creative'?['chord','chordTheory','progression','scale','dictation']:data.settings.goal==='university'?['reading','intervalTheory','chordTheory','rhythmTheory','rhythmDictation','keys','interval','dictation','rhythm']:['reading','interval','rhythm'];const avg=k=>{const s=data.sessions.filter(x=>x.kind===k).slice(-5);return s.length?s.reduce((a,b)=>a+b.score,0)/s.length:-1};return seq.slice().sort((a,b)=>avg(a)-avg(b)).slice(0,3);}
const displayNote=(n,settings={},lang='es')=>{const text=note(n,settings.notation==='letters'?'en':lang==='pt'?'pt':'es');return settings.showOctave?text:text.replace(/-?\d+$/,'');};
const api={displayNote,kinds,note,question,shuffle,staffStep,evaluateRhythm,validSession,validateBackup,mergeBackup,routine,chords,scales};if(typeof module==='object'&&module.exports)module.exports=api;root.AcademyCore=api;
})(typeof window==='object'?window:globalThis);
