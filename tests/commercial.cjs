const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
process.chdir(path.resolve(__dirname,'..'));
const core=require('../servicios-musicales/core.js');
const valid={service:'lesson',topic:'armonia',format:'online',participants:'1',place:'Bogotá UTC-5',when:'Diciembre',objective:'Aprender a armonizar una melodía original.'};
assert.equal(core.validate(valid).participants,1);
for(const [override,error] of [[{participants:'0'},'participants'],[{participants:'301'},'participants'],[{participants:'1.5'},'participants'],[{participants:'1e2'},'participants'],[{participants:'2'},'individual'],[{format:'onsite'},'online'],[{service:'workshop'},'group'],[{objective:'corto'},'objective'],[{topic:'__proto__'},'invalid'],[{service:'unknown'},'invalid'],[{service:'workshop',participants:'20',format:'onsite',place:''},'place']])assert.throws(()=>core.validate({...valid,...override}),new RegExp(error));
assert.equal(core.validate({...valid,service:'workshop',participants:'300'}).participants,300);
assert.equal(core.validate({...valid,objective:'x'.repeat(700)}).objective.length,500);
assert(!core.validate({...valid,place:'Bogotá\nBcc:spam'}).place.includes('\n'));
for(const lang of ['es','en']){
 const text=core.message({...valid,objective:'Componer <script> & un motivo, ¿sí?'},lang),links=core.links(text);
 assert.equal(new URL(links.whatsapp).searchParams.get('text'),text);
 assert.equal(new URL(links.email).searchParams.get('body'),text);
 assert(text.includes(lang==='es'?'no es una reserva':'not a booking'));
}
function harness(lang='es'){
 const elements={};function el(id){return elements[id]??={value:valid[id]||'',hidden:true,textContent:'',attrs:{},addEventListener(event,fn){this[event]=fn},removeAttribute(a){delete this.attrs[a]},scrollIntoView(){this.scrolled=true}}}
 el('participants').value='1';el('language');el('requestForm');
 const ctx={document:{documentElement:{lang},body:{dataset:{base:lang==='en'?'../../':'../'}},getElementById:el},window:{WalamortInquiry:core,print(){}},location:{search:'?service=lesson&topic=composicion'},URLSearchParams,navigator:{clipboard:{writeText:async()=>{}}}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('servicios-musicales/app.js','utf8'),ctx);return{el};
}
for(const lang of ['es','en']){
 const h=harness(lang);assert.equal(h.el('topic').value,'composicion');h.el('requestForm').submit({preventDefault(){}});assert.equal(h.el('requestResult').hidden,false);assert(h.el('message').textContent.includes('Walamort'));assert(h.el('whatsapp').href.startsWith('https://wa.me/573053650966?text='));
 h.el('objective').value='changed';h.el('objective').input();assert.equal(h.el('requestResult').hidden,true);assert.equal(h.el('message').textContent,'');
 h.el('requestForm').submit({preventDefault(){}});assert(h.el('requestError').textContent);assert.equal(h.el('requestResult').hidden,true);
}
for(const lang of ['es','en']){
 const cards=['handpan','tongue-drum','kalimba','armonia','composicion','improvisacion'].map((topic,i)=>({dataset:{topic,kind:i<3?'instrument':'creative'},hidden:false}));
 const els={interest:{value:''},count:{},language:{},filters:{},resetFilter:{}};
 const ctx={document:{documentElement:{lang},body:{dataset:{base:lang==='en'?'../../':'../'}},getElementById:id=>els[id],querySelectorAll:()=>cards},location:{search:'?interest=creative',href:'https://example.com/metodos/?interest=creative'},history:{replaceState(){}},URL,URLSearchParams};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('metodos/app.js','utf8'),ctx);assert.equal(cards.filter(c=>!c.hidden).length,3);assert.equal(els.filters.hidden,false);assert(els.language.href.includes('interest=creative'));els.interest.value='armonia';els.interest.onchange();assert.equal(cards.filter(c=>!c.hidden).length,1);els.resetFilter.onclick();assert.equal(cards.filter(c=>!c.hidden).length,6);
}
for(const file of ['metodos/index.html','en/metodos/index.html','servicios-musicales/index.html','en/servicios-musicales/index.html']){
 const html=fs.readFileSync(file,'utf8');assert(html.includes('hreflang="en"'));assert(html.includes('rel="canonical"'));
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  const url=match[1];if(/^(https?:|mailto:)/.test(url))continue;
  assert(fs.existsSync(path.resolve(path.dirname(file),url.split(/[?#]/)[0])),file+' -> '+url);
 }
}
const names=fs.readdirSync('descargas');assert(!names.some(n=>/^Walamort-(Armonia|Composicion|Improvisacion)-Cuaderno/.test(n)),'Full editorial drafts must not be public.');
console.log('PASS: bilingual offers and links, quote bounds, encoded channels, no automatic transmission, stale-message invalidation, goal filters, metadata/assets and private full editions.');
