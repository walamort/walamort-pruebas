(function(root){
  'use strict';
  const keys={C:{root:60,steps:[0,2,4,5,7,9,11],signature:0,flat:false},G:{root:67,steps:[0,2,4,5,7,9,11],signature:1,flat:false},F:{root:65,steps:[0,2,4,5,7,9,11],signature:-1,flat:true},Am:{root:69,steps:[0,2,3,5,7,8,10],signature:0,flat:false},Dm:{root:62,steps:[0,2,3,5,7,8,10],signature:-1,flat:true}};
  const durations=[.25,.5,1,1.5,2];
  function random(seed){let state=seed>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}}
  function seed(value){const n=Number(value);return Number.isInteger(n)&&n>=0&&n<=4294967295?n:Math.floor(Math.random()*4294967296)}
  function scale(key){const k=keys[key]||keys.C;return Array.from({length:8},(_,i)=>k.root+(i===7?12:k.steps[i]))}
  function generate(seedValue,key='C',level='easy'){
    if(!keys[key])key='C';if(!['easy','medium','advanced'].includes(level))level='easy';
    const rnd=random(seedValue),pool=scale(key),patterns=level==='easy'?[[1,1,1,1],[2,1,1],[1,1,2]]:level==='medium'?[[1,.5,.5,2],[.5,.5,1,1,1],[1.5,.5,1,1]]:[[.5,1,.5,1,1],[.25,.25,.5,1,1,1],[1,.5,.5,.5,.5,1],[1.5,.5,.5,.5,1]];
    const out=[];let degree=0;
    for(let bar=0;bar<2;bar++){const pattern=patterns[Math.floor(rnd()*patterns.length)];for(const duration of pattern){const limit=level==='easy'?4:7;degree=Math.max(0,Math.min(limit,degree+Math.floor(rnd()*5)-2));const rest=level!=='easy'&&rnd()<(level==='advanced'?.18:.1);out.push({note:rest?null:pool[degree],duration})}}
    out[0].note=keys[key].root;out[out.length-1].note=keys[key].root;return out;
  }
  function total(events){return events.reduce((sum,n)=>sum+n.duration,0)}
  function validate(events){return Array.isArray(events)&&events.length<=32&&events.every(e=>e&&durations.includes(e.duration)&&(e.note===null||Number.isInteger(e.note)&&e.note>=60&&e.note<=84))&&total(events)<=8&&timeline(events).every(e=>Math.floor(e.beat/4)===Math.floor((e.beat+e.duration-.001)/4))}
  function timeline(events){let beat=0;return events.map(e=>{const out={...e,beat};beat+=e.duration;return out})}
  function evaluate(expected,actual){
    const target=timeline(expected),answer=timeline(actual);let pitch=0,rhythm=0,correct=0;
    const details=target.map(e=>{const a=answer.find(x=>x.beat===e.beat),pitchOK=!!a&&a.note===e.note,rhythmOK=!!a&&a.duration===e.duration;if(pitchOK)pitch++;if(rhythmOK)rhythm++;if(pitchOK&&rhythmOK)correct++;return {beat:e.beat,expected:e,actual:a||null,pitchOK,rhythmOK}});
    const denom=Math.max(expected.length,actual.length,1);return {score:Math.round(correct/denom*100),pitch:Math.round(pitch/denom*100),rhythm:Math.round(rhythm/denom*100),details,extra:answer.filter(a=>!target.some(e=>e.beat===a.beat)).length};
  }
  function spelling(note,flat=false){const sharp=[[0,0],[0,1],[1,0],[1,1],[2,0],[3,0],[3,1],[4,0],[4,1],[5,0],[5,1],[6,0]],flats=[[0,0],[1,-1],[1,0],[2,-1],[2,0],[3,0],[4,-1],[4,0],[5,-1],[5,0],[6,-1],[6,0]];const [letter,accidental]=(flat?flats:sharp)[note%12];return {letter,accidental,octave:Math.floor(note/12)-1}}
  function name(note,lang='es',key='C'){if(note===null)return lang==='en'?'Rest':'Silencio';const s=spelling(note,keys[key]?.flat),letters=lang==='en'?['C','D','E','F','G','A','B']:['Do','Re','Mi','Fa','Sol','La','Si'];return letters[s.letter]+(s.accidental===1?'♯':s.accidental===-1?'♭':'')+s.octave}
  function escape(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function score(events,key='C',lang='es',blank=false){
    const k=keys[key]||keys.C;let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 240" class="notation-score" role="img" aria-label="'+(lang==='en'?'Two bars in treble clef, 4/4':'Dos compases en clave de sol, 4/4')+'">';
    svg+='<rect width="880" height="240" rx="12" fill="#fff6e8"/>';
    for(let i=0;i<5;i++)svg+='<line x1="24" x2="856" y1="'+(150-i*20)+'" y2="'+(150-i*20)+'" stroke="#321722" stroke-width="1.5"/>';
    svg+='<text x="29" y="146" font-size="86" fill="#321722">𝄞</text><text x="110" y="107" font-size="26" fill="#321722">4</text><text x="110" y="137" font-size="26" fill="#321722">4</text>';
    if(k.signature)svg+='<text x="86" y="'+(k.signature===1?80:120)+'" font-size="28" fill="#321722">'+(k.signature===1?'♯':'♭')+'</text>';
    for(const x of [484,850,856])svg+='<line x1="'+x+'" x2="'+x+'" y1="70" y2="150" stroke="#321722" stroke-width="'+(x===856?3:1.5)+'"/>';
    if(!blank){let lastBar=-1,accidentals={};for(const e of timeline(events)){
      const bar=Math.floor(e.beat/4);if(bar!==lastBar){lastBar=bar;accidentals={}}
      const x=155+bar*365+(e.beat%4)*80;
      if(e.note===null){if(e.duration===2)svg+='<rect x="'+(x-8)+'" y="102" width="17" height="7" fill="#321722"/>';else if(e.duration>=1)svg+='<path d="M'+(x+4)+' 86 l-9 14 13 13 -12 13 q-7 6 1 14 q-19 -9 -5 -20 l7 -6 -13 -13 12 -18 Z" fill="#321722"/>';else{svg+='<path d="M'+(x+4)+' 100 l-8 37" stroke="#321722" stroke-width="3"/><circle cx="'+(x-2)+'" cy="103" r="5" fill="#321722"/>';if(e.duration===.25)svg+='<circle cx="'+(x-6)+'" cy="117" r="5" fill="#321722"/>'}if(e.duration===1.5)svg+='<circle cx="'+(x+17)+'" cy="110" r="3" fill="#321722"/>';continue}
      const s=spelling(e.note,k.flat),step=s.octave*7+s.letter-30,y=150-step*10;
      for(let i=-2;i>=step;i-=2)svg+='<line x1="'+(x-14)+'" x2="'+(x+14)+'" y1="'+(150-i*10)+'" y2="'+(150-i*10)+'" stroke="#321722" stroke-width="1.5"/>';
      for(let i=10;i<=step;i+=2)svg+='<line x1="'+(x-14)+'" x2="'+(x+14)+'" y1="'+(150-i*10)+'" y2="'+(150-i*10)+'" stroke="#321722" stroke-width="1.5"/>';
      const id=s.letter+':'+s.octave,signature=k.signature===1&&s.letter===3?1:k.signature===-1&&s.letter===6?-1:0,current=accidentals[id]??signature;
      if(s.accidental!==current)svg+='<text x="'+(x-25)+'" y="'+(y+8)+'" font-size="23" fill="#321722">'+(s.accidental===0?'♮':s.accidental===1?'♯':'♭')+'</text>';accidentals[id]=s.accidental;
      svg+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="6" transform="rotate(-16 '+x+' '+y+')" fill="'+(e.duration===2?'#fff6e8':'#321722')+'" stroke="#321722" stroke-width="2"/>';
      const down=y<=110,sx=x+(down?-8:8),end=y+(down?43:-43);
      svg+='<line x1="'+sx+'" x2="'+sx+'" y1="'+y+'" y2="'+end+'" stroke="#321722" stroke-width="2"/>';
      if(e.duration<=.5)for(let f=0;f<(e.duration===.25?2:1);f++){const fy=end+(down?-f*10:f*10);svg+='<path d="M'+sx+' '+fy+' q'+(down?-20:20)+' '+(down?-6:6)+' 0 '+(down?-26:26)+'" fill="none" stroke="#321722" stroke-width="3"/>'}
      if(e.duration===1.5)svg+='<circle cx="'+(x+17)+'" cy="'+(step%2===0?y-7:y)+'" r="3" fill="#321722"/>';
    }}
    return svg+'</svg>';
  }
  const api={keys,durations,random,seed,scale,generate,total,validate,timeline,evaluate,spelling,name,score,escape};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortNotation=api;
})(typeof window==='object'?window:this);
