(function(root){
  'use strict';
  const keys={C:{root:60,steps:[0,2,4,5,7,9,11],signature:0,flat:false},G:{root:67,steps:[0,2,4,5,7,9,11],signature:1,flat:false},F:{root:65,steps:[0,2,4,5,7,9,11],signature:-1,flat:true},Am:{root:69,steps:[0,2,3,5,7,8,10],signature:0,flat:false},Dm:{root:62,steps:[0,2,3,5,7,8,10],signature:-1,flat:true}};
  const meters={'4/4':{bar:4,total:8,pulse:1,countIn:4},'6/8':{bar:3,total:6,pulse:1.5,countIn:2},'9/8':{bar:4.5,total:9,pulse:1.5,countIn:3},'12/8':{bar:6,total:12,pulse:1.5,countIn:4}};
  const meter=value=>Object.hasOwn(meters,value)?meters[value]:meters['4/4'];
  const durations=[.25,.5,1,1.5,2];
  function random(seed){let state=seed>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}}
  function seed(value){const n=Number(value);return Number.isInteger(n)&&n>=0&&n<=4294967295?n:Math.floor(Math.random()*4294967296)}
  function scale(key){const k=keys[key]||keys.C;return Array.from({length:8},(_,i)=>k.root+(i===7?12:k.steps[i]))}
  function generate(seedValue,key='C',level='easy',meterValue='4/4',ties=false){
    if(!Object.hasOwn(keys,key))key='C';if(!['easy','medium','advanced'].includes(level))level='easy';
    const rnd=random(seedValue),pool=scale(key),patterns=meterValue==='6/8'?(level==='easy'?[[1.5,1.5],[.5,.5,.5,1.5],[1.5,.5,.5,.5]]:level==='medium'?[[.5,.5,.5,.5,.5,.5],[1,.5,1,.5],[1.5,1,.5],[.5,1,.5,1]]:[[.25,.25,.5,.5,1.5],[.5,1,.25,.25,.5,.5],[1,.5,.5,.25,.25,.5]]):level==='easy'?[[1,1,1,1],[2,1,1],[1,1,2]]:level==='medium'?[[1,.5,.5,2],[.5,.5,1,1,1],[1.5,.5,1,1]]:[[.5,1,.5,1,1],[.25,.25,.5,1,1,1],[1,.5,.5,.5,.5,1],[1.5,.5,.5,.5,1]];
    const out=[];let degree=0;
    const expanded=['9/8','12/8'].includes(meterValue),pulsePatterns=level==='easy'?[[1.5],[.5,.5,.5]]:level==='medium'?[[1,.5],[.5,1],[.5,.5,.5],[1.5]]:[[.25,.25,.5,.5],[.5,.25,.25,.5],[1,.25,.25]];
    for(let bar=0;bar<2;bar++){const pattern=expanded?Array.from({length:meter(meterValue).countIn},()=>pulsePatterns[Math.floor(rnd()*pulsePatterns.length)]).flat():patterns[Math.floor(rnd()*patterns.length)];for(const duration of pattern){const limit=level==='easy'?4:7;degree=Math.max(0,Math.min(limit,degree+Math.floor(rnd()*5)-2));const rest=level!=='easy'&&rnd()<(level==='advanced'?.18:.1);out.push({note:rest?null:pool[degree],duration})}}
    out[0].note=keys[key].root;out[out.length-1].note=keys[key].root;
    if(ties){
      const boundary=timeline(out).findIndex(e=>e.beat===meter(meterValue).bar);
      if(boundary>0){if(out[boundary-1].note===null)out[boundary-1].note=keys[key].root;out[boundary].note=out[boundary-1].note;out[boundary].tie=true}
      for(let i=1;i<out.length;i++)if(out[i].note!==null&&out[i].note===out[i-1].note&&rnd()<.35)out[i].tie=true;
    }
    return out;
  }
  function total(events){return events.reduce((sum,n)=>sum+n.duration,0)}
  function validate(events,meterValue='4/4'){const m=meter(meterValue);return Array.isArray(events)&&events.length<=m.total*4&&events.every((e,i)=>e&&durations.includes(e.duration)&&(e.note===null||Number.isInteger(e.note)&&e.note>=60&&e.note<=84)&&(e.tie===undefined||typeof e.tie==='boolean')&&(!e.tie||i>0&&e.note!==null&&e.note===events[i-1].note))&&total(events)<=m.total&&timeline(events).every(e=>Math.floor(e.beat/m.bar)===Math.floor((e.beat+e.duration-.001)/m.bar))}
  function timeline(events){let beat=0;return events.map(e=>{const out={...e,beat};beat+=e.duration;return out})}
  // Tied written notes form one sounding attack; repeated untied notes stay separate.
  function sounding(events){const out=[];for(const e of timeline(events)){const last=out[out.length-1];if(e.tie===true&&e.note!==null&&last&&last.note===e.note){last.duration+=e.duration;last.tied=true}else out.push({note:e.note,duration:e.duration,beat:e.beat,tied:e.tied===true})}return out}
  // A bar preview clips a sustained note at the fragment boundary and rearticulates it.
  function fragment(events,start,length){return sounding(events).filter(e=>e.beat<start+length&&e.beat+e.duration>start).map(e=>({note:e.note,duration:Math.min(e.beat+e.duration,start+length)-Math.max(e.beat,start),tied:e.tied}))}
  function evaluate(expected,actual){
    const target=sounding(expected),answer=sounding(actual);let pitch=0,rhythm=0,correct=0;
    const details=target.map(e=>{const a=answer.find(x=>x.beat===e.beat),pitchOK=!!a&&a.note===e.note,rhythmOK=!!a&&a.duration===e.duration;if(pitchOK)pitch++;if(rhythmOK)rhythm++;if(pitchOK&&rhythmOK)correct++;return {beat:e.beat,expected:e,actual:a||null,pitchOK,rhythmOK}});
    const denom=Math.max(target.length,answer.length,1);return {score:Math.round(correct/denom*100),pitch:Math.round(pitch/denom*100),rhythm:Math.round(rhythm/denom*100),details,extra:answer.filter(a=>!target.some(e=>e.beat===a.beat)).length};
  }
  function spelling(note,flat=false){const sharp=[[0,0],[0,1],[1,0],[1,1],[2,0],[3,0],[3,1],[4,0],[4,1],[5,0],[5,1],[6,0]],flats=[[0,0],[1,-1],[1,0],[2,-1],[2,0],[3,0],[4,-1],[4,0],[5,-1],[5,0],[6,-1],[6,0]];const [letter,accidental]=(flat?flats:sharp)[note%12];return {letter,accidental,octave:Math.floor(note/12)-1}}
  function name(note,lang='es',key='C'){if(note===null)return lang==='en'?'Rest':lang==='pt'?'Pausa':'Silencio';const s=spelling(note,keys[key]?.flat),letters=lang==='en'?['C','D','E','F','G','A','B']:lang==='pt'?['Dó','Ré','Mi','Fá','Sol','Lá','Si']:['Do','Re','Mi','Fa','Sol','La','Si'];return letters[s.letter]+(s.accidental===1?'♯':s.accidental===-1?'♭':'')+s.octave}
  function escape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function score(events,key='C',lang='es',blank=false,meterValue='4/4'){
    const m=meter(meterValue),signature=Object.hasOwn(meters,meterValue)?meterValue.split('/'):['4','4'],barStep=m.bar>4?m.bar*100:365,width=150+barStep*2;
    const k=keys[key]||keys.C;let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' 240" class="notation-score" role="img" aria-label="'+(lang==='en'?'Two bars in treble clef, 4/4':lang==='pt'?'Dois compassos na clave de sol, 4/4':'Dos compases en clave de sol, 4/4').replace('4/4',signature.join('/'))+'">';
    svg+='<rect width="'+width+'" height="240" rx="12" fill="#fff6e8"/>';
    for(let i=0;i<5;i++)svg+='<line x1="24" x2="'+(126+barStep*2)+'" y1="'+(150-i*20)+'" y2="'+(150-i*20)+'" stroke="#321722" stroke-width="1.5"/>';
    svg+='<text x="29" y="146" font-size="86" fill="#321722">𝄞</text><text x="110" y="107" font-size="26" fill="#321722">'+signature[0]+'</text><text x="110" y="137" font-size="26" fill="#321722">'+signature[1]+'</text>';
    if(k.signature)svg+='<text x="86" y="'+(k.signature===1?80:120)+'" font-size="28" fill="#321722">'+(k.signature===1?'♯':'♭')+'</text>';
    for(const x of [119+barStep,120+barStep*2,126+barStep*2])svg+='<line x1="'+x+'" x2="'+x+'" y1="70" y2="150" stroke="#321722" stroke-width="'+(x===126+barStep*2?3:1.5)+'"/>';
    if(!blank){let lastBar=-1,accidentals={},previous=null;for(const e of timeline(events)){
      const bar=Math.floor(e.beat/m.bar);if(bar!==lastBar){lastBar=bar;accidentals={}}
      const x=155+bar*barStep+(e.beat%m.bar)*((barStep-45)/m.bar);
      if(e.note===null){previous=null;if(e.duration===2)svg+='<rect x="'+(x-8)+'" y="102" width="17" height="7" fill="#321722"/>';else if(e.duration>=1)svg+='<path d="M'+(x+4)+' 86 l-9 14 13 13 -12 13 q-7 6 1 14 q-19 -9 -5 -20 l7 -6 -13 -13 12 -18 Z" fill="#321722"/>';else{svg+='<path d="M'+(x+4)+' 100 l-8 37" stroke="#321722" stroke-width="3"/><circle cx="'+(x-2)+'" cy="103" r="5" fill="#321722"/>';if(e.duration===.25)svg+='<circle cx="'+(x-6)+'" cy="117" r="5" fill="#321722"/>'}if(e.duration===1.5)svg+='<circle cx="'+(x+17)+'" cy="110" r="3" fill="#321722"/>';continue}
      const s=spelling(e.note,k.flat),step=s.octave*7+s.letter-30,y=150-step*10;
      for(let i=-2;i>=step;i-=2)svg+='<line x1="'+(x-14)+'" x2="'+(x+14)+'" y1="'+(150-i*10)+'" y2="'+(150-i*10)+'" stroke="#321722" stroke-width="1.5"/>';
      for(let i=10;i<=step;i+=2)svg+='<line x1="'+(x-14)+'" x2="'+(x+14)+'" y1="'+(150-i*10)+'" y2="'+(150-i*10)+'" stroke="#321722" stroke-width="1.5"/>';
      const id=s.letter+':'+s.octave,signature=k.signature===1&&s.letter===3?1:k.signature===-1&&s.letter===6?-1:0,current=accidentals[id]??signature;
      const tied=e.tie===true&&previous&&previous.note===e.note;
      if(s.accidental!==current&&!tied)svg+='<text x="'+(x-25)+'" y="'+(y+8)+'" font-size="23" fill="#321722">'+(s.accidental===0?'♮':s.accidental===1?'♯':'♭')+'</text>';if(!tied)accidentals[id]=s.accidental;
      svg+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="6" transform="rotate(-16 '+x+' '+y+')" fill="'+(e.duration===2?'#fff6e8':'#321722')+'" stroke="#321722" stroke-width="2"/>';
      const down=y<=110,sx=x+(down?-8:8),end=y+(down?43:-43);
      svg+='<line x1="'+sx+'" x2="'+sx+'" y1="'+y+'" y2="'+end+'" stroke="#321722" stroke-width="2"/>';
      if(e.duration<=.5)for(let f=0;f<(e.duration===.25?2:1);f++){const fy=end+(down?-f*10:f*10);svg+='<path d="M'+sx+' '+fy+' q'+(down?-20:20)+' '+(down?-6:6)+' 0 '+(down?-26:26)+'" fill="none" stroke="#321722" stroke-width="3"/>'}
      if(e.duration===1.5)svg+='<circle cx="'+(x+17)+'" cy="'+(step%2===0?y-7:y)+'" r="3" fill="#321722"/>';
      if(tied){const side=down?-1:1,ty=y+side*13;svg+='<path class="notation-tie" d="M'+(previous.x+9)+' '+ty+' Q'+((previous.x+x)/2)+' '+(ty+side*19)+' '+(x-9)+' '+ty+'" fill="none" stroke="#321722" stroke-width="2.5"/>'}
      previous={note:e.note,x};
    }}
    return svg+'</svg>';
  }
  const api={meters,keys,durations,random,seed,scale,generate,total,validate,timeline,sounding,fragment,evaluate,spelling,name,score,escape};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortNotation=api;
})(typeof window==='object'?window:this);
