(() => {
  'use strict';
  const $=id=>document.getElementById(id),lang=document.documentElement.lang==='en'?'en':'es',en=lang==='en';
  const C=window.WalamortCreative,L=window.WalamortCreativeCopy[lang],P=window.WalamortCreativePlayer;
  let busy=false;
  function option(value,text){const n=document.createElement('option');n.value=value;n.textContent=text;return n}
  function current(){return C.chord($('key').value,Number($('degree').value),$('seventh').checked,Number($('inversion').value))}
  function hear(notes,sequence=false){const events=notes.map((note,i)=>({note,beat:sequence?i:0,duration:.9,instrument:$('instrument').value}));P.play(events,80,()=>{},()=>{$('status').textContent=L.finished},sequence?notes.length:1.2).catch(()=>{$('status').textContent=L.audioError})}
  function render(){
    const key=$('key').value,seventh=$('seventh').checked;
    const selected=$('degree').value||'0';
    $('degree').replaceChildren(...Array.from({length:7},(_,i)=>{const c=C.chord(key,i,seventh,0);return option(String(i),c.roman+' · '+C.noteName(c.root,lang,C.KEYS[key].flat).replace(/\d+$/,'')+c.suffix)}));$('degree').value=selected;
    const inversion=Math.min(Number($('inversion').value)||0,seventh?3:2);
    $('inversion').replaceChildren(...L.inversions.slice(0,seventh?4:3).map((name,i)=>option(String(i),name)));$('inversion').value=String(inversion);
    const c=current(),names=c.notes.map(n=>C.noteName(n,lang,C.KEYS[key].flat));
    $('chordName').textContent=c.roman+' · '+C.noteName(c.root,lang,C.KEYS[key].flat).replace(/\d+$/,'')+c.suffix;
    $('notes').textContent=L.notes+': '+names.join(' · ');$('bass').textContent=L.bass+': '+names[0];
    const rootChord=C.chord(key,Number($('degree').value),seventh,0);
    $('formula').textContent=L.formula+': '+rootChord.notes.map(n=>n-rootChord.root).join(' – ');
    $('minorNote').hidden=C.KEYS[key].mode!=='minor';
    $('keyboard').replaceChildren(...Array.from({length:37},(_,i)=>48+i).map(n=>{const b=document.createElement('button');b.type='button';b.textContent=C.noteName(n,lang,C.KEYS[key].flat);b.className='chord-key'+(c.notes.includes(n)?' active':'');b.setAttribute('aria-pressed',String(c.notes.includes(n)));b.onclick=()=>hear([n]);return b}));
    const url=new URL('../estudio-creativo/',window.location.href);url.searchParams.set('key',key);url.searchParams.set('degree',$('degree').value);url.searchParams.set('seventh',seventh?'1':'0');url.searchParams.set('inversion',$('inversion').value);$('create').href=url.pathname+url.search;
  }
  $('instrument').addEventListener('change',()=>P.stop());
  for(const id of ['key','degree','seventh','inversion'])$(id).onchange=()=>{P.stop();render()};
  $('hear').onclick=()=>{const c=current();$('status').textContent=L.playing;hear(c.notes)};
  $('arpeggio').onclick=()=>{const c=current();$('status').textContent=L.playing;hear(c.notes,true)};
  $('cadence').onclick=()=>{const events=[];[0,3,4,0].forEach((d,i)=>C.chord($('key').value,d,false,0).notes.forEach(note=>events.push({note,beat:i*4,duration:3.8,instrument:$('instrument').value})));$('status').textContent=L.playing;P.play(events,90,()=>{},()=>{$('status').textContent=L.finished},16).catch(()=>{$('status').textContent=L.audioError})};
  $('stop').onclick=()=>{P.stop();$('status').textContent=L.stopped};
  P.setStateListener(value=>{busy=value;$('hear').disabled=value;$('arpeggio').disabled=value;$('cadence').disabled=value;$('stop').disabled=!value});
  render();$('stop').disabled=true;$('status').textContent=L.ready;
})();
