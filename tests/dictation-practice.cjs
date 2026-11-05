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
 for(const lang of ['es','en','pt-BR'])for(const key of ['C','G','F','Am','Dm'])for(const level of ['easy','medium','advanced']){
  const h=harness(lang,false,`?seed=123&key=${key}&level=${level}`);vm.runInContext(fs.readFileSync(path.join(root,'dictado-pentagrama/app.js'),'utf8'),h.context);
  assert.equal(h.el('feedback').children.length,0,'No model practice before evaluation');
  await h.el('listen').onclick();h.finish();
  for(let i=0;i<8;i++){h.el('pitch').value='84';h.el('duration').value='1';h.el('add').onclick()}
  h.el('evaluate').onclick();const panel=h.el('feedback').children.at(-1),buttons=panel.children.filter(n=>n.tagName==='BUTTON');assert.equal(buttons.length,4);
  assert(panel.children.filter(n=>n.tagName==='P').slice(1).every(n=>n.textContent.includes(': ')),'Specific error counts for both bars');
  const target=N.generate(123,key,level);
  for(let bar=0;bar<2;bar++){
   await buttons[bar*2].onclick();const model=h.calls.at(-1);assert.equal(model.beats,8);assert.equal(model.items.filter(e=>e.note===108).length,4);assert(buttons.every(b=>b.disabled));
   const expected=N.timeline(target).filter(e=>e.beat>=bar*4&&e.beat<(bar+1)*4&&e.note!==null);const notes=model.items.slice(4);assert.equal(notes.length,expected.length);
   notes.forEach((e,i)=>{assert.equal(e.note,expected[i].note);assert.equal(e.beat,expected[i].beat-bar*4+4);assert.equal(e.instrument,'guitar')});h.finish();assert(buttons.every(b=>!b.disabled));
   await buttons[bar*2+1].onclick();const attempt=h.calls.at(-1);assert.equal(attempt.beats,8);assert.equal(attempt.items.slice(4).length,4);assert(attempt.items.slice(4).every(e=>e.note===84));h.finish();
  }
  h.el('clear').onclick();await buttons[1].onclick();assert.equal(h.calls.at(-1).items.slice(4).length,4,'Playback uses evaluated snapshot');h.finish();
  assert.equal(h.context.window.WalamortProgress.read().length,1,'Practice playback never saves a score');
  h.el('fresh').onclick();assert.equal(h.el('solution').hidden,true);
 }
 console.log('PASS: 45 ES/EN/PT corrective practice flows, per-bar model and evaluated snapshot, exact timing/rests, count-in, playback locks, one saved score and no solution before evaluation.');
})().catch(e=>{console.error(e);process.exitCode=1});
