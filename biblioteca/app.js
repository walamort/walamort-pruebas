(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang==='en'?'en':'es',N=window.WalamortNotation,C=window.WalamortCreative,L=window.WalamortNotationCopy[lang],P=window.WalamortCreativePlayer,R=window.WalamortRhythmReading;
  const params=new URLSearchParams(window.location.search),types=['reading','dictation','harmony','rhythm'];
  if(types.includes(params.get('type')))$('type').value=params.get('type');if(N.keys[params.get('key')])$('key').value=params.get('key');if(['easy','medium','advanced'].includes(params.get('level')))$('level').value=params.get('level');
  const count=Number(params.get('count'));if([2,4,6,8].includes(count))$('count').value=String(count);
  $('code').value=String(params.has('seed')?N.seed(params.get('seed')):N.seed(NaN));
  let models=[];
  function url(path,values){const target=new URL(path,window.location.href);for(const [k,v]of Object.entries(values))target.searchParams.set(k,String(v));return target.href}
  function noteList(events,key){return events.map(e=>N.name(e.note,lang,key)+' ('+e.duration+' '+(lang==='en'?(e.duration===1?'beat':'beats'):(e.duration===1?'pulso':'pulsos'))+')').join(' · ')}

  function rhythmName(f){const i=R.figures.findIndex(v=>v.id===f.id),names=lang==='en'?['Whole note','Half note','Quarter note','Eighth note','Dotted quarter note','Dotted half note']:['Redonda','Blanca','Negra','Corchea','Negra con puntillo','Blanca con puntillo'];return names[i]}
  function beats(t){return (t/2).toLocaleString(lang,{maximumFractionDigits:1})}
  function rhythmReference(){if($('type').value!=='rhythm')return '';const icon=(f,rest)=>R.svg({events:[{...f,rest}],beats:null},lang).replace('viewBox="0 0 600 180"','viewBox="210 25 125 130"');return '<h3>'+(lang==='en'?'Duration reference':'Referencia de duraciones')+'</h3><p>'+(lang==='en'?'Quarter note = one beat in 2/4, 3/4 and 4/4. A dot adds half of the original duration. A rest has the same duration as its corresponding note.':'Negra = un pulso en 2/4, 3/4 y 4/4. El puntillo añade la mitad de la duración original. El silencio dura lo mismo que su figura correspondiente.')+'</p><table class="rhythm-table"><thead><tr><th>'+(lang==='en'?'Figure':'Figura')+'</th><th>'+(lang==='en'?'Note':'Nota')+'</th><th>'+(lang==='en'?'Rest':'Silencio')+'</th><th>'+(lang==='en'?'Beats':'Pulsos')+'</th></tr></thead><tbody>'+R.figures.map(f=>'<tr><th>'+rhythmName(f)+'</th><td>'+icon(f,false)+'</td><td>'+icon(f,true)+'</td><td>'+beats(f.ticks)+'</td></tr>').join('')+'</tbody></table>'}
  function markup(model,solutions,interactive){
    const {index,key,seed,level,type}=model,heading=L.exercise+' '+(index+1),metadata=L.key+': '+L.keys[Object.keys(N.keys).indexOf(key)];let html='<article class="worksheet-exercise"><h3>'+heading+'</h3><p>'+metadata+'</p>';
    if(type==='rhythm'){
      const q=model.rhythm,unit=lang==='en'?'quarter-note beats':'pulsos de negra',prompt=q.beats?(lang==='en'?'How many beats are missing from this bar?':'¿Cuántos pulsos faltan para completar este compás?'):(lang==='en'?'How many beats does this figure or rest last?':'¿Cuántos pulsos dura esta figura o silencio?');
      html='<article class="worksheet-exercise"><h3>'+heading+'</h3><p>'+prompt+'</p>'+(q.beats?'<p>'+q.beats+'/4</p>':'')+'<div class="score-scroll rhythm-score">'+R.svg(q,lang)+'</div><p>'+q.events.map(f=>(f.rest?(lang==='en'?'Rest: ':'Silencio: '):'')+rhythmName(f)).join(' · ')+'</p><p class="write-line">'+(lang==='en'?'Answer':'Respuesta')+': __________________ '+unit+'</p>';
      if(solutions){const used=q.events.reduce((n,f)=>n+f.ticks,0);html+='<div class="solution-box"><strong>'+L.solution+'</strong><p>'+beats(q.answer)+' '+unit+'. '+(q.beats?q.beats+' − '+beats(used)+' = '+beats(q.answer):rhythmName(q.events[0])+' = '+beats(q.answer))+'</p></div>'}
    }else if(type==='harmony'){
      const c=model.chord,rootName=N.name(c.root,lang,key).replace(/\d+$/,''),label=c.roman+' · '+rootName+c.suffix;
      html+='<p>'+L.writeChord+'</p><p><strong>'+label+'</strong> · '+(lang==='en'?['Root position','First inversion','Second inversion','Third inversion'][c.inversion]:['Estado fundamental','Primera inversión','Segunda inversión','Tercera inversión'][c.inversion])+'</p><p class="write-line">'+L.notes+': __________________________________</p><p class="write-line">'+(lang==='en'?'Bass note':'Bajo')+': __________________</p>';
      if(solutions)html+='<div class="solution-box"><strong>'+L.solution+'</strong><p>'+c.notes.map(n=>N.name(n,lang,key)).join(' · ')+'</p><p>'+(lang==='en'?'Bass note':'Bajo')+': '+N.name(c.notes[0],lang,key)+'</p></div>';
    }else{
      html+='<p>'+(type==='reading'?L.writeNames:L.writeDictation)+'</p><div class="score-scroll">'+N.score(type==='reading'?model.events:[],key,lang,type==='dictation')+'</div><p class="write-line">________________________________________________________________</p>';
      if(solutions)html+='<div class="solution-box"><strong>'+L.solution+'</strong>'+(type==='dictation'?'<div class="score-scroll">'+N.score(model.events,key,lang)+'</div>':'')+'<p>'+noteList(model.events,key)+'</p></div>';
    }
    if(interactive){if(type==='rhythm')html+='<p>'+(lang==='en'?'Audio: four-beat count-in, then only the written fragment. The missing duration is not played.':'Audio: cuatro pulsos de cuenta previa y después solo el fragmento escrito. No se reproduce la duración faltante.')+'</p>';const href=type==='rhythm'?url('../lectura-primera-vista/',{level})+'#rhythm-reading':type==='harmony'?url('../laboratorio-armonico/',{key,degree:model.degree,seventh:model.seventh?1:0,inversion:model.inversion}):url('../dictado-pentagrama/',{seed,key,level});html+='<div class="exercise-controls"><button type="button" data-hear="'+index+'">'+L.hear+'</button><a href="'+N.escape(href)+'">'+(type==='harmony'||type==='rhythm'?L.practice:L.open)+' →</a></div>'}
    return html+'</article>';
  }
  function render(){
    P.stop();const key=$('key').value,level=$('level').value,type=$('type').value,code=N.seed($('code').value);$('code').value=String(code);
    models=Array.from({length:Number($('count').value)},(_,index)=>{const seed=(code+index*977)>>>0,events=N.generate(seed,key,level),rnd=N.random(seed),degree=Math.floor(rnd()*7),seventh=level==='advanced'||level==='medium'&&rnd()<.4,inversion=level==='easy'?0:Math.floor(rnd()*(seventh?4:3));return {rhythm:type==='rhythm'?R.question(level,index,N.random(seed)):null,index,seed,key,level,type,events,degree,seventh,inversion,chord:C.chord(key,degree,seventh,inversion)}});
    $('sheetTitle').textContent=L.student+' · Walamort';$('sheetMetadata').textContent=(type==='rhythm'?(lang==='en'?'Rhythmic reading':'Lectura rítmica'):L.types[types.indexOf(type)])+' · '+L.levels[['easy','medium','advanced'].indexOf(level)]+' · '+L.seed+': '+code;
    $('key').disabled=type==='rhythm';$('rhythmReference').innerHTML=rhythmReference();$('exercises').innerHTML=models.map(model=>markup(model,$('solutions').checked,true)).join('');
    Array.from($('exercises').querySelectorAll('[data-hear]')).forEach(button=>button.onclick=()=>{
      const m=models[Number(button.getAttribute('data-hear'))],instrument=$('instrument').value;let events=m.type==='rhythm'?m.rhythm.events.reduce((acc,f)=>{const beat=acc.reduce((n,e)=>n+e.duration,0);acc.push({note:f.rest?null:60,beat,duration:f.ticks/2,instrument});return acc},[]).filter(e=>e.note!==null):m.type==='harmony'?m.chord.notes.map(note=>({note,beat:0,duration:1.8,instrument})):N.timeline(m.events).filter(e=>e.note!==null).map(e=>({note:e.note,beat:e.beat,duration:e.duration*.88,instrument}));
      if(m.type==='rhythm')events=[...Array.from({length:4},(_,i)=>({note:84,beat:i,duration:.1,instrument:'piano'})),...events.map(e=>({...e,beat:e.beat+4}))];$('status').textContent=L.playing;P.play(events,80,()=>{},()=>{$('status').textContent=L.finished},m.type==='rhythm'?4+m.rhythm.events.reduce((n,f)=>n+f.ticks/2,0):m.type==='harmony'?2:8).catch(()=>{$('status').textContent=L.audioError});
    });
    $('shareLink').value=url('./',{type,level,key,count:$('count').value,seed:code});
  }
  P.setStateListener(value=>{$('filters').disabled=value;$('key').disabled=value||$('type').value==='rhythm';$('stop').disabled=!value;Array.from($('exercises').querySelectorAll('[data-hear]')).forEach(b=>b.disabled=value)});
  $('generate').onclick=render;['type','key','level','count','solutions'].forEach(id=>$(id).onchange=render);
  $('code').onchange=render;$('stop').onclick=()=>{P.stop();$('status').textContent=L.stopped};
  $('share').onclick=async()=>{try{await navigator.clipboard.writeText($('shareLink').value);$('status').textContent=L.copied}catch{$('shareLink').focus();$('shareLink').select();$('status').textContent=L.copyFallback}};
  $('print').onclick=()=>{P.stop();window.print()};window.addEventListener('beforeprint',()=>P.stop());
  $('download').onclick=()=>{
    const css='table{width:100%;border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid #888;padding:8px}.rhythm-table svg{width:60px;height:65px}tr{break-inside:avoid} body{font:16px/1.6 system-ui;color:#24111a;max-width:950px;margin:30px auto;padding:0 20px}svg{display:block;width:100%;height:auto}.worksheet-exercise{border-top:1px solid #986550;padding:20px 0;break-inside:avoid}.solution-box{border-left:3px solid #986550;padding-left:15px}.write-line{white-space:nowrap;overflow:hidden} @media print{@page{margin:15mm}body{margin:0;padding:0;font-size:11pt}}';
    const content='<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+N.escape(L.student)+' · Walamort</title><style>'+css+'</style></head><body><h1>'+N.escape($('sheetTitle').textContent)+'</h1><p>'+N.escape($('sheetMetadata').textContent)+'</p>'+rhythmReference()+models.map(m=>markup(m,$('solutions').checked,false)).join('')+'<footer>Walamort Academy · '+(lang==='en'?'Original practice materials':'Materiales originales de práctica')+'</footer></body></html>',blob=new Blob([content],{type:'text/html;charset=utf-8'}),href=URL.createObjectURL(blob),link=document.createElement('a');link.href=href;link.download='walamort-'+$('type').value+'-'+$('code').value+'.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);$('status').textContent=L.downloaded;
  };
  render();$('stop').disabled=true;
})();
