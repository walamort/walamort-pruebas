const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path'),root=path.resolve(__dirname,'..');
function harness(mode,folder='pt'){
 const elements={},store={},tasks=new Map();let id=0,serial=0;
 function el(name){return elements[name]??={id:name,value:({level:'easy',tempo:'140',instrument:'piano',latency:'0',audioVolume:'0'})[name]||'',children:[],textContent:'',disabled:false,style:{},attributes:{},setAttribute(k,v){this.attributes[k]=v},append(...nodes){this.children.push(...nodes)},replaceChildren(...nodes){this.children=nodes},addEventListener(k,fn){this[k]=fn}};}
 const nodes=[],param=()=>({value:1,setValueAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){assert(v>0);this.value=v}});
 const audio={state:'running',currentTime:0,destination:{},resume:async()=>{},createOscillator(){return {frequency:param(),setPeriodicWave(){},connect(){},disconnect(){},start(){},stop(){}}},createPeriodicWave(){return {}},createGain(){const n={gain:param(),connect(){},disconnect(){}};nodes.push(n);return n}};
 const document={documentElement:{lang:folder==='pt'?'pt-BR':'en'},body:{dataset:{mode}},getElementById:el,createElement:()=>el('created'+serial++),addEventListener(){}};
 const math=Object.create(Math);math.random=()=>0;
 const scope={document,Math:math,console,URLSearchParams,setTimeout(fn,ms){tasks.set(++id,{fn,ms});return id},clearTimeout(id){tasks.delete(id)},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=v},window:{location:{search:''},addEventListener(){},AudioContext:class{constructor(){return audio}}}};
 vm.createContext(scope);for(const file of ['practica-audio/progress.js',folder+'/practica-audio/sound.js',folder+'/practica-audio/app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope);
 return {el,audio,nodes,scope,flush(){const pending=[...tasks.values()].sort((a,b)=>a.ms-b.ms);tasks.clear();pending.forEach(t=>t.fn())}};
}
(async()=>{
 const m=harness('melody');assert.equal(m.el('keyboard').children[0].textContent,'Dó4');assert.equal(m.el('keyboard').children[6].textContent,'Fá♯4');assert(m.el('description').textContent.includes('A primeira nota é Dó4'));
 m.el('evaluate').onclick();assert(m.el('status').textContent.includes('Ouça a melodia'));await m.el('listen').onclick();m.flush();for(let n=0;n<4;n++)await m.el('keyboard').children[0].onclick();m.el('evaluate').onclick();assert(m.el('feedback').textContent.startsWith('100%'));assert(m.el('feedback').textContent.includes('notas corretas'));assert.equal(m.scope.window.WalamortProgress.read()[0].activity,'Dictado melódico');
 const r=harness('rhythm');await r.el('listen').onclick();r.flush();await r.el('record').onclick();for(let n=0;n<8;n++){r.audio.currentTime=.2+(4+n)*60/140;r.el('tap').pointerdown({button:0,preventDefault(){}});}r.flush();assert(r.el('feedback').textContent.startsWith('100% de precisão'));assert(r.el('feedback').textContent.includes('Omissões: 0'));assert.equal(r.scope.window.WalamortProgress.read()[0].activity,'Práctica rítmica');assert(r.nodes.some(n=>n.gain.value===0));
 const en=harness('melody','en');for(const [i,label] of [[1,'C♯4'],[6,'F♯4'],[8,'G♯4'],[10,'A♯4']])assert.equal(en.el('keyboard').children[i].textContent,label);
 for(const page of ['dictado-melodico','practica-ritmica']){const html=fs.readFileSync(path.join(root,'pt',page,'index.html'),'utf8');assert(html.includes('lang="pt-BR"'));assert(html.includes('id="audioVolume"'));assert(html.includes('hreflang="pt-BR"'));}
 console.log('PASS: Portuguese melody/rhythm attempts score 100%, natural/chromatic note labels, localized evaluation, muted output, stable progress IDs and corrected English sharps.');
})().catch(e=>{console.error(e);process.exitCode=1});
