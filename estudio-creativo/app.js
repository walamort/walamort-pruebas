(() => {
  'use strict';
  const $=id=>document.getElementById(id),en=document.documentElement.lang==='en',lang=en?'en':'es';
  const C=window.WalamortCreative,L=window.WalamortCreativeCopy[lang],P=window.WalamortCreativePlayer;
  const storage='walamort-creative-v1:'+(window.location.pathname.includes('/walamort-pruebas/')?'preview':'site');
  let project=C.blank(),selected=0,history=[],playing=false;project.instrument=window.WalamortSound.instrument();
  try {const raw=localStorage.getItem(storage);if(raw)project=C.validate(JSON.parse(raw))}catch{}
  const params=new URLSearchParams(window.location.search);
  if(C.KEYS[params.get('key')]&&/^[0-6]$/.test(params.get('degree')||'')) {
    project.key=params.get('key');project.chords[0]={degree:Number(params.get('degree')),seventh:params.get('seventh')==='1',inversion:0};
    const inv=Number(params.get('inversion'));if(Number.isInteger(inv)&&inv>=0&&inv<=(project.chords[0].seventh?3:2))project.chords[0].inversion=inv;
  }
  function node(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n}
  function option(value,text){const o=node('option',text);o.value=value;return o}
  function remember(){history.push(C.validate(project));if(history.length>30)history.shift()}
  function change(fn){if(playing)return;remember();fn();render()}
  function tell(text){$('status').textContent=text}
  function chordLabel(c){const a=C.chord(project.key,c.degree,c.seventh,c.inversion);return a.roman+' · '+C.noteName(a.root,lang,C.KEYS[project.key].flat).replace(/\d+$/,'')+a.suffix}
  function mark(step){Array.from($('steps').querySelectorAll('button')).forEach((b,i)=>b.classList.toggle('playing',i===step))}
  function preview(notes){P.play(notes.map(note=>({note,beat:0,duration:1,instrument:project.instrument})),90,()=>{},()=>{},1.2,false).catch(()=>tell(L.audioError))}
  function put(note){if(playing)return;change(()=>{project.melody[selected]=note;if($('advance').checked)selected=(selected+1)%16});if(note!==null)preview([note])}
  function render() {
    $('title').value=project.title;$('key').value=project.key;$('tempo').value=project.tempo;$('instrument').value=project.instrument;
    $('undo').disabled=history.length===0;
    $('steps').replaceChildren(...Array.from({length:4},(_,bar)=>{
      const group=node('fieldset'),legend=node('legend',L.bar+' '+(bar+1));group.append(legend);
      for(let beat=0;beat<4;beat++){const i=bar*4+beat,n=project.melody[i],button=node('button',n===null?'—':C.noteName(n,lang,C.KEYS[project.key].flat));button.type='button';button.setAttribute('aria-label',L.bar+' '+(bar+1)+', '+L.beat+' '+(beat+1)+': '+(n===null?L.rest:button.textContent));button.setAttribute('aria-pressed',String(i===selected));button.onclick=()=>{selected=i;render();if(n!==null)preview([n])};group.append(button)}return group;
    }));
    $('selected').textContent=L.selected+': '+(selected+1)+' / 16';
    $('pitch').replaceChildren(option('rest',L.rest),...Array.from({length:37},(_,i)=>option(String(48+i),C.noteName(48+i,lang,C.KEYS[project.key].flat))));
    $('pitch').value=project.melody[selected]===null?'rest':String(project.melody[selected]);
    $('piano').replaceChildren(...Array.from({length:25},(_,i)=>60+i).filter(n=>C.scale(project.key).includes(n%12)).map(n=>{const b=node('button',C.noteName(n,lang,C.KEYS[project.key].flat));b.type='button';b.onclick=()=>put(n);return b}));
    $('bars').replaceChildren(...project.chords.map((c,i)=>{
      const group=node('fieldset'),legend=node('legend',L.bar+' '+(i+1));group.append(legend);
      const degree=node('select');degree.setAttribute('aria-label',L.bar+' '+(i+1)+' · '+L.degree);degree.replaceChildren(...Array.from({length:7},(_,d)=>option(String(d),chordLabel({...c,degree:d}))));degree.value=String(c.degree);degree.onchange=()=>change(()=>project.chords[i].degree=Number(degree.value));
      const seventh=node('input');seventh.type='checkbox';seventh.checked=c.seventh;const label=node('label');label.className='inline-check';label.append(seventh,node('span',L.seventh));seventh.onchange=()=>change(()=>{project.chords[i].seventh=seventh.checked;if(!seventh.checked&&project.chords[i].inversion===3)project.chords[i].inversion=2});
      const inversion=node('select');inversion.setAttribute('aria-label',L.bar+' '+(i+1)+' · '+L.inversion);inversion.replaceChildren(...L.inversions.slice(0,c.seventh?4:3).map((name,i)=>option(String(i),name)));inversion.value=String(c.inversion);inversion.onchange=()=>change(()=>project.chords[i].inversion=Number(inversion.value));
      const hear=node('button',L.hear);hear.type='button';hear.onclick=()=>preview(C.chord(project.key,c.degree,c.seventh,c.inversion).notes);
      const pitches=node('p',C.chord(project.key,c.degree,c.seventh,c.inversion).notes.map(n=>C.noteName(n,lang,C.KEYS[project.key].flat)).join(' · '));group.append(degree,label,inversion,hear,pitches);return group;
    }));
    const o=C.observations(project),lines=[];
    if(!o.count)lines.push(L.empty);else{lines.push(o.count+' '+L.count);if(o.outside.length)lines.push(L.outside+': '+o.outside.map(i=>i+1).join(', '));if(o.leaps.length)lines.push(L.leaps+': '+o.leaps.map(i=>i+1).join(', '));if(o.strong.length)lines.push(L.strong+': '+o.strong.map(i=>i+1).join(', '));if(!o.outside.length&&!o.leaps.length)lines.push(L.none)}
    $('observations').replaceChildren(...lines.map(text=>node('p',text)));
    $('worksheet').replaceChildren(node('h2',project.title||L.studio),node('p',L.keys[Object.keys(C.KEYS).indexOf(project.key)]+' · 4/4 · '+project.tempo+' BPM'),...project.chords.map((c,i)=>node('p',L.bar+' '+(i+1)+' · '+chordLabel(c)+' | '+project.melody.slice(i*4,i*4+4).map(n=>n===null?L.rest:C.noteName(n,lang,C.KEYS[project.key].flat)).join(' · '))));
  }
  P.setStateListener((value,lock)=>{playing=value&&lock;value=playing;['editor','settings','files'].forEach(id=>$(id).disabled=value);$('play').disabled=value;$('stop').disabled=!value;if(!value)mark(-1)});
  $('title').oninput=()=>{const title=$('title').value.slice(0,100);if(title!==project.title){remember();project.title=title;$('undo').disabled=false}};
  $('title').onchange=()=>{project.title=$('title').value.trim().slice(0,100);render()};
  $('key').onchange=()=>change(()=>project.key=$('key').value);
  $('tempo').onchange=()=>change(()=>{const v=Number($('tempo').value);project.tempo=Number.isFinite(v)?Math.max(45,Math.min(160,Math.round(v))):90});
  $('instrument').addEventListener('change',()=>change(()=>project.instrument=$('instrument').value));
  $('pitch').onchange=()=>put($('pitch').value==='rest'?null:Number($('pitch').value));
  $('nextStep').onclick=()=>{selected=(selected+1)%16;render()};$('rest').onclick=()=>put(null);
  $('undo').onclick=()=>{if(history.length&&!playing){project=history.pop();render()}};
  $('example').onclick=()=>change(()=>{const pcs=C.scale(project.key),root=60+C.KEYS[project.key].root;project.melody=[0,2,4,2,3,5,4,3,4,6,5,4,2,1,0,null].map(i=>i===null?null:root+((pcs[i]-C.KEYS[project.key].root+12)%12));selected=0});
  $('repeat').onclick=()=>change(()=>{const motif=project.melody.slice(0,4);project.melody=Array.from({length:4},()=>motif.slice()).flat()});
  $('reverse').onclick=()=>change(()=>project.melody.splice(0,4,...project.melody.slice(0,4).reverse()));
  function transpose(delta){if(project.melody.some(n=>n!==null&&(n+delta<48||n+delta>84)))return tell(L.range);change(()=>project.melody=project.melody.map(n=>n===null?null:n+delta))}
  $('up').onclick=()=>transpose(1);$('down').onclick=()=>transpose(-1);
  $('play').onclick=()=>{const beat=60/project.tempo,events=[];project.melody.forEach((note,i)=>{if(note!==null)events.push({note,beat:i,duration:.9,instrument:project.instrument})});project.chords.forEach((c,i)=>C.chord(project.key,c.degree,c.seventh,c.inversion).notes.forEach(note=>events.push({note,beat:i*4,duration:3.8,instrument:project.instrument})));tell(L.playing);P.play(events,project.tempo,mark,()=>tell(L.finished)).catch(()=>tell(L.audioError))};
  $('stop').onclick=()=>{P.stop();tell(L.stopped)};
  $('save').onclick=()=>{try{localStorage.setItem(storage,JSON.stringify(C.validate(project)));tell(L.saved)}catch{tell(L.saveFailed)}};
  function download(data,type,extension){const blob=new Blob([data],{type}),url=URL.createObjectURL(blob),link=node('a');link.href=url;link.download=(project.title||'walamort').normalize('NFKD').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,60)+extension;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);tell(L.downloaded)}
  $('json').onclick=()=>download(JSON.stringify(C.validate(project),null,2),'application/json','.json');
  $('midi').onclick=()=>download(C.midi(project),'audio/midi','.mid');
  $('load').onchange=async()=>{const file=$('load').files[0];if(!file)return;try{if(file.size>65536)throw Error('size');const loaded=C.validate(JSON.parse(await file.text()));P.stop();remember();project=loaded;selected=0;render();tell(L.imported)}catch{tell(L.invalid)}finally{$('load').value=''}};
  $('clear').onclick=()=>{if(window.confirm(L.confirm)){change(()=>{project=C.blank();selected=0});tell(L.ready)}};
  $('print').onclick=()=>{render();window.print()};
  const date=new Date(),day=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),challenge=C.challenge(day);
  $('challengeTitle').textContent=L.challengeTitles[challenge];$('challengeText').textContent=L.challengeTexts[challenge];
  render();$('stop').disabled=true;tell(L.ready);
})();
