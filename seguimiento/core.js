(function(root){
 'use strict';
 const clean=(s,n)=>typeof s==='string'?s.replace(/[\u0000-\u001f]/g,' ').trim().slice(0,n):'';
 function rows(raw){if(!Array.isArray(raw)||raw.length>200)throw Error('rows');return raw.map(r=>{if(!r||typeof r.activity!=='string'||!clean(r.activity,80)||typeof r.level!=='string'||!clean(r.level,24)||typeof r.score!=='number'||!Number.isFinite(r.score)||r.score<0||r.score>100||typeof r.date!=='string'||!Number.isFinite(Date.parse(r.date)))throw Error('row');return {activity:clean(r.activity,80),level:clean(r.level,24),score:r.score,date:new Date(r.date).toISOString()};});}
 function merge(a,b){const all=new Map();for(const r of [...rows(a),...rows(b)])all.set(JSON.stringify(r),r);return [...all.values()].sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).slice(-200);}
 function summary(raw){const entries=rows(raw),groups=new Map();for(const row of entries){if(!groups.has(row.activity))groups.set(row.activity,[]);groups.get(row.activity).push(row);}return [...groups].map(([activity,list])=>{list.sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));return {activity,count:list.length,mean:Math.round(list.reduce((n,r)=>n+r.score,0)/list.length),best:Math.max(...list.map(r=>r.score)),last:list[list.length-1].score,level:list[list.length-1].level,date:list[list.length-1].date};});}
 function backup(raw){return {kind:'walamort-progress-backup',version:1,rows:rows(raw)};}
 function validateBackup(raw){if(!raw||raw.kind!=='walamort-progress-backup'||raw.version!==1)throw Error('backup');return backup(raw.rows);}
 function report(raw,alias,group){alias=clean(alias,60);if(!alias)throw Error('alias');return {kind:'walamort-progress-report',version:1,alias,group:clean(group,40),createdAt:new Date().toISOString(),notice:'Local practice records; identity and file contents are not independently verified.',rows:rows(raw)};}
 function validateReport(raw){if(!raw||raw.kind!=='walamort-progress-report'||raw.version!==1||!Number.isFinite(Date.parse(raw.createdAt)))throw Error('report');const r=report(raw.rows,raw.alias,raw.group);r.createdAt=new Date(raw.createdAt).toISOString();return r;}
 function cell(v){let text=String(v);if(/^[=+\-@]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';}
 function csv(reports){return '\ufeff'+[['Alias','Group','Activity','Attempts','Mean','Best','Last'],...reports.map(validateReport).flatMap(r=>summary(r.rows).map(s=>[r.alias,r.group,s.activity,s.count,s.mean,s.best,s.last]))].map(row=>row.map(cell).join(',')).join('\r\n');}
 const api={clean,rows,merge,summary,backup,validateBackup,report,validateReport,csv};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortTracking=api;
})(typeof window==='object'?window:globalThis);
