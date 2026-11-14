(function(root){'use strict';
const kinds=['reading','interval','chord','scale','dictation','rhythm'];
const names=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
const letters=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const intervals=[2,4,5,7,9,12];const chords={major:[0,4,7],minor:[0,3,7],sus4:[0,5,7],dim:[0,3,6],aug:[0,4,8],dom7:[0,4,7,10],maj7:[0,4,7,11],min7:[0,3,7,10]};
const scales={major:[0,2,4,5,7,9,11,12],minor:[0,2,3,5,7,8,10,12],pentMajor:[0,2,4,7,9,12],pentMinor:[0,3,5,7,10,12],dorian:[0,2,3,5,7,9,10,12],mixolydian:[0,2,4,5,7,9,10,12]};
const natural=n=>[0,2,4,5,7,9,11].includes(n%12);const note=(n,lang='es')=>(lang==='en'?letters:lang==='pt'?['Dó','Dó♯','Ré','Ré♯','Mi','Fá','Fá♯','Sol','Sol♯','Lá','Lá♯','Si']:names)[n%12]+(Math.floor(n/12)-1);
function shuffle(a,r=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(a,r){return a[Math.floor(r()*a.length)];}
function question(kind,level=1,r=Math.random){if(!kinds.includes(kind)||![1,2,3].includes(level))throw Error('Invalid exercise');
 const q={kind,level};
 if(kind==='reading'){
  q.clef=level===1?'treble':pick(level===2?['treble','bass']:['treble','bass','alto'],r);
  const roots={treble:64,bass:43,alto:53};q.bottom=roots[q.clef];const inner=Array.from({length:16},(_,i)=>q.bottom+i).filter(natural).slice(0,9);const pool=level===1?inner:Array.from({length:25},(_,i)=>q.bottom-5+i).filter(natural);
  q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);q.notes=[q.answer];
 }else if(kind==='interval'){
  const pool=level===1?[2,4,7,12]:level===2?intervals:[1,2,3,4,5,6,7,8,9,10,11,12];q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);const n=level===1?60:60+Math.floor(r()*8);q.notes=[n,n+q.answer];
 }else if(kind==='chord'||kind==='scale'){
  const map=kind==='chord'?chords:scales;const pool=kind==='chord'?Object.keys(map).slice(0,level===1?2:level===2?4:8):Object.keys(map).slice(0,level===1?2:level===2?4:6);q.answer=pick(pool,r);q.options=shuffle([q.answer,...shuffle(pool.filter(n=>n!==q.answer),r).slice(0,3)],r);const n=level===1?60:60+Math.floor(r()*12);q.notes=map[q.answer].map(x=>n+x);
 }else if(kind==='dictation'){
  const pool=level===1?[60,62,64,65,67]:[60,62,64,65,67,69,71,72];q.notes=Array.from({length:level+2},()=>pick(pool,r));q.answer=q.notes.slice();q.keyboard=pool;
 }else{
  q.bpm=level===1?72:level===2?88:104;const patterns=level===1?[[0,1,2,3],[0,1,2.5,3]]:level===2?[[0,.5,1.5,2,3],[0,1,1.5,2.5,3.5]]:[[0,.5,1,1.5,2.5,3,3.5],[0,.5,1.5,2,2.5,3.5]];q.answer=pick(patterns,r).slice();q.notes=[];
 }return q;
}
function staffStep(n,bottom){const index=n=>Math.floor(n/12)*7+[0,0,1,1,2,3,3,4,4,5,5,6][n%12];return index(n)-index(bottom);}
function evaluateRhythm(expected,taps,bpm){if(!Array.isArray(taps)||taps.some(x=>!Number.isFinite(x))||!Number.isFinite(bpm)||bpm<=0)throw Error('Invalid timing');const beat=60/bpm;let used=new Set(),errors=[];for(const e of expected){let best=-1,d=.26*beat;for(let i=0;i<taps.length;i++){const x=Math.abs(taps[i]-e*beat);if(!used.has(i)&&x<d){d=x;best=i;}}if(best>=0){used.add(best);errors.push(d);}}
 const accuracy=errors.reduce((a,e)=>a+Math.max(0,1-e/(.26*beat)),0);return {score:Math.round(100*accuracy/Math.max(expected.length,taps.length,1)),matched:used.size,expected:expected.length,taps:taps.length,meanMs:errors.length?Math.round(errors.reduce((a,b)=>a+b,0)/errors.length*1000):null};}
function validSession(s){return s&&typeof s.id==='string'&&/^[a-zA-Z0-9_.:-]{1,100}$/.test(s.id)&&kinds.includes(s.kind)&&[1,2,3].includes(s.level)&&Number.isInteger(s.score)&&s.score>=0&&s.score<=100&&Number.isInteger(s.total)&&s.total>=1&&s.total<=20&&Number.isFinite(Date.parse(s.date))&&/^\d{4}-\d\d-\d\dT/.test(s.date)&&s.date.length<35;}
function validateBackup(x,lessonIds){if(!x||x.version!==1||!Array.isArray(x.sessions)||x.sessions.length>300||!x.sessions.every(validSession)||!Array.isArray(x.lessons)||x.lessons.length>lessonIds.length||!x.lessons.every(v=>lessonIds.includes(v)))throw Error('Invalid backup');const s=x.settings;if(!s||!['es','en','pt'].includes(s.lang)||![1,2,3].includes(s.level)||!['beginner','university','creative'].includes(s.goal)||![5,10,15].includes(s.minutes)||![5,10].includes(s.questions)||!Number.isFinite(s.volume)||s.volume<0||s.volume>1)throw Error('Invalid settings');return {version:1,sessions:x.sessions.map(v=>({id:v.id,kind:v.kind,level:v.level,score:v.score,total:v.total,date:v.date})),lessons:[...new Set(x.lessons)],settings:{lang:s.lang,level:s.level,goal:s.goal,minutes:s.minutes,questions:s.questions,volume:s.volume}};}
function mergeBackup(a,b){return {...a,sessions:[...new Map([...a.sessions,...b.sessions].map(s=>[s.id,s])).values()].sort((x,y)=>Date.parse(x.date)-Date.parse(y.date)).slice(-300),lessons:[...new Set([...a.lessons,...b.lessons])]};}
function routine(data){const seq=data.settings.goal==='creative'?['chord','scale','dictation']:data.settings.goal==='university'?['reading','interval','rhythm']:['reading','interval','rhythm'];const avg=k=>{const s=data.sessions.filter(x=>x.kind===k).slice(-5);return s.length?s.reduce((a,b)=>a+b.score,0)/s.length:-1};return seq.slice().sort((a,b)=>avg(a)-avg(b));}
const api={kinds,note,question,shuffle,staffStep,evaluateRhythm,validSession,validateBackup,mergeBackup,routine,chords,scales};if(typeof module==='object'&&module.exports)module.exports=api;root.AcademyCore=api;
})(typeof window==='object'?window:globalThis);
