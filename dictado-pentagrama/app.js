(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang.toLowerCase().startsWith('pt')?'pt':document.documentElement.lang==='en'?'en':'es',N=window.WalamortNotation,L=window.WalamortNotationCopy[lang],P=window.WalamortCreativePlayer;
  const params=new URLSearchParams(window.location.search);
  if(N.keys[params.get('key')])$('key').value=params.get('key');
  if(['easy','medium','advanced'].includes(params.get('level')))$('level').value=params.get('level');
  let exerciseSeed=params.has('seed')?N.seed(params.get('seed')):N.seed(NaN),target=[],answer=[],heard=false,recorded=false,practiceButtons=[];
  function tell(text){$('status').textContent=text}
  function element(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n}
  function option(value,text){const o=element('option',text);o.value=value;return o}
  function description(event){return N.name(event.note,lang,$('key').value)+' · '+event.duration+' '+(lang==='en'?(event.duration===1?'beat':'beats'):lang==='pt'?(event.duration===1?'tempo':'tempos'):(event.duration===1?'pulso':'pulsos'))}
  function draw(){
    $('answerScore').innerHTML=N.score(answer,$('key').value,lang);
    $('answerCount').textContent=N.total(answer)+' '+L.beats;
    $('answerList').replaceChildren(...answer.map((event,i)=>element('li',description(event))));
    $('undo').disabled=answer.length===0;$('clear').disabled=answer.length===0;
    $('hearAnswer').disabled=answer.every(e=>e.note===null);
  }
  function fresh(newSeed=true){
    P.stop();if(newSeed)exerciseSeed=N.seed(NaN);target=N.generate(exerciseSeed,$('key').value,$('level').value);answer=[];heard=false;recorded=false;
    practiceButtons=[];$('solution').hidden=true;$('feedback').textContent=L.resultNone;
    $('pitch').replaceChildren(option('rest',L.rest),...Array.from({length:25},(_,i)=>option(String(60+i),N.name(60+i,lang,$('key').value))));$('pitch').value=String(N.keys[$('key').value].root);
    $('keyboard').replaceChildren(...N.scale($('key').value).map(note=>{const b=element('button',N.name(note,lang,$('key').value));b.type='button';b.onclick=()=>{$('pitch').value=String(note);add()};return b}));
    const url=new URL(window.location.href);url.search='';url.searchParams.set('seed',String(exerciseSeed));url.searchParams.set('key',$('key').value);url.searchParams.set('level',$('level').value);$('exerciseLink').value=url.href;
    for(const a of document.querySelectorAll?.('.wm-locale a')||[]){const next=new URL(a.href,window.location.href);if(next.pathname.includes('/dictado-pentagrama/')){next.search=url.search;a.href=next.href;}}
    draw();tell(L.ready+' '+N.name(target[0].note,lang,$('key').value)+'. '+L.listenHelp);
  }
  function add(){
    const duration=Number($('duration').value),note=$('pitch').value==='rest'?null:Number($('pitch').value),total=N.total(answer);
    if(!N.durations.includes(duration)||note!==null&&(!Number.isInteger(note)||note<60||note>84))return;
    if(total+duration>8)return tell(L.tooLong);
    if(Math.floor(total/4)!==Math.floor((total+duration-.001)/4))return tell(L.crossBar);
    answer.push({note,duration});draw();tell(N.total(answer)+' / 8 · '+L.beats);
  }
  function bpm(){let value=Number($('tempo').value);value=Number.isFinite(value)?Math.max(45,Math.min(140,Math.round(value))):80;$('tempo').value=String(value);return value}
  function play(events,countIn=false,complete=()=>{}){
    const items=[];if(countIn)for(let i=0;i<4;i++)items.push({note:108,beat:i,duration:.09,instrument:'flute'});
    N.timeline(events).forEach(e=>{if(e.note!==null)items.push({note:e.note,beat:e.beat+(countIn?4:0),duration:e.duration*.88,instrument:$('instrument').value})});
    tell(L.playing);return P.play(items,bpm(),()=>{},()=>{complete();tell(L.finished)},N.total(events)+(countIn?4:0)).catch(()=>tell(L.audioError));
  }
  P.setStateListener(value=>{
    ['filters','editor'].forEach(id=>$(id).disabled=value);['listen','reference','evaluate','hearAnswer'].forEach(id=>$(id).disabled=value);$('stop').disabled=!value;
    practiceButtons.forEach(button=>button.disabled=value);if(!value)draw();
  });
  $('listen').onclick=()=>play(target,true,()=>heard=true);
  $('reference').onclick=()=>play([{note:N.keys[$('key').value].root,duration:1}]);
  $('stop').onclick=()=>{P.stop();tell(L.stopped)};
  $('hearAnswer').onclick=()=>{if(answer.length)play(answer)};
  $('add').onclick=add;$('undo').onclick=()=>{answer.pop();draw()};$('clear').onclick=()=>{answer=[];draw()};
  $('fresh').onclick=()=>fresh();['key','level'].forEach(id=>$(id).onchange=()=>fresh());
  $('tempo').onchange=()=>{P.stop();bpm();heard=false;tell(L.heardFirst)};
  $('evaluate').onclick=()=>{
    if(!heard)return tell(L.heardFirst);if(N.total(answer)!==8)return tell(L.fill);
    const result=N.evaluate(target,answer);$('solution').hidden=false;$('solutionScore').innerHTML=N.score(target,$('key').value,lang);
    $('feedback').replaceChildren(element('p',L.result+': '+result.score+'% · '+L.pitch+': '+result.pitch+'% · '+L.rhythm+': '+result.rhythm+'%'),...result.details.map(row=>element('p',L.beat+' '+(row.beat+1)+' · '+(row.pitchOK&&row.rhythmOK?L.correct:L.incorrect)+' — '+L.expected+': '+description(row.expected)+' | '+L.yours+': '+(row.actual?description(row.actual):L.missing))),element('p',L.extra+': '+result.extra),element('p',L.guidance));
    practice(result);
    if(!recorded){recorded=true;const ok=window.WalamortProgress.save('Dictado en pentagrama',$('level').value,result.score);tell((ok?L.saved:L.notSaved)+' '+L.retry)}else tell(L.retry);
  };
  const practiceCopy={
    es:{title:'Practica por compases',help:'Cuenta cuatro pulsos antes de cada fragmento. Compara el modelo con tu intento evaluado; practica despacio y vuelve a escribir. Escuchar aquí no modifica tu puntuación.',bar:'Compás',model:'Escuchar modelo',attempt:'Escuchar mi intento evaluado',pitch:'Errores de altura o silencio',rhythm:'Errores de duración o ataque',extra:'Ataques adicionales',ok:'Este compás coincide con el modelo.'},
    en:{title:'Practise one bar at a time',help:'Count four beats before each fragment. Compare the model with your evaluated attempt; practise slowly, then write again. Listening here does not change your score.',bar:'Bar',model:'Hear model',attempt:'Hear my evaluated attempt',pitch:'Pitch or rest errors',rhythm:'Duration or onset errors',extra:'Additional onsets',ok:'This bar matches the model.'},
    pt:{title:'Pratique um compasso por vez',help:'Conte quatro tempos antes de cada trecho. Compare o modelo com sua tentativa avaliada; pratique devagar e escreva novamente. Ouvir aqui não altera sua pontuação.',bar:'Compasso',model:'Ouvir modelo',attempt:'Ouvir minha tentativa avaliada',pitch:'Erros de altura ou pausa',rhythm:'Erros de duração ou ataque',extra:'Ataques adicionais',ok:'Este compasso corresponde ao modelo.'}
  }[lang];
  function practice(result){
    const C=practiceCopy,reviewed=answer.map(event=>({...event}));practiceButtons=[];
    const panel=element('section');panel.setAttribute('aria-label',C.title);panel.append(element('h3',C.title),element('p',C.help));
    for(let bar=0;bar<2;bar++){
      const start=bar*4,end=start+4,rows=result.details.filter(row=>row.beat>=start&&row.beat<end),model=N.timeline(target).filter(e=>e.beat>=start&&e.beat<end).map(({note,duration})=>({note,duration})),attempt=N.timeline(reviewed).filter(e=>e.beat>=start&&e.beat<end).map(({note,duration})=>({note,duration}));
      const extra=N.timeline(reviewed).filter(e=>e.beat>=start&&e.beat<end&&!rows.some(row=>row.beat===e.beat)).length,pitch=rows.filter(row=>!row.pitchOK).length,rhythm=rows.filter(row=>!row.rhythmOK).length;
      panel.append(element('h4',C.bar+' '+(bar+1)),element('p',pitch||rhythm||extra?C.pitch+': '+pitch+' · '+C.rhythm+': '+rhythm+' · '+C.extra+': '+extra:C.ok));
      for(const [text,events] of [[C.model,model],[C.attempt,attempt]]){const button=element('button',C.bar+' '+(bar+1)+' · '+text);button.type='button';button.onclick=()=>play(events,true);practiceButtons.push(button);panel.append(button)}
    }
    $('feedback').append(panel);
  }
  $('copyExercise').onclick=async()=>{try{await navigator.clipboard.writeText($('exerciseLink').value);tell(L.copied)}catch{$('exerciseLink').focus();$('exerciseLink').select();tell(L.copyFallback)}};
  fresh(false);
})();
