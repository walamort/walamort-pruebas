const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const checkouts=new Set([...read('index.html').matchAll(/https:\/\/pay\.hotmart\.com\/[A-Z0-9]+/g)].map(m=>m[0]));
assert.equal(checkouts.size,12);
for(const folder of ['','en/','pt/']){
 const file=folder+'metodos/index.html',html=read(file),cards=[...html.matchAll(/<article\b[^>]*data-kind="instrument"[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(cards.length,12);assert(html.includes('id="method-languages"'));assert(html.includes('id="free-guides"'));
 assert.equal(new Set(cards.flatMap(c=>[...c.matchAll(/https:\/\/pay\.hotmart\.com\/[A-Z0-9]+/g)].map(m=>m[0]))).size,12);
 for(const card of cards){assert(card.includes('ES · EN · PT-BR'));for(const m of card.matchAll(/https:\/\/pay\.hotmart\.com\/[A-Z0-9]+/g))assert(checkouts.has(m[0]));}
 for(const code of ['es','en','pt-BR'])assert(html.includes('hreflang="'+code+'"'));
 for(const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)){if(/^(https?:|mailto:)/.test(m[1]))continue;assert(fs.existsSync(path.resolve(root,path.dirname(file),m[1].split(/[?#]/)[0])),file+' '+m[1]);}
}
for(const base of ['Tongue-Drum-Primeros-Pasos-Walamort','Handpan-Primeros-Pasos-Walamort','Handpan-Primeros-Pasos-Walamort-Edicion-2'])for(const lang of ['EN','PT-BR']){
 const bytes=fs.readFileSync(path.join(root,'descargas',base+'-'+lang+'.pdf'));assert.equal(bytes.subarray(0,5).toString(),'%PDF-');assert(bytes.length>50000);
}
assert(!fs.readdirSync(path.join(root,'descargas')).some(n=>/^(Metodo-|Pack-)/i.test(n)),'Paid instrument PDFs must stay outside the public website');
const catalog=JSON.parse(read('assets/discovery/catalog.json'));assert.equal(catalog.find(e=>e.path==='metodos/').portuguese,'pt/metodos/');
const cards=[{dataset:{topic:'kalimba',kind:'instrument'}},{dataset:{topic:'handpan',kind:'instrument'}}],els={interest:{value:''},count:{},filters:{},resetFilter:{}};
const context={document:{documentElement:{lang:'pt-BR'},body:{dataset:{base:'../../'}},getElementById:id=>els[id],querySelectorAll:()=>cards},location:{search:'?interest=kalimba',href:'https://example.test/pt/metodos/'},history:{replaceState(){}},URL,URLSearchParams};vm.createContext(context);vm.runInContext(read('metodos/app.js'),context);assert.equal(cards.filter(c=>!c.hidden).length,1);assert(els.count.textContent.includes('opções'));els.resetFilter.onclick();assert.equal(cards.filter(c=>!c.hidden).length,2);
console.log('PASS: 12 verified purchase destinations in three catalog languages, real free-guide PDFs, reciprocal language links, Portuguese filters and no public paid instrument PDFs.');
