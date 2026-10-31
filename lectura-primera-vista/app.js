(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang==='en'?'en':'es',R=window.WalamortSightReading,L=window.WalamortSightCopy[lang];
  let active=false,answered=false,paused=false,q=null,rows=[],timer=null,elapsedBefore=0,started=0,previous=null;
  const params=new URLSearchParams(window.location.search);if(['easy','medium','advanced'].includes(params.get('level')))$('level').value=params.get('level');
  if(Object.hasOwn(R.KEYS,params.get('key')))$('key').value=params.get('key');if(Object.hasOwn(R.CLEFS,params.get('clef')))$('clef').value=params.get('clef');
  function el(tag,text){const n=document.createElement(tag);n.textContent=text;return n}
  function stopClock(){if(timer!==null)clearInterval(timer);timer=null}
  function elapsed(){return elapsedBefore+(!paused&&!answered&&active?performance.now()-started:0)}
  function limit(){return Number($('limit').value)||0}
  function tick(){const remaining=Math.max(0,limit()*1000-elapsed());$('time').textContent=limit()?L.remaining+': '+Math.ceil(remaining/1000)+' '+L.seconds:L.unlimited;if(limit()&&remaining<=0)answer(null,true)}
  function startClock(){started=performance.now();if(limit())timer=setInterval(tick,100);tick()}
  function choose(list){return list[Math.floor(Math.random()*list.length)]}
  function clefTitle(clef){return L.clefs[['treble','bass','alto'].indexOf(clef)]}
  function keyTitle(key){return L.keys[Object.keys(R.KEYS).indexOf(key)]}
  function makeQuestion(){
    stopClock();window.WalamortSound.stop();answered=false;paused=false;elapsedBefore=0;
    const clef=$('clef').value==='mixed'?choose(Object.keys(R.CLEFS)):$('clef').value,key=$('key').value;
    q=R.question(clef,key,$('level').value,Math.random,previous);previous=q.position;
    $('staff').innerHTML=R.staff(q,false,lang);$('context').textContent=L.clef+': '+clefTitle(q.clef)+' · '+keyTitle(q.key);
    $('counter').textContent=L.question+' '+(rows.length+1)+' '+L.of+' 10';$('feedback').textContent=L.choose;
    $('hear').disabled=true;$('next').disabled=true;$('next').textContent=rows.length===9?L.finish:L.next;$('pause').disabled=false;$('pause').textContent=L.pause;
    $('options').replaceChildren(...q.options.map(option=>{const b=el('button',R.name(option.position,option.alteration,lang));b.type='button';b.onclick=()=>answer(option,false);return b}));
    startClock();
  }
  function answer(selected,timeout){
    if(!active||answered||paused)return;
    const ms=Math.round(elapsed());if(limit()&&ms>=limit()*1000){selected=null;timeout=true}answered=true;stopClock();const correct=R.correct(q,selected);rows.push({correct,timeout,ms});
    Array.from($('options').children).forEach((b,i)=>{b.disabled=true;if(R.correct(q,q.options[i]))b.classList.add('correct');else if(q.options[i]===selected)b.classList.add('wrong')});
    const symbol=q.explicit===0?L.natural:q.explicit===1?L.sharp:L.flat;
    $('feedback').textContent=(timeout?L.timeout:correct?L.correct:L.wrong)+' '+L.answer+' '+R.name(q.position,q.alteration,lang)+'. '+L.signature+': '+keyTitle(q.key)+'. '+(q.explicit===null?L.implicit:L.explicit+' '+symbol+'.');
    $('next').disabled=false;$('hear').disabled=false;$('pause').disabled=true;
  }
  function pause(){
    if(!active||answered||paused)return;elapsedBefore=elapsed();paused=true;stopClock();window.WalamortSound.stop();Array.from($('options').children).forEach(b=>b.disabled=true);$('pause').textContent=L.resume;$('feedback').textContent=L.paused;
  }
  function resume(){if(!paused||!active||answered)return;paused=false;Array.from($('options').children).forEach(b=>b.disabled=false);$('pause').textContent=L.pause;$('feedback').textContent=L.choose;startClock()}
  function finish(){
    active=false;answered=true;paused=false;stopClock();window.WalamortSound.stop();$('filters').disabled=false;$('options').replaceChildren();$('pause').disabled=true;$('next').disabled=true;$('hear').disabled=true;
    const result=R.summarize(rows);$('counter').textContent=L.summary+' · '+result.score+'%';$('time').textContent=L.first;
    $('feedback').replaceChildren(el('p',L.hits+': '+result.correct+' / 10'),el('p',L.timeouts+': '+result.timeouts),el('p',L.average+': '+(result.average===null?L.noAverage:(result.average/1000).toLocaleString(lang,{maximumFractionDigits:2})+' '+L.seconds)),el('p',L.resultHint));
    const ok=window.WalamortProgress.save('Lectura a primera vista',$('level').value,result.score);$('status').textContent=ok?L.saved:L.failed;
  }
  $('start').onclick=()=>{stopClock();window.WalamortSound.stop();active=true;rows=[];previous=null;$('filters').disabled=true;$('status').textContent=L.study;makeQuestion()};
  $('next').onclick=()=>{if(!answered||!active)return;if(rows.length===10)finish();else makeQuestion()};
  $('pause').onclick=()=>paused?resume():pause();
  $('hear').onclick=async()=>{if(!answered||!q)return;try{await window.WalamortSound.play(q.midi)}catch{$('status').textContent=L.noteError}};
  $('print').onclick=()=>{pause();window.print()};window.addEventListener('beforeprint',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});window.addEventListener('pagehide',pause);
  $('staff').innerHTML=R.staff({clef:'treble',key:'C'},true,lang);$('status').textContent=L.ready;$('time').textContent=L.first;
})();
