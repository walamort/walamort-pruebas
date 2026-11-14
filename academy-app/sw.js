const VERSION='v1.0.0';
const PREFIX='walamort-academy:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const FILES=['./','index.html','app.css','app.js','core.js','lessons.json','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(p=>new Request(new URL(p,self.registration.scope).href,{cache:'reload'}))))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url),scope=new URL(self.registration.scope);if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(event.request.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(new URL('index.html',scope).href);return hit||fetch(event.request);})());return;}
 const relative=url.pathname.slice(scope.pathname.length);if(!FILES.includes(relative)&&relative!=='')return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(url.origin+url.pathname);return hit||fetch(event.request);})());
});
