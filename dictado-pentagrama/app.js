(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang.toLowerCase().startsWith('pt')?'pt':document.documentElement.lang==='en'?'en':'es',N=window.WalamortNotation,L=window.WalamortNotationCopy[lang],P=window.WalamortCreativePlayer;
  const params=new URLSearchParams(window.location.search);
  if(N.keys[params.get('key')])$('key').value=params.get('key');
  if(['easy','medium','advanced'].includes(params.get('level')))$('level').value=params.get('level');
  $('meter').value=params.get('meter')==='6/8'?'6/8':'4/4';
  $('articulation').value=params.get('ties')==='1'?'ties':'separate';
  const meter=()=>N.meters[$('meter').value]||N.meters['4/4'];
  let exerciseSeed=params.has('seed')?N.seed(params.get('seed')):N.seed(NaN),target=[],answer=[],heard=false,recorded=false,practiceButtons=[];
  function tell(text){$('status').textContent=text}
  function element(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n}
  function option(value,text){const o=element('option',text);o.value=value;return o}
  function description(event){
    const text=N.name(event.note,lang,$('key').value)+' · '+($('meter').value==='6/8'?(event.duration*2)+' '+(event.duration*2===1?meterCopy.eighth:meterCopy.eighths):event.duration+' '+(lang==='en'?(event.duration===1?'beat':'beats'):lang==='pt'?(event.duration===1?'tempo':'tempos'):(event.duration===1?'pulso':'pulsos')));
    return text+(event.tie?' · '+tieCopy.continuation:event.tied?' · '+tieCopy.sustain:'');
  }

  function draw(){
    $('answerScore').innerHTML=N.score(answer,$('key').value,lang,false,$('meter').value);
    $('answerCount').textContent=$('meter').value==='6/8'?(N.total(answer)*2)+' / 12 · '+meterCopy.eighths:N.total(answer)+' '+L.beats;
    $('answerList').replaceChildren(...answer.map((event,i)=>element('li',description(event))));
    $('undo').disabled=answer.length===0;$('clear').disabled=answer.length===0;
    $('hearAnswer').disabled=answer.every(e=>e.note===null);
    $('tie').disabled=!answer.length||answer[answer.length-1].note===null;if($('tie').disabled)$('tie').checked=false;
  }
  function fresh(newSeed=true){
    P.stop();if(newSeed)exerciseSeed=N.seed(NaN);target=N.generate(exerciseSeed,$('key').value,$('level').value,$('meter').value,$('articulation').value==='ties');answer=[];heard=false;recorded=false;
    practiceButtons=[];$('tie').checked=false;$('solution').hidden=true;$('feedback').textContent=L.resultNone;
    $('pitch').replaceChildren(option('rest',L.rest),...Array.from({length:25},(_,i)=>option(String(60+i),N.name(60+i,lang,$('key').value))));$('pitch').value=String(N.keys[$('key').value].root);
    $('keyboard').replaceChildren(...N.scale($('key').value).map(note=>{const b=element('button',N.name(note,lang,$('key').value));b.type='button';b.onclick=()=>{$('pitch').value=String(note);add()};return b}));
    const url=new URL(window.location.href);url.search='';url.searchParams.set('seed',String(exerciseSeed));url.searchParams.set('key',$('key').value);url.searchParams.set('level',$('level').value);url.searchParams.set('meter',$('meter').value);url.searchParams.set('ties',$('articulation').value==='ties'?'1':'0');$('exerciseLink').value=url.href;
    for(const a of document.querySelectorAll?.('.wm-locale a')||[]){const next=new URL(a.href,window.location.href);if(next.pathname.includes('/dictado-pentagrama/')){next.search=url.search;a.href=next.href;}}
    updateMeter();draw();tell(L.ready+' '+N.name(target[0].note,lang,$('key').value)+'. '+($('meter').value==='6/8'?meterCopy.countIn:L.listenHelp));
  }
  function add(){
    const duration=Number($('duration').value),note=$('pitch').value==='rest'?null:Number($('pitch').value),total=N.total(answer);
    if(!N.durations.includes(duration)||note!==null&&(!Number.isInteger(note)||note<60||note>84))return;
    if(total+duration>meter().total)return tell($('meter').value==='6/8'?meterCopy.tooLong:L.tooLong);
    if(Math.floor(total/meter().bar)!==Math.floor((total+duration-.001)/meter().bar))return tell(tieCopy.crossBar);
    const tie=$('tie').checked===true,previous=answer[answer.length-1];if(tie&&(!previous||note===null||previous.note!==note))return tell(tieCopy.invalid);
    answer.push(tie?{note,duration,tie:true}:{note,duration});$('tie').checked=false;draw();tell($('answerCount').textContent);
  }
  function bpm(){let value=Number($('tempo').value);value=Number.isFinite(value)?Math.max(45,Math.min(140,Math.round(value))):80;$('tempo').value=String(value);return value}
  function play(events,countIn=false,complete=()=>{}){
    const items=[];if(countIn)for(let i=0;i<meter().countIn;i++)items.push({note:108,beat:i*meter().pulse,duration:.09,instrument:'flute'});
    N.sounding(events).forEach(e=>{if(e.note!==null)items.push({note:e.note,beat:e.beat+(countIn?meter().bar:0),duration:e.tied?Math.max(.01,e.duration-.04):e.duration*.88,instrument:$('instrument').value})});
    tell(L.playing);return P.play(items,bpm()*meter().pulse,()=>{},()=>{complete();tell(L.finished)},N.total(events)+(countIn?meter().bar:0)).catch(()=>tell(L.audioError));
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
  $('fresh').onclick=()=>fresh();['key','level','meter','articulation'].forEach(id=>$(id).onchange=()=>fresh());
  $('tempo').onchange=()=>{P.stop();bpm();heard=false;tell(L.heardFirst)};
  $('evaluate').onclick=()=>{
    if(!heard)return tell(L.heardFirst);if(N.total(answer)!==meter().total)return tell($('meter').value==='6/8'?meterCopy.fill:L.fill);
    const result=N.evaluate(target,answer);$('solution').hidden=false;$('solutionScore').innerHTML=N.score(target,$('key').value,lang,false,$('meter').value);
    $('feedback').replaceChildren(element('p',L.result+': '+result.score+'% · '+L.pitch+': '+result.pitch+'% · '+L.rhythm+': '+result.rhythm+'%'),...result.details.map(row=>element('p',($('meter').value==='6/8'?meterCopy.position:L.beat)+' '+(row.beat*($('meter').value==='6/8'?2:1)+1)+' · '+(row.pitchOK&&row.rhythmOK?L.correct:L.incorrect)+' — '+L.expected+': '+description(row.expected)+' | '+L.yours+': '+(row.actual?description(row.actual):L.missing))),element('p',L.extra+': '+result.extra),element('p',L.guidance));
    practice(result);
    if(!recorded){recorded=true;const ok=window.WalamortProgress.save('Dictado en pentagrama',$('level').value,result.score);tell((ok?L.saved:L.notSaved)+' '+L.retry)}else tell(L.retry);
  };
  const tieCopy={
    es:{preview:'En el repaso por compases, el sonido que viene ligado se vuelve a iniciar al comienzo del fragmento. En el dictado completo se mantiene sin un nuevo ataque.',continuation:'ligada a la nota anterior',sustain:'sonido sostenido',invalid:'Una ligadura une notas contiguas de la misma altura, nunca silencios. Elige la misma nota anterior o desmarca la ligadura.',crossBar:'La figura cruza la barra de compás. Completa primero este compás con una figura más corta. Para sostener la nota al siguiente, añade la misma altura y marca «Unir a la nota anterior».',help:'Una ligadura suma las duraciones de notas de la misma altura sin volver a atacarlas. Añade la primera figura; después elige la misma nota, marca «Unir a la nota anterior» y añade la siguiente figura. Puedes cruzar la barra de compás con dos figuras. La evaluación acepta escrituras ligadas equivalentes en sonido y distingue las notas repetidas con nuevo ataque. En el repaso aislado, una nota que viene ligada del compás anterior vuelve a sonar al inicio del fragmento.'},
    en:{preview:'Bar review rearticulates a note tied from the previous bar at the start of the fragment. Full dictation playback keeps it sustained without another attack.',continuation:'tied from the previous note',sustain:'sustained sound',invalid:'A tie joins adjacent notes of the same pitch, never rests. Choose the previous pitch or uncheck the tie.',crossBar:'The note crosses a barline. Finish this bar with a shorter note value. To sustain into the next bar, add the same pitch and select “Tie from previous note”.',help:'A tie adds the durations of notes of the same pitch without another attack. Add the first note; then choose the same pitch, select “Tie from previous note” and add the next note value. Two written notes can sustain across a barline. Assessment accepts tied spellings with the same sound and distinguishes repeated attacks. In isolated bar review, a note tied from the previous bar is rearticulated at the start of the fragment.'},
    pt:{preview:'Na revisão por compassos, a nota ligada do compasso anterior é rearticulada no início do trecho. No ditado completo, o som continua sem um novo ataque.',continuation:'ligada à nota anterior',sustain:'som sustentado',invalid:'Uma ligadura une notas consecutivas da mesma altura, nunca pausas. Escolha a nota anterior ou desmarque a ligadura.',crossBar:'Complete este compasso com uma figura menor. Para sustentar no próximo compasso, adicione a mesma altura e marque “Unir à nota anterior”.',help:'Uma ligadura soma as durações de notas da mesma altura sem um novo ataque. Adicione a primeira figura; depois escolha a mesma nota, marque “Unir à nota anterior” e adicione a próxima figura. Duas figuras podem sustentar o som através da barra de compasso. A avaliação aceita escritas ligadas equivalentes em som e distingue notas repetidas com novo ataque. Na revisão isolada, uma nota ligada do compasso anterior é rearticulada no início do trecho.'}
  }[lang];
  const meterCopy={
    es:{label:'Compás',intro:'Escucha dos compases en 4/4 o 6/8 y escribe alturas, duraciones y silencios. La evaluación compara las notas y sus posiciones rítmicas.',eighths:'corcheas',eighth:'corchea',position:'Posición en corcheas',countIn:'En 6/8 hay dos pulsos por compás, cada uno de tres corcheas. La cuenta previa tiene dos pulsos: UNO dos tres, DOS dos tres. El tempo indica negras con puntillo por minuto.',help:'Completa doce corcheas entre los dos compases. Cada compás contiene seis corcheas, agrupadas en dos pulsos de tres. El tempo mide el pulso de negra con puntillo. No confundas seis corcheas con seis pulsos.',fill:'Completa exactamente doce corcheas (dos compases de 6/8) antes de evaluar.',tooLong:'Esa duración supera las doce corcheas. Elige otra o borra la última nota.',tempo:'Tempo (negras con puntillo/min)',practiceHelp:'Cuenta dos pulsos de tres corcheas antes de cada fragmento: UNO dos tres, DOS dos tres. Compara el modelo con tu intento evaluado; escuchar no cambia tu puntuación.',durations:['Semicorchea · ½ corchea','Corchea · 1 corchea','Negra · 2 corcheas','Negra con puntillo · 3 corcheas','Blanca · 4 corcheas']},
    en:{label:'Meter',intro:'Listen to two bars in 4/4 or 6/8 and write pitches, durations and rests. Assessment compares notes and their rhythmic positions.',eighths:'eighth notes',eighth:'eighth note',position:'Eighth-note position',countIn:'6/8 has two beats per bar, each containing three eighth notes. The count-in has two beats: ONE two three, TWO two three. Tempo is measured in dotted quarters per minute.',help:'Complete twelve eighth notes across the two bars. Each bar has six eighth notes grouped into two beats of three. Tempo measures the dotted-quarter pulse. Six eighth notes are not six beats.',fill:'Complete exactly twelve eighth notes (two bars of 6/8) before checking.',tooLong:'That duration exceeds twelve eighth notes. Choose another or undo the last note.',tempo:'Tempo (dotted quarters/min)',practiceHelp:'Count two beats of three eighth notes before each fragment: ONE two three, TWO two three. Compare the model with your evaluated attempt; listening does not change your score.',durations:['Sixteenth · ½ eighth note','Eighth · 1 eighth note','Quarter · 2 eighth notes','Dotted quarter · 3 eighth notes','Half · 4 eighth notes']},
    pt:{label:'Compasso',intro:'Ouça dois compassos em 4/4 ou 6/8 e escreva alturas, durações e pausas. A avaliação compara as notas e suas posições rítmicas.',eighths:'colcheias',eighth:'colcheia',position:'Posição em colcheias',countIn:'O 6/8 tem dois tempos por compasso, cada um com três colcheias. A contagem inicial tem dois tempos: UM dois três, DOIS dois três. O tempo indica semínimas pontuadas por minuto.',help:'Complete doze colcheias entre os dois compassos. Cada compasso contém seis colcheias, agrupadas em dois tempos de três. O andamento mede o pulso da semínima pontuada. Seis colcheias não são seis tempos.',fill:'Complete exatamente doze colcheias (dois compassos de 6/8) antes de avaliar.',tooLong:'Essa duração ultrapassa doze colcheias. Escolha outra ou apague a última nota.',tempo:'Andamento (semínimas pontuadas/min)',practiceHelp:'Conte dois tempos de três colcheias antes de cada trecho: UM dois três, DOIS dois três. Compare o modelo com sua tentativa avaliada; ouvir não altera sua pontuação.',durations:['Semicolcheia · ½ colcheia','Colcheia · 1 colcheia','Semínima · 2 colcheias','Semínima pontuada · 3 colcheias','Mínima · 4 colcheias']}
  }[lang];
  function updateMeter(){
    const compound=$('meter').value==='6/8',selected=$('duration').value;
    $('duration').replaceChildren(...N.durations.map((value,i)=>option(String(value),(compound?meterCopy.durations:L.durations)[i])));$('duration').value=N.durations.includes(Number(selected))?selected:'1';
    $('tieGuide').open=$('articulation').value==='ties';$('tieHelp').textContent=tieCopy.help;$('dictationIntro').textContent=meterCopy.intro;$('answerHelp').textContent=compound?meterCopy.help:L.answerHelp;$('listenHelp').textContent=compound?meterCopy.countIn:L.listenHelp;$('tempoLabel').textContent=compound?meterCopy.tempo:L.tempo;
  }
  const practiceCopy={
    es:{title:'Practica por compases',help:'Cuenta cuatro pulsos antes de cada fragmento. Compara el modelo con tu intento evaluado; practica despacio y vuelve a escribir. Escuchar aquí no modifica tu puntuación.',bar:'Compás',model:'Escuchar modelo',attempt:'Escuchar mi intento evaluado',pitch:'Errores de altura o silencio',rhythm:'Errores de duración o ataque',extra:'Ataques adicionales',ok:'Este compás coincide con el modelo.'},
    en:{title:'Practise one bar at a time',help:'Count four beats before each fragment. Compare the model with your evaluated attempt; practise slowly, then write again. Listening here does not change your score.',bar:'Bar',model:'Hear model',attempt:'Hear my evaluated attempt',pitch:'Pitch or rest errors',rhythm:'Duration or onset errors',extra:'Additional onsets',ok:'This bar matches the model.'},
    pt:{title:'Pratique um compasso por vez',help:'Conte quatro tempos antes de cada trecho. Compare o modelo com sua tentativa avaliada; pratique devagar e escreva novamente. Ouvir aqui não altera sua pontuação.',bar:'Compasso',model:'Ouvir modelo',attempt:'Ouvir minha tentativa avaliada',pitch:'Erros de altura ou pausa',rhythm:'Erros de duração ou ataque',extra:'Ataques adicionais',ok:'Este compasso corresponde ao modelo.'}
  }[lang];
  function practice(result){
    const C=practiceCopy,reviewed=answer.map(event=>({...event}));practiceButtons=[];
    const panel=element('section');panel.setAttribute('aria-label',C.title);panel.append(element('h3',C.title),element('p',$('meter').value==='6/8'?meterCopy.practiceHelp:C.help));
    if(target.some(e=>e.tie))panel.append(element('p',tieCopy.preview));
    for(let bar=0;bar<2;bar++){
      const start=bar*meter().bar,model=N.fragment(target,start,meter().bar),attempt=N.fragment(reviewed,start,meter().bar),barResult=N.evaluate(model,attempt),rows=barResult.details;
      const extra=barResult.extra,pitch=rows.filter(row=>!row.pitchOK).length,rhythm=rows.filter(row=>!row.rhythmOK).length;
      panel.append(element('h4',C.bar+' '+(bar+1)),element('p',pitch||rhythm||extra?C.pitch+': '+pitch+' · '+C.rhythm+': '+rhythm+' · '+C.extra+': '+extra:C.ok));
      for(const [text,events] of [[C.model,model],[C.attempt,attempt]]){const button=element('button',C.bar+' '+(bar+1)+' · '+text);button.type='button';button.onclick=()=>play(events,true);practiceButtons.push(button);panel.append(button)}
    }
    $('feedback').append(panel);
  }
  $('copyExercise').onclick=async()=>{try{await navigator.clipboard.writeText($('exerciseLink').value);tell(L.copied)}catch{$('exerciseLink').focus();$('exerciseLink').select();tell(L.copyFallback)}};
  fresh(false);
})();
