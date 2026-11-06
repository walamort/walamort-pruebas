const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),N=require('../notacion/core.js');
function harness(lang='pt-BR',reading=false,query='?seed=123&key=G&level=advanced'){
 const elements={},calls=[],data={};let serial=0,end=()=>{},listen=()=>{};
 function make(tag='div'){return {tagName:tag.toUpperCase(),textContent:'',innerHTML:'',children:[],attributes:{},style:{},classList:{add(){}},disabled:false,value:'',setAttribute(k,v){this.attributes[k]=v},getAttribute(k){return this.attributes[k]},replaceChildren(...nodes){this.children=nodes},append(...nodes){this.children.push(...nodes)},addEventListener(k,fn){this[k]=fn},focus(){this.focused=true},select(){this.selected=true}}}
 function el(id){if(!elements[id]){elements[id]=make();elements[id].value=({key:'C',level:'easy',pitch:'60',duration:'1',tempo:'80',instrument:'guitar',clef:'treble',handClef:'treble'})[id]||''}return elements[id]}
 const anchors=['https://example.test/dictado-pentagrama/','https://example.test/en/dictado-pentagrama/','https://example.test/pt/dictado-pentagrama/'].map(href=>({href}));
 const window={location:{href:'https://example.test/pt/'+(reading?'lectura-musical/':'dictado-pentagrama/')+query,search:query},addEventListener(){},WalamortNotation:N,WalamortSound:{stop(){},play:async note=>{calls.push({note})}},WalamortCreativePlayer:{setStateListener(fn){listen=fn},stop(){listen(false)},async play(items,bpm,a,done,beats){calls.push({items,bpm,beats});listen(true);end=()=>{listen(false);done()}}}};
 const math=Object.create(Math);math.random=()=>0;
 const context={window,Math:math,document:{documentElement:{lang},getElementById:el,createElement:tag=>make(tag),addEventListener(){},querySelectorAll:()=>anchors},localStorage:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=v},navigator:{clipboard:{writeText:async text=>calls.push({copied:text})}},URL,URLSearchParams,console,setTimeout,clearTimeout};
 vm.createContext(context);for(const f of ['practica-audio/progress.js','notacion/copy.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context);
 return {context,el,calls,data,anchors,finish(){end()}};
}
(async()=>{
 for(const key of Object.keys(N.keys))for(const level of ['easy','medium','advanced'])for(let seed=0;seed<200;seed++){
  const e=N.generate(seed,key,level,'6/8');assert.equal(N.total(e),6);assert(N.validate(e,'6/8'));assert.deepEqual(e,N.generate(seed,key,level,'6/8'));assert.equal(e[0].note,N.keys[key].root);assert.equal(e.at(-1).note,N.keys[key].root);
  assert(N.timeline(e).every(e=>Math.floor(e.beat/3)===Math.floor((e.beat+e.duration-.001)/3)));
 }
 assert(!N.validate([{note:60,duration:2},{note:60,duration:2}],'6/8'));assert(N.validate([{note:60,duration:1.5},{note:60,duration:1.5}],'6/8'));
 for(const lang of ['es','en','pt-BR'])for(const key of Object.keys(N.keys))for(const level of ['easy','medium','advanced']){
  const h=harness(lang,false,`?seed=123&key=${key}&level=${level}&meter=6%2F8`);vm.runInContext(fs.readFileSync(path.join(root,'dictado-pentagrama/app.js'),'utf8'),h.context);
  assert.equal(h.el('meter').value,'6/8');assert(h.el('answerCount').textContent.startsWith('0 / 12'));assert(h.el('answerScore').innerHTML.includes('6/8'));assert(h.el('answerScore').innerHTML.includes('>6</text>'));assert(h.el('answerScore').innerHTML.includes('>8</text>'));
  assert(h.el('tempoLabel').textContent!==h.context.window.WalamortNotationCopy[lang==='pt-BR'?'pt':lang].tempo);
  h.el('evaluate').onclick();assert.equal(h.el('solution').hidden,true);
  await h.el('listen').onclick();let playback=h.calls.at(-1);assert.equal(playback.beats,9);assert.equal(playback.bpm,120);assert.equal(playback.items[0].beat,0);assert.equal(playback.items[1].beat,1.5);assert.equal(playback.items[2].beat,3);assert.equal(playback.items.filter(e=>e.note===108).length,2);h.finish();
  const target=N.generate(123,key,level,'6/8');for(const e of target){h.el('pitch').value=e.note===null?'rest':String(e.note);h.el('duration').value=String(e.duration);h.el('add').onclick()}
  assert(h.el('answerCount').textContent.startsWith('12 / 12'));h.el('evaluate').onclick();assert(h.el('feedback').children[0].textContent.includes('100%'));assert.equal(h.context.window.WalamortProgress.read().length,1);
  const buttons=h.el('feedback').children.at(-1).children.filter(n=>n.tagName==='BUTTON');await buttons[0].onclick();playback=h.calls.at(-1);assert.equal(playback.beats,6);assert.equal(playback.bpm,120);assert.equal(playback.items.filter(e=>e.note===108).length,2);assert(playback.items.slice(2).every(e=>e.beat>=3&&e.beat<6));h.finish();
  for(const a of h.anchors)assert.equal(new URL(a.href).searchParams.get('meter'),'6/8');assert.equal(new URL(h.el('exerciseLink').value).searchParams.get('meter'),'6/8');
  const before=h.el('answerList').children.length;h.el('duration').value='.5';h.el('add').onclick();assert.equal(h.el('answerList').children.length,before);
  h.el('clear').onclick();h.el('duration').value='2';h.el('add').onclick();h.el('add').onclick();assert.equal(h.el('answerList').children.length,1,'Cross-bar note rejected');
  h.el('meter').value='4/4';h.el('meter').onchange();assert.equal(h.el('solution').hidden,true);assert.equal(h.el('answerList').children.length,0);assert(h.el('answerScore').innerHTML.includes('4/4'));h.el('evaluate').onclick();assert.equal(h.el('solution').hidden,true);
 }
 console.log('PASS: 3000 reproducible 6/8 dictations, exact bar boundaries, SVG signatures, 45 multilingual perfect sessions, dotted-quarter tempo/two-beat count-in, isolated review, overflow guards and meter-preserving links.');
})().catch(e=>{console.error(e);process.exitCode=1});
