(function(root){
  'use strict';
  const CLEFS={treble:{base:30,sharp:[38,35,39],flat:[34,37,33]},bass:{base:18,sharp:[24,21,25],flat:[20,23,19]},alto:{base:24,sharp:[31,28,32],flat:[27,30,26]}};
  const KEYS={C:0,G:1,D:2,A:3,F:-1,Bb:-2,Eb:-3},natural=[0,2,4,5,7,9,11];
  function signature(key){const count=KEYS[key]??0,out=Array(7).fill(0),order=count>0?[3,0,4]:[6,2,5];for(let i=0;i<Math.abs(count);i++)out[order[i]]=Math.sign(count);return out}
  function midi(position,alteration=0){return (Math.floor(position/7)+1)*12+natural[((position%7)+7)%7]+alteration}
  function name(position,alteration=0,lang='es'){const names=lang==='en'?['C','D','E','F','G','A','B']:['Do','Re','Mi','Fa','Sol','La','Si'];return names[((position%7)+7)%7]+(alteration===1?'♯':alteration===-1?'♭':'')+Math.floor(position/7)}
  function shuffle(values,rnd=Math.random){const out=values.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
  function question(clef='treble',key='C',level='easy',rnd=Math.random,previous=null){
    if(!Object.hasOwn(CLEFS,clef))clef='treble';if(!Object.hasOwn(KEYS,key))key='C';if(!['easy','medium','advanced'].includes(level))level='easy';
    const low=level==='easy'?0:level==='medium'?-2:-4,high=level==='easy'?8:level==='medium'?10:12;
    const pool=Array.from({length:high-low+1},(_,i)=>CLEFS[clef].base+low+i).filter(p=>p!==previous),position=pool[Math.floor(rnd()*pool.length)];
    const base=signature(key)[position%7];let alteration=base,explicit=null;
    if(level==='advanced'&&rnd()<.4){alteration=shuffle([-1,0,1].filter(a=>a!==base),rnd)[0];explicit=alteration}
    const target={position,alteration};
    const options=[target,{position:position+7,alteration},{position,alteration:alteration===0?(KEYS[key]<0?-1:1):0},{position:position===high+CLEFS[clef].base?position-1:position+1,alteration:signature(key)[(position===high+CLEFS[clef].base?position-1:position+1)%7]}];
    return {clef,key,position,alteration,explicit,options:shuffle(options,rnd),midi:midi(position,alteration)};
  }
  function correct(question,answer){return !!answer&&answer.position===question.position&&answer.alteration===question.alteration}
  function summarize(rows){const responses=rows.filter(r=>!r.timeout&&Number.isFinite(r.ms));return {score:Math.round(rows.filter(r=>r.correct).length/Math.max(rows.length,1)*100),correct:rows.filter(r=>r.correct).length,timeouts:rows.filter(r=>r.timeout).length,average:responses.length?Math.round(responses.reduce((n,r)=>n+r.ms,0)/responses.length):null}}
  function staff(q,blank=false,lang='es'){
    const c=CLEFS[q.clef]||CLEFS.treble,count=KEYS[q.key]??0;let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 240" role="img" aria-label="'+(lang==='en'?(blank?'Staff':'Identify the note'):(blank?'Pentagrama':'Identifica la nota'))+'"><rect width="500" height="240" rx="14" fill="#fff6e8"/>';
    for(let i=0;i<5;i++)svg+='<line x1="24" x2="475" y1="'+(150-i*20)+'" y2="'+(150-i*20)+'" stroke="#321722" stroke-width="1.5"/>';
    if(q.clef==='bass')svg+='<path d="M38 94 C20 78 36 60 54 69 C86 84 75 124 25 147 C58 124 74 96 57 82 C48 74 32 80 38 94 Z" fill="#321722"/><circle cx="39" cy="87" r="6" fill="#321722"/><circle cx="78" cy="80" r="3" fill="#321722"/><circle cx="78" cy="100" r="3" fill="#321722"/>';
    else if(q.clef==='alto')svg+='<g transform="translate(-12,-10)" fill="#321722"><rect x="46" y="80" width="7" height="80"/><rect x="57" y="80" width="3" height="80"/><path d="M65 120 L75 108 L80 120 L75 132 Z M76 82 C111 70 116 111 84 120 C116 129 111 170 76 158 L76 150 C98 159 101 134 81 128 L76 120 L81 112 C101 106 98 81 76 90 Z"/></g>';
    else svg+='<text x="25" y="146" font-size="86" fill="#321722">𝄞</text>';
    const positions=count>0?c.sharp:c.flat;for(let i=0;i<Math.abs(count);i++)svg+='<text x="'+(105+i*23)+'" y="'+(150-(positions[i]-c.base)*10+9)+'" font-size="30" fill="#321722">'+(count>0?'♯':'♭')+'</text>';
    if(!blank){const step=q.position-c.base,y=150-step*10,x=330;
      for(let i=-2;i>=step;i-=2)svg+='<line x1="314" x2="346" y1="'+(150-i*10)+'" y2="'+(150-i*10)+'" stroke="#321722" stroke-width="2"/>';
      for(let i=10;i<=step;i+=2)svg+='<line x1="314" x2="346" y1="'+(150-i*10)+'" y2="'+(150-i*10)+'" stroke="#321722" stroke-width="2"/>';
      if(q.explicit!==null)svg+='<text x="294" y="'+(y+9)+'" font-size="30" fill="#321722">'+(q.explicit===0?'♮':q.explicit===1?'♯':'♭')+'</text>';
      svg+='<ellipse cx="330" cy="'+y+'" rx="12" ry="8" transform="rotate(-15 330 '+y+')" fill="#321722"/><line x1="'+(y<=110?319:341)+'" x2="'+(y<=110?319:341)+'" y1="'+y+'" y2="'+(y+(y<=110?48:-48))+'" stroke="#321722" stroke-width="2.5"/>';
    }
    return svg+'</svg>';
  }
  const api={CLEFS,KEYS,signature,midi,name,shuffle,question,correct,summarize,staff};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortSightReading=api;
})(typeof window==='object'?window:this);
