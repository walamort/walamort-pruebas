'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');process.chdir(path.resolve(__dirname,'..'));const R=require('../lectura-primera-vista/core.js');
assert.deepEqual(R.signature('D'),[1,0,0,1,0,0,0]);assert.deepEqual(R.signature('Eb'),[0,0,-1,0,0,-1,-1]);assert.equal(R.name(30,1,'es'),'Mi♯4');assert.equal(R.midi(28,0),60);assert.equal(R.midi(24,0),53);assert.equal(R.midi(20,-1),46);
let state=123;const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};let generated=0;
for(const clef of Object.keys(R.CLEFS))for(const key of Object.keys(R.KEYS))for(const level of ['easy','medium','advanced'])for(let i=0;i<100;i++){
 const q=R.question(clef,key,level,rnd);assert.equal(q.options.filter(a=>R.correct(q,a)).length,1);assert.equal(new Set(q.options.map(a=>a.position+':'+a.alteration)).size,4);assert.equal(q.midi,R.midi(q.position,q.alteration));if(q.explicit===null)assert.equal(q.alteration,R.signature(key)[q.position%7]);else assert.notEqual(q.explicit,R.signature(key)[q.position%7]);const svg=R.staff(q);assert(svg.startsWith('<svg'));assert(!svg.includes('undefined'));generated++;
}
for(const clef of Object.keys(R.CLEFS)){const count=(R.staff({clef,key:'A'},true).match(/>♯</g)||[]).length;assert.equal(count,3);assert.equal((R.staff({clef,key:'Eb'},true).match(/>♭</g)||[]).length,3)}
assert.deepEqual(R.summarize([{correct:true,timeout:false,ms:1000},{correct:false,timeout:true,ms:5000}]),{score:50,correct:1,timeouts:1,average:1000});
function harness(lang='es',limit='0'){
 const elements={},listeners={},saves=[],intervals=new Map();let now=0,nextId=1;
 function node(tag='div'){const classes=new Set();return {tagName:tag.toUpperCase(),value:'',textContent:'',innerHTML:'',children:[],disabled:false,attributes:{},classList:{add(c){classes.add(c)},contains(c){return classes.has(c)}},setAttribute(k,v){this.attributes[k]=v},replaceChildren(...v){this.children=v},append(...v){this.children.push(...v)}}}
 function el(id){if(!elements[id]){elements[id]=node();elements[id].value=({clef:'treble',key:'G',level:'advanced',limit})[id]||''}return elements[id]}
 const document={hidden:false,documentElement:{lang},getElementById:el,createElement:node,addEventListener(type,fn){listeners[type]=fn}},math=Object.create(Math);math.random=()=>.1;
 const context={document,window:{location:{search:''},addEventListener(){},print(){},WalamortSightReading:R,WalamortSound:{stop(){},play(){return Promise.resolve()}},WalamortProgress:{save(...args){saves.push(args);return true}}},Math:math,performance:{now:()=>now},URLSearchParams,setInterval(fn){const id=nextId++;intervals.set(id,fn);return id},clearInterval(id){intervals.delete(id)},console};
 vm.createContext(context);vm.runInContext(fs.readFileSync('lectura-primera-vista/copy.js','utf8'),context);vm.runInContext(fs.readFileSync('lectura-primera-vista/app.js','utf8'),context);return {el,context,listeners,saves,jump(ms){now+=ms},advance(ms){now+=ms;for(const fn of [...intervals.values()])fn()},intervals};
}
for(const lang of ['es','en']){
 const h=harness(lang);h.el('start').onclick();let previous=null;
 for(let i=0;i<10;i++){const q=R.question('treble','G','advanced',()=>.1,previous);previous=q.position;const label=R.name(q.position,q.alteration,lang),button=h.el('options').children.find(b=>b.textContent===label);assert(button);h.advance(1000);button.onclick();assert.equal(h.el('next').disabled,false);button.onclick();h.el('next').onclick()}
 assert.equal(h.saves.length,1);assert.equal(h.saves[0][0],'Lectura a primera vista');assert.equal(h.saves[0][2],100);assert(h.el('counter').textContent.includes('100%'));assert.equal(h.intervals.size,0);
 const timer=harness(lang,'5');timer.el('start').onclick();timer.advance(4000);timer.context.document.hidden=true;timer.listeners.visibilitychange();assert.equal(timer.intervals.size,0);timer.advance(20000);assert(timer.el('options').children.every(b=>b.disabled));timer.context.document.hidden=false;timer.el('pause').onclick();timer.advance(500);assert.equal(timer.el('next').disabled,true);timer.advance(600);assert.equal(timer.el('next').disabled,false);assert(timer.el('feedback').textContent.includes(lang==='en'?'Time is up':'Se terminó'));assert.equal(timer.saves.length,0);
}
for(const f of ['lectura-primera-vista/index.html','en/lectura-primera-vista/index.html']){const html=fs.readFileSync(f,'utf8');for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^https?:/.test(m[1]))continue;assert(fs.existsSync(path.resolve(path.dirname(f),m[1].split('?')[0])),f+' -> '+m[1])}}
console.log('PASS: '+generated+' note questions across 3 clefs, 7 keys and 3 levels; unique choices, accidentals/MIDI, key signatures, bilingual 10-question scoring and paused timeout accounting.');

const route=require('../mi-ruta/core.js');const reading=route.plan({goal:'admission',minutes:20},[{activity:'Lectura a primera vista',score:30}]).find(x=>x.skill==='reading');assert.equal(reading.average,30);assert.equal(reading.level,'easy');assert.equal(reading.url,'lectura-primera-vista');assert.equal(route.plan({goal:'beginner',minutes:20},[]).find(x=>x.skill==='reading').url,'lectura-musical');console.log('PASS: first-glance reading integrates with skill history and admission route; beginner path retains fundamentals.');

const late=harness('en','5');late.el('start').onclick();late.jump(5100);late.el('options').children[0].onclick();assert(late.el('feedback').textContent.includes('Time is up'));console.log('PASS: late clicks are treated as timeouts even before the next timer tick.');
