const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),preview=root.endsWith('pruebas'),base='https://walamort.com/'+(preview?'walamort-pruebas/':'');
const catalog=JSON.parse(read('assets/discovery/catalog.json')),scope={window:{WalamortDiscoveryCatalog:catalog}};vm.createContext(scope);vm.runInContext(read('assets/discovery/navigation.js'),scope);const search=scope.window.WalamortDiscovery.search;
assert.equal(search('producao','all','pt')[0].path,'produccion-musical/');assert.equal(search('ditado melodico','all','pt')[0].path,'dictado-melodico/');assert(search('violao','all','pt').some(e=>e.path==='diapason/'));assert.equal(search('afinacao','all','pt')[0].path,'afinador/');
assert(catalog.every(e=>e.pt.title&&e.pt.description));
for(const logical of ['index.html','buscar/index.html'])for(const folder of ['','en/','pt/']){
 const rel=folder+logical,html=read(rel),head=html.split('</head>')[0];assert(head.includes('href="'+base+(folder+logical).replace(/index.html$/,'')+'"'));assert.equal((head.match(/rel="canonical"/g)||[]).length,1);
 for(const [code,prefix] of [['es',''],['en','en/'],['pt-BR','pt/']])assert(head.includes('hreflang="'+code+'" href="'+base+prefix+logical.replace(/index.html$/,'')+'"'));
 assert.equal(head.includes('noindex'),preview);assert(!head.includes('walamort.github.io'));assert(!html.includes('walamort.com/walamort-pruebas/')||preview);
 assert.equal((html.match(/class="wm-locale"/g)||[]).length,1);assert(html.includes('Português (Brasil)'));
}
for(const name of ['Kalimba','Handpan','Tongue-Drum'])assert(fs.existsSync(path.join(root,'descargas',name+'-Primeiros-Passos-Walamort.pdf')));
assert(read('pt/index.html').includes('Os exercícios interativos ainda estão em espanhol ou inglês'));
const urls=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert(urls.includes(base));assert(urls.includes(base+'en/'));assert(urls.includes(base+'pt/'));assert(urls.includes(base+'pt/buscar/'));assert.equal(new Set(urls).size,urls.length);
for(const url of urls){assert(url.startsWith(base));const relative=url.slice(base.length);const file=path.join(root,relative,'index.html');assert(fs.existsSync(file),file);if(!preview)assert(!read(relative+'index.html').split('</head>')[0].includes('noindex'));}
assert(preview?read('robots.txt').includes('Disallow: /'):read('robots.txt').includes('Allow: /'));
console.log('PASS: Portuguese search/catalog, truthful translation scope, three-language switches, reciprocal hreflang, canonical URLs, sitemap and production/preview crawl separation.');
