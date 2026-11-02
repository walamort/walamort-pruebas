const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');let pages=0;
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','node_modules'].includes(item.name))continue;const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else if(p.endsWith('.html')){
 const s=fs.readFileSync(p,'utf8').replace(/\r\n?/g,'\n');if(!/<head\b/i.test(s))continue;pages++;
 const policies=[...s.matchAll(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/g)];assert.equal(policies.length,1,p);const c=policies[0][1];
 for(const rule of ["base-uri 'none'","object-src 'none'","script-src-attr 'none'","worker-src 'none'","form-action 'self' https://assets.mailerlite.com"])assert(c.includes(rule),p+' '+rule);
 const scripts=c.match(/(?:^|; )script-src ([^;]+)/)[1];assert(!scripts.includes('unsafe-inline'));assert(!scripts.includes('unsafe-eval'));assert(!scripts.includes('https:'));
 assert(s.indexOf(policies[0][0])<s.search(/<script\b/i)||!/<script\b/i.test(s),p);
 assert(!/\son[a-z]+\s*=\s*["']/i.test(s),'Inline event handler '+p);
 for(const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
  const src=m[1].match(/\bsrc\s*=\s*["']([^"']+)/i);if(src){assert(!/^(?:https?:)?\/\//i.test(src[1]),'External JS '+p);continue;}
  const hash="'sha256-"+crypto.createHash('sha256').update(m[2]).digest('base64')+"'";assert(scripts.includes(hash),'Stale script hash '+p);
 }
 assert(s.includes('<meta name="referrer" content="strict-origin-when-cross-origin">'),p);
}}}
walk(root);assert(pages>=80);
const tracking=require(path.join(root,'seguimiento/core.js'));
for(const prefix of ['=','+','-','@',' =','\t=','\n@']){
 const report=tracking.report([{activity:'reading',level:'easy',score:80,date:'2026-11-02T12:00:00Z'}],prefix+'SUM(1,1)','group');
 const csv=tracking.csv([report]);assert(csv.includes('"\''),'CSV formula not neutralized: '+JSON.stringify(prefix));
}
assert.throws(()=>tracking.validateBackup({kind:'walamort-progress-backup',version:1,rows:[{activity:'x',level:'easy',score:Infinity,date:'bad'}]}));
console.log('PASS: '+pages+' page-specific CSP policies, inline hashes, restricted scripts/connections, no event handlers, referrer policy and hostile CSV labels.');
