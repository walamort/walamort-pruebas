(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang==='en'?'en':'es',N=window.WalamortNotation,L=window.WalamortNotationCopy[lang],P=window.WalamortCreativePlayer;
  const params=new URLSearchParams(window.location.search);
  if(N.keys[params.get('key')])$('key').value=params.get('key');
  if(['easy','medium','advanced'].includes(params.get('level')))$('level').value=params.get('level');
  let exerciseSeed=params.has('seed')?N.seed(params.get('seed')):N.seed(NaN),target=[],answer=[],heard=false,recorded=false;
  function tell(text){$('status').textContent=text}
  function element(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n}
  function option(value,text){const o=element('option',text);o.value=value;return o}
  function description(event){return N.name(event.note,lang,$('key').value)+' · '+event.duration+' '+(lang==='en'?(event.duration===1?'beat':'beats'):(event.duration===1?'pulso':'pulsos'))}
  function draw(){
    $('answerScore').innerHTML=N.score(answer,$('key').value,lang);
    $('answerCount').textContent=N.total(answer)+' '+L.beats;
    $('answerList').replaceChildren(...answer.map((event,i)=>element('li',description(event))));
    $('undo').disabled=answer.length===0;$('clear').disabled=answer.length===0;
    $('hearAnswer').disabled=answer.every(e=>e.note===null);
  }
  function fresh(newSeed=true){
    P.stop();if(newSeed)exerciseSeed=N.seed(NaN);target=N.generate(exerciseSeed,$('key').value,$('level').value);answer=[];heard=false;recorded=false;
    $('solution').hidden=true;$('feedback').textContent=L.resultNone;
    $('pitch').replaceChildren(option('rest',L.rest),...Array.from({length:25},(_,i)=>option(String(60+i),N.name(60+i,lang,$('key').value))));$('pitch').value=String(N.keys[$('key').value].root);
    $('keyboard').replaceChildren(...N.scale($('key').value).map(note=>{const b=element('button',N.name(note,lang,$('key').value));b.type='button';b.onclick=()=>{$('pitch').value=String(note);add()};return b}));
    const url=new URL(window.location.href);url.search='';url.searchParams.set('seed',String(exerciseSeed));url.searchParams.set('key',$('key').value);url.searchParams.set('level',$('level').value);$('exerciseLink').value=url.href;
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
    if(!value)draw();
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
    if(!recorded){recorded=true;const ok=window.WalamortProgress.save('Dictado en pentagrama',$('level').value,result.score);tell((ok?L.saved:L.notSaved)+' '+L.retry)}else tell(L.retry);
  };
  fresh(false);
})();
