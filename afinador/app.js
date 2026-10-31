(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang==='en'?'en':'es',C=window.WalamortPitch,L=window.WalamortPitchCopy[lang];
  const store='walamort-pitch-v1:'+(window.location.pathname.includes('/walamort-pruebas/')?'preview':'site');
  let epoch=0,running=false,pending=false,source='',stream=null,context=null,input=null,analyser=null,timer=null,buffer=null,tones=[],latest=null,measurement=new C.Measurement(),saved=false,records=[];
  try {const rows=JSON.parse(localStorage.getItem(store)||'[]');if(Array.isArray(rows))records=rows.filter(C.validRecord).slice(-30)}catch{}
  const params=new URLSearchParams(window.location.search);if(params.get('mode')==='practice')$('mode').value='practice';const requested=Number(params.get('target'));if(Number.isInteger(requested)&&requested>=48&&requested<=84)$('target').value=String(requested);
  function mode(){return $('mode').value==='practice'?'practice':'free'}
  function target(){return Number($('target').value)}
  function a4(){return Math.max(430,Math.min(450,Number($('a4').value)||440))}
  function tolerance(){return [5,10,20].includes(Number($('tolerance').value))?Number($('tolerance').value):20}
  function flat(){return $('spelling').value==='flat'}
  function tell(text){$('status').textContent=text}
  function settings(){return {target:target(),a4:a4(),tolerance:tolerance()}}
  function eligible(){return !running&&!pending&&source==='microphone'&&mode()==='practice'&&measurement.validSeconds>=5&&!saved}
  function metrics(){const s=measurement.summary();$('validTime').textContent=s.validSeconds.toFixed(1)+' '+L.seconds;$('percentage').textContent=s.inTunePercent===null?'—':s.inTunePercent+'%';$('save').disabled=!eligible();$('saveHelp').textContent=source==='demo'?L.demoNoSave:mode()==='free'?L.tunerNoSave:L.needTime}
  function setBusy(value){$('settings').disabled=value;$('start').disabled=value;$('demo').disabled=value;$('stop').disabled=!value;metrics()}
  function resetDisplay(){latest=null;tones=[];$('detected').textContent='—';$('frequency').textContent='—';$('deviation').textContent='—';$('needle').style.left='50%';$('pitchMeter').className='pitch-meter';$('snapshot').disabled=true}
  function reset(){const chosen=target();$('target').replaceChildren(...Array.from({length:37},(_,i)=>{const option=document.createElement('option');option.value=String(48+i);option.textContent=C.name(48+i,lang,flat());return option}));$('target').value=String(chosen);$('zone').style.left=(50-tolerance())+'%';$('zone').style.width=(tolerance()*2)+'%';measurement=new C.Measurement();saved=false;resetDisplay();$('targetLabel').textContent=C.name(target(),lang,flat())+' · '+C.frequency(target(),a4()).toFixed(1)+' Hz';$('comparison').textContent=mode()==='practice'?L.targetInfo:L.nearest;$('quality').textContent=L.waiting;metrics()}
  function stop(message=L.stopped){
    epoch++;running=false;pending=false;if(timer!==null)clearInterval(timer);timer=null;
    if(stream){for(const track of stream.getTracks()){track.onended=null;track.stop()}}stream=null;
    if(input){try{input.disconnect()}catch{}}input=null;analyser=null;buffer=null;
    if(context){const old=context;context=null;old.onstatechange=null;try{const result=old.close();if(result&&result.catch)result.catch(()=>{})}catch{}}
    window.WalamortSound.stop();measurement.silence();setBusy(false);if(message)tell(message);
  }
  function begin(kind){stop('');source=kind;reset();$('source').textContent=kind==='demo'?L.demoLabel:L.microphone}
  function consume(frame,sampleRate,time){
    const detected=C.analyze(frame,sampleRate,{threshold:Number($('threshold').value)});$('inputLevel').value=Math.min(.15,detected.rms);
    if(!detected.frequency||detected.confidence<.85){measurement.silence();resetDisplay();$('quality').textContent=detected.clipped?L.clipped:detected.rms<Number($('threshold').value)?L.quiet:L.unclear;metrics();return}
    if(tones.length&&Math.abs(C.cents(detected.frequency,C.median(tones.map(t=>t.f))))>120)tones=[];
    tones.push({f:detected.frequency,time});tones=tones.filter(t=>time-t.time<=700).slice(-5);
    const frequency=C.median(tones.map(t=>t.f)),note=C.pitch(frequency,a4()),deviation=mode()==='practice'?C.cents(frequency,C.frequency(target(),a4())):note.cents;
    const offsets=tones.map(t=>C.cents(t.f,frequency)),stable=tones.length>=4&&time-tones[0].time>=400&&Math.max(...offsets)-Math.min(...offsets)<=12,within=Math.abs(deviation)<=tolerance();
    latest={note:note.midi,frequency,deviation};$('detected').textContent=C.name(note.midi,lang,flat());$('frequency').textContent=frequency.toFixed(1)+' Hz';$('deviation').textContent=(deviation>0?'+':'')+Math.round(deviation)+' '+L.unit;
    $('needle').style.left=Math.max(2,Math.min(98,50+deviation))+'%';$('pitchMeter').className='pitch-meter '+(within?'inside':'outside');$('pitchMeter').setAttribute('aria-label',L.cents+': '+Math.round(deviation)+' '+L.unit);
    $('quality').textContent=(stable?L.stable:L.changing)+' '+(within?L.within:L.outside);$('snapshot').disabled=false;
    if(mode()==='practice')measurement.add(time,within);metrics();
  }
  async function startMicrophone(){
    begin('microphone');const token=epoch;pending=true;setBusy(true);tell(L.requesting);
    try {
      if(!window.isSecureContext)throw {name:'InsecureContext'};
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw {name:'Unsupported'};
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw {name:'Unsupported'};
      const audio=new AC();context=audio;const resume=audio.resume();if(resume&&resume.catch)resume.catch(()=>{});
      const requestedStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
      if(token!==epoch){requestedStream.getTracks().forEach(track=>track.stop());return}
      stream=requestedStream;await resume;if(token!==epoch)return;if(audio.state!=='running')throw Error('audio');
      input=audio.createMediaStreamSource(stream);analyser=audio.createAnalyser();analyser.fftSize=audio.sampleRate>64000?8192:4096;analyser.smoothingTimeConstant=0;input.connect(analyser);buffer=new Float32Array(analyser.fftSize);pending=false;running=true;
      for(const track of stream.getTracks())track.onended=()=>{if(token===epoch)stop(L.ended)};
      audio.onstatechange=()=>{if(token===epoch&&running&&audio.state!=='running')stop(L.ended)};
      timer=setInterval(()=>{if(token!==epoch||!analyser)return;analyser.getFloatTimeDomainData(buffer);consume(buffer,audio.sampleRate,performance.now())},140);tell(L.active);
    }catch(error){if(token!==epoch)return;const name=error&&error.name;stop(name==='InsecureContext'?L.secure:name==='Unsupported'?L.unsupported:name==='NotAllowedError'||name==='SecurityError'?L.denied:name==='NotFoundError'?L.missing:name==='NotReadableError'||name==='AbortError'?L.busy:L.audioError)}
  }
  function startDemo(){
    begin('demo');running=true;setBusy(true);tell(L.demoActive);const token=epoch,start=performance.now(),frame=new Float32Array(4096);
    timer=setInterval(()=>{if(token!==epoch)return;const now=performance.now(),elapsed=(now-start)/1000,note=mode()==='practice'?target():[57,60,64][Math.floor(elapsed/4)%3],f=C.frequency(note,a4())*2**(Math.sin(elapsed*1.8)*32/1200);
      for(let i=0;i<frame.length;i++){const phase=2*Math.PI*f*(i/48000+elapsed);frame[i]=.25*Math.sin(phase)+.12*Math.sin(phase*2)+.05*Math.sin(phase*3)}consume(frame,48000,now);
    },140);
  }
  function history(){
    $('history').replaceChildren(...(records.length?records.slice().reverse().map(row=>{const p=document.createElement('p');p.textContent=new Date(row.date).toLocaleString(lang)+' · '+C.name(row.target,lang,flat())+' · '+row.validSeconds.toFixed(1)+' '+L.seconds+' · '+row.inTunePercent+'% (±'+row.tolerance+' '+L.unit+', La4/A4 '+row.a4+' Hz)';return p}):[Object.assign(document.createElement('p'),{textContent:L.empty})]));$('export').disabled=records.length===0;
  }
  $('start').onclick=startMicrophone;$('demo').onclick=startDemo;$('stop').onclick=()=>stop();
  $('hear').onclick=async()=>{stop(L.referenceStopped);try{await window.WalamortSound.play(target()+12*Math.log2(a4()/440))}catch{tell(L.audioError)}};
  $('snapshot').onclick=()=>{if(latest)tell(L.detected+': '+C.name(latest.note,lang,flat())+' · '+latest.frequency.toFixed(1)+' Hz · '+Math.round(latest.deviation)+' '+L.unit)};
  $('save').onclick=()=>{if(!eligible())return tell(source==='demo'?L.demoNoSave:saved?L.recorded:L.needTime);const row={date:new Date().toISOString(),...settings(),validSeconds:Math.round(measurement.validSeconds*100)/100,inTunePercent:measurement.summary().inTunePercent};if(!C.validRecord(row))return tell(L.needTime);try{localStorage.setItem(store,JSON.stringify([...records,row].slice(-30)));records=[...records,row].slice(-30);saved=true;history();metrics();tell(L.saved)}catch{tell(L.saveFailed)}};
  $('export').onclick=()=>{const blob=new Blob([JSON.stringify({version:1,measurements:records},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='walamort-intonation.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);tell(L.downloaded)};
  ['mode','target','a4','tolerance','threshold','spelling'].forEach(id=>$(id).onchange=()=>{stop('');$('a4').value=String(a4());reset();history();tell(L.ready)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop(L.hidden)});window.addEventListener('pagehide',()=>stop(''));
  reset();history();setBusy(false);tell(L.ready);
})();
