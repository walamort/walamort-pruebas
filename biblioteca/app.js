(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang==='en'?'en':'es',N=window.WalamortNotation,C=window.WalamortCreative,L=window.WalamortNotationCopy[lang],P=window.WalamortCreativePlayer;
  const params=new URLSearchParams(window.location.search),types=['reading','dictation','harmony'];
  if(types.includes(params.get('type')))$('type').value=params.get('type');if(N.keys[params.get('key')])$('key').value=params.get('key');if(['easy','medium','advanced'].includes(params.get('level')))$('level').value=params.get('level');
  const count=Number(params.get('count'));if([2,4,6,8].includes(count))$('count').value=String(count);
  $('code').value=String(params.has('seed')?N.seed(params.get('seed')):N.seed(NaN));
  let models=[];
  function url(path,values){const target=new URL(path,window.location.href);for(const [k,v]of Object.entries(values))target.searchParams.set(k,String(v));return target.href}
  function noteList(events,key){return events.map(e=>N.name(e.note,lang,key)+' ('+e.duration+' '+(lang==='en'?'beats':'pulsos')+')').join(' · ')}
  function markup(model,solutions,interactive){
    const {index,key,seed,level,type}=model,heading=L.exercise+' '+(index+1),metadata=L.key+': '+L.keys[Object.keys(N.keys).indexOf(key)];let html='<article class="worksheet-exercise"><h3>'+heading+'</h3><p>'+metadata+'</p>';
    if(type==='harmony'){
      const c=model.chord,rootName=N.name(c.root,lang,key).replace(/\d+$/,''),label=c.roman+' · '+rootName+c.suffix;
      html+='<p>'+L.writeChord+'</p><p><strong>'+label+'</strong> · '+(lang==='en'?['Root position','First inversion','Second inversion','Third inversion'][c.inversion]:['Estado fundamental','Primera inversión','Segunda inversión','Tercera inversión'][c.inversion])+'</p><p class="write-line">'+L.notes+': __________________________________</p><p class="write-line">'+(lang==='en'?'Bass note':'Bajo')+': __________________</p>';
      if(solutions)html+='<div class="solution-box"><strong>'+L.solution+'</strong><p>'+c.notes.map(n=>N.name(n,lang,key)).join(' · ')+'</p><p>'+(lang==='en'?'Bass note':'Bajo')+': '+N.name(c.notes[0],lang,key)+'</p></div>';
    }else{
      html+='<p>'+(type==='reading'?L.writeNames:L.writeDictation)+'</p><div class="score-scroll">'+N.score(type==='reading'?model.events:[],key,lang,type==='dictation')+'</div><p class="write-line">________________________________________________________________</p>';
      if(solutions)html+='<div class="solution-box"><strong>'+L.solution+'</strong>'+(type==='dictation'?'<div class="score-scroll">'+N.score(model.events,key,lang)+'</div>':'')+'<p>'+noteList(model.events,key)+'</p></div>';
    }
    if(interactive){const href=type==='harmony'?url('../laboratorio-armonico/',{key,degree:model.degree,seventh:model.seventh?1:0,inversion:model.inversion}):url('../dictado-pentagrama/',{seed,key,level});html+='<div class="exercise-controls"><button type="button" data-hear="'+index+'">'+L.hear+'</button><a href="'+N.escape(href)+'">'+(type==='harmony'?L.practice:L.open)+' →</a></div>'}
    return html+'</article>';
  }
  function render(){
    P.stop();const key=$('key').value,level=$('level').value,type=$('type').value,code=N.seed($('code').value);$('code').value=String(code);
    models=Array.from({length:Number($('count').value)},(_,index)=>{const seed=(code+index*977)>>>0,events=N.generate(seed,key,level),rnd=N.random(seed),degree=Math.floor(rnd()*7),seventh=level==='advanced'||level==='medium'&&rnd()<.4,inversion=level==='easy'?0:Math.floor(rnd()*(seventh?4:3));return {index,seed,key,level,type,events,degree,seventh,inversion,chord:C.chord(key,degree,seventh,inversion)}});
    $('sheetTitle').textContent=L.student+' · Walamort';$('sheetMetadata').textContent=L.types[types.indexOf(type)]+' · '+L.levels[['easy','medium','advanced'].indexOf(level)]+' · '+L.seed+': '+code;
    $('exercises').innerHTML=models.map(model=>markup(model,$('solutions').checked,true)).join('');
    Array.from($('exercises').querySelectorAll('[data-hear]')).forEach(button=>button.onclick=()=>{
      const m=models[Number(button.getAttribute('data-hear'))],instrument=$('instrument').value,events=m.type==='harmony'?m.chord.notes.map(note=>({note,beat:0,duration:1.8,instrument})):N.timeline(m.events).filter(e=>e.note!==null).map(e=>({note:e.note,beat:e.beat,duration:e.duration*.88,instrument}));
      $('status').textContent=L.playing;P.play(events,80,()=>{},()=>{$('status').textContent=L.finished},m.type==='harmony'?2:8).catch(()=>{$('status').textContent=L.audioError});
    });
    $('shareLink').value=url('./',{type,level,key,count:$('count').value,seed:code});
  }
  P.setStateListener(value=>{$('filters').disabled=value;$('stop').disabled=!value;Array.from($('exercises').querySelectorAll('[data-hear]')).forEach(b=>b.disabled=value)});
  $('generate').onclick=render;['type','key','level','count','solutions'].forEach(id=>$(id).onchange=render);
  $('code').onchange=render;$('stop').onclick=()=>{P.stop();$('status').textContent=L.stopped};
  $('share').onclick=async()=>{try{await navigator.clipboard.writeText($('shareLink').value);$('status').textContent=L.copied}catch{$('shareLink').focus();$('shareLink').select();$('status').textContent=L.copyFallback}};
  $('print').onclick=()=>window.print();
  $('download').onclick=()=>{
    const css='body{font:16px/1.6 system-ui;color:#24111a;max-width:950px;margin:30px auto;padding:0 20px}svg{display:block;width:100%;height:auto}.worksheet-exercise{border-top:1px solid #986550;padding:20px 0;break-inside:avoid}.solution-box{border-left:3px solid #986550;padding-left:15px}.write-line{white-space:nowrap;overflow:hidden} @media print{@page{margin:15mm}body{margin:0;padding:0;font-size:11pt}}';
    const content='<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+N.escape(L.student)+' · Walamort</title><style>'+css+'</style></head><body><h1>'+N.escape($('sheetTitle').textContent)+'</h1><p>'+N.escape($('sheetMetadata').textContent)+'</p>'+models.map(m=>markup(m,$('solutions').checked,false)).join('')+'<footer>Walamort Academy · '+(lang==='en'?'Original practice materials':'Materiales originales de práctica')+'</footer></body></html>',blob=new Blob([content],{type:'text/html;charset=utf-8'}),href=URL.createObjectURL(blob),link=document.createElement('a');link.href=href;link.download='walamort-'+$('type').value+'-'+$('code').value+'.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);$('status').textContent=L.downloaded;
  };
  render();$('stop').disabled=true;
})();
