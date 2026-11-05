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
 assert.equal(N.name(60,'pt'),'Dó4');assert.equal(N.name(62,'pt'),'Ré4');assert.equal(N.name(66,'pt','G'),'Fá♯4');assert.equal(N.name(70,'pt','F'),'Si♭4');assert.equal(N.name(69,'pt'),'Lá4');assert.equal(N.name(null,'pt'),'Pausa');assert(N.score([],'C','pt').includes('Dois compassos'));
 for(const key of ['C','G','F','Am','Dm'])for(const level of ['easy','medium','advanced']){
  const h=harness('pt-BR',false,`?seed=123&key=${key}&level=${level}`);vm.runInContext(fs.readFileSync(path.join(root,'dictado-pentagrama/app.js'),'utf8'),h.context);
  assert(h.el('status').textContent.includes('A primeira nota é'));h.el('evaluate').onclick();assert(h.el('status').textContent.startsWith('Ouça'));
  await h.el('listen').onclick();assert.equal(h.el('stop').disabled,false);h.el('evaluate').onclick();assert(h.el('status').textContent.startsWith('Ouça'));h.finish();
  const events=N.generate(123,key,level);for(const e of events){h.el('pitch').value=e.note===null?'rest':String(e.note);h.el('duration').value=String(e.duration);h.el('add').onclick()}
  h.el('evaluate').onclick();assert(h.el('feedback').children[0].textContent.includes('Correspondência completa: 100%'));assert(h.el('feedback').children[0].textContent.includes('Alturas / pausas: 100%'));
  assert.equal(h.context.window.WalamortProgress.read().length,1);assert.equal(h.context.window.WalamortProgress.read()[0].activity,'Dictado en pentagrama');h.el('evaluate').onclick();assert.equal(h.context.window.WalamortProgress.read().length,1);
  await h.el('copyExercise').onclick();assert(h.calls.find(c=>c.copied).copied.includes('seed=123'));assert.equal(h.el('status').textContent,'Link copiado.');
  for(const anchor of h.anchors){const url=new URL(anchor.href);assert.equal(url.searchParams.get('seed'),'123');assert.equal(url.searchParams.get('key'),key);assert.equal(url.searchParams.get('level'),level)}
  const playback=h.calls.find(c=>c.items);assert.equal(playback.beats,12);assert(playback.items.slice(0,4).every(i=>i.instrument==='flute'));assert(playback.items.slice(4).every(i=>i.instrument==='guitar'));
 }
 const fallback=harness();vm.runInContext(fs.readFileSync(path.join(root,'dictado-pentagrama/app.js'),'utf8'),fallback.context);fallback.context.navigator.clipboard.writeText=async()=>{throw Error('denied')};await fallback.el('copyExercise').onclick();assert(fallback.el('exerciseLink').selected);assert.equal(fallback.el('status').textContent,'Copie manualmente o link exibido.');
 const reading=harness('pt-BR',true,'');vm.runInContext(fs.readFileSync(path.join(root,'pt/lectura-musical/app.js'),'utf8'),reading.context);
 for(const [clef,low,center,high] of [['treble','Mi4','Si4','Fá5'],['bass','Sol2','Ré3','Lá3'],['alto','Fá3','Dó4','Sol4']]){
  reading.el('handClef').value=clef;reading.el('handClef').onchange();const list=reading.el('handList').children;assert.equal(list.length,9);assert.equal(list[8].textContent,'Linha 1 · '+low);assert.equal(list[4].textContent,'Linha 3 · '+center);assert.equal(list[0].textContent,'Linha 5 · '+high);await list[4].onclick();assert(reading.el('handFeedback').textContent.includes(center));
 }
 for(let i=0;i<10;i++){const label=i%2?'Fá4':'Mi4';const option=reading.el('options').children.find(b=>b.textContent===label);assert(option,'Expected visual note '+label);option.onclick();reading.el('next').onclick()}
 assert.equal(reading.context.window.WalamortProgress.read()[0].score,100);assert.equal(reading.context.window.WalamortProgress.read()[0].activity,'Lectura de pentagrama');assert(reading.el('counter').textContent.startsWith('Sessão concluída'));
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/discovery/catalog.json'),'utf8'));
 for(const area of ['lectura-musical','dictado-pentagrama']){
  assert.equal(catalog.find(e=>e.path===area+'/').portuguese,'pt/'+area+'/');
  for(const folder of ['','en/','pt/']){const file=path.join(root,folder,area,'index.html'),html=fs.readFileSync(file,'utf8');assert(html.includes('hreflang="pt-BR"'));for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^(https?:|data:)/.test(m[1]))continue;assert(fs.existsSync(path.resolve(path.dirname(file),m[1].split('?')[0].split('#')[0])),file+' '+m[1])}}
 }
 console.log('PASS: Portuguese notation spelling, 15 perfect dictation flows, single saved attempt, instrument playback, multilingual reproducible links, clipboard fallback and three-clef hand mapping with a complete reading session.');
})().catch(e=>{console.error(e);process.exitCode=1});
