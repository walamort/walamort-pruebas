const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),catalog=JSON.parse(read('assets/discovery/catalog.json'));
const scope={window:{WalamortDiscoveryCatalog:catalog}};vm.createContext(scope);vm.runInContext(read('assets/discovery/navigation.js'),scope);const api=scope.window.WalamortDiscovery;
assert.equal(catalog.length,50);assert.equal(api.search('').length,50);
assert.equal(api.search('diapason')[0].path,'diapason/');assert.equal(api.search('DIAPASÓN')[0].path,'diapason/');assert.equal(api.search('fretboard','all','en')[0].english,'en/diapason/');
assert.equal(api.search('dictado melodico')[0].path,'dictado-melodico/');assert.equal(api.search('grabar')[0].path,'produccion-musical/');assert.equal(api.search('5.1')[0].path,'produccion-musical/#spatialPanel');
assert(api.search('','estudio').every(e=>e.group==='estudio'));assert.equal(api.search('qwertyxyz').length,0);assert.equal(api.search('<img onerror=alert(1)>').length,0);
assert(api.search('music school','all','en').some(e=>e.path==='preuniversitario/'));assert.equal(new Set(catalog.map(e=>e.id)).size,catalog.length);
const files=[];function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory()&&!['.git','samples'].includes(item.name))walk(file);else if(item.name==='index.html')files.push(file);}}walk(root);
let surfaces=0;const images=new Set();
for(const file of files){const html=fs.readFileSync(file,'utf8');if(!html.includes('class="wm-global-nav"'))continue;surfaces++;
 const nav=html.match(/<nav class="wm-global-nav"[\s\S]*?<\/nav>/)[0];assert.equal((nav.match(/<details class="wm-nav-group/g)||[]).length,6);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate id '+file);
 for(const match of nav.matchAll(/href="([^"]*)"/g)){const [url,fragment]=match[1].split('#');let target=path.resolve(path.dirname(file),url);if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');assert(fs.existsSync(target),'Missing '+target);if(fragment)assert(new RegExp('id=["\']'+fragment+'["\']').test(fs.readFileSync(target,'utf8')),'Missing anchor '+match[1]);}
 for(const match of html.matchAll(/(?:src|href)="([^"]*(?:discovery\/|portfolio-v2\/)[^"]*)"/g)){const clean=match[1].split('?')[0],target=path.resolve(path.dirname(file),clean);assert(fs.existsSync(target),'Missing asset '+target);if(clean.endsWith('.webp'))images.add(path.basename(clean).replace(/-1280\.webp$/,''));}
}
assert.equal(surfaces,59);assert.equal(images.size,12);
for(const entry of catalog){let target=path.join(root,entry.path.split('#')[0]);if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');assert(fs.existsSync(target));if(entry.english)assert(fs.existsSync(path.join(root,entry.english.split('#')[0],'index.html')));}
console.log('PASS: accented/bilingual/category search, safe empty states, 50 destinations, 59 six-menu surfaces, deep links, language fallbacks and all 12 responsive editorial images.');
