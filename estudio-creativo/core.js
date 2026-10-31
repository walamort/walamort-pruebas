(function (root) {
  'use strict';
  const KEYS = {
    C: {root: 0, mode: 'major', flat: false}, G: {root: 7, mode: 'major', flat: false},
    F: {root: 5, mode: 'major', flat: true}, Am: {root: 9, mode: 'minor', flat: false},
    Dm: {root: 2, mode: 'minor', flat: true}
  };
  const scales = {major: [0,2,4,5,7,9,11], minor: [0,2,3,5,7,8,10]};
  const instruments = ['piano','guitar','flute','violin'];
  function noteName(midi, lang='es', flat=false) {
    const names = lang==='en' ? (flat ? ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'] : ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B']) : (flat ? ['Do','Re♭','Re','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si'] : ['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si']);
    return names[((midi%12)+12)%12] + (Math.floor(midi/12)-1);
  }
  function scale(key) { const k=KEYS[key]||KEYS.C;return scales[k.mode].map(n=>(n+k.root)%12); }
  function chord(key, degree=0, seventh=false, inversion=0) {
    const k=KEYS[key]||KEYS.C,s=scales[k.mode],d=Math.max(0,Math.min(6,degree|0));
    const pitch=i=>48+k.root+s[i%7]+12*Math.floor(i/7);
    let notes=Array.from({length:seventh?4:3},(_,i)=>pitch(d+i*2));
    const third=notes[1]-notes[0],fifth=notes[2]-notes[0];
    const quality=fifth===6?'dim':third===3?'minor':'major';
    const seventhInterval=seventh?notes[3]-notes[0]:null;
    let suffix=quality==='dim'?'dim':quality==='minor'?'m':'';
    if(seventh)suffix=quality==='dim'?'m7♭5':quality==='minor'?'m7':seventhInterval===11?'maj7':'7';
    let roman=['I','II','III','IV','V','VI','VII'][d];
    if(quality!=='major')roman=roman.toLowerCase();
    if(quality==='dim')roman+=seventh?'ø7':'°';else if(seventh)roman+=seventhInterval===11?'maj7':'7';
    const root=notes[0],inv=Math.max(0,Math.min(notes.length-1,inversion|0));
    for(let i=0;i<inv;i++)notes.push(notes.shift()+12);
    return {notes,root,quality,roman,suffix,inversion:inv};
  }
  function validate(raw) {
    if(!raw||raw.version!==1||!KEYS[raw.key]||!instruments.includes(raw.instrument))throw Error('project');
    if(typeof raw.title!=='string'||raw.title.length>100||!Number.isInteger(raw.tempo)||raw.tempo<45||raw.tempo>160)throw Error('project');
    if(!Array.isArray(raw.melody)||raw.melody.length!==16||!raw.melody.every(n=>n===null||(Number.isInteger(n)&&n>=48&&n<=84)))throw Error('project');
    if(!Array.isArray(raw.chords)||raw.chords.length!==4||!raw.chords.every(c=>c&&Number.isInteger(c.degree)&&c.degree>=0&&c.degree<=6&&typeof c.seventh==='boolean'&&Number.isInteger(c.inversion)&&c.inversion>=0&&c.inversion<=(c.seventh?3:2)))throw Error('project');
    return {version:1,title:raw.title,key:raw.key,tempo:raw.tempo,instrument:raw.instrument,melody:raw.melody.slice(),chords:raw.chords.map(c=>({degree:c.degree,seventh:c.seventh,inversion:c.inversion}))};
  }
  function blank() { return {version:1,title:'',key:'C',tempo:90,instrument:'piano',melody:Array(16).fill(null),chords:[0,3,4,0].map(degree=>({degree,seventh:false,inversion:0}))}; }
  function observations(project) {
    const pcs=scale(project.key),outside=project.melody.map((n,i)=>n!==null&&!pcs.includes(n%12)?i:null).filter(n=>n!==null);
    const leaps=[];let last=null;project.melody.forEach((n,i)=>{if(n!==null){if(last!==null&&Math.abs(n-last)>7)leaps.push(i);last=n}});
    const strong=[];for(let i=0;i<16;i+=4){const n=project.melody[i],c=project.chords[i/4];if(n!==null&&!chord(project.key,c.degree,c.seventh,c.inversion).notes.some(x=>x%12===n%12))strong.push(i)}
    return {outside,leaps,strong,count:project.melody.filter(n=>n!==null).length};
  }
  function vlq(n) { let bytes=[n&127];while(n>>=7)bytes.unshift((n&127)|128);return bytes; }
  function midi(raw) {
    const p=validate(raw),events=[],tempo=Math.round(60000000/p.tempo),program={piano:0,guitar:24,flute:73,violin:40}[p.instrument];
    function add(tick,data,order=1){events.push({tick,data,order})}
    add(0,[255,81,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255],-2);
    add(0,[255,88,4,4,2,24,8],-2);add(0,[192,program],-1);add(0,[193,program],-1);
    p.melody.forEach((n,i)=>{if(n!==null){add(i*96,[144,n,88]);add((i+1)*96,[128,n,0],0)}});
    p.chords.forEach((c,i)=>chord(p.key,c.degree,c.seventh,c.inversion).notes.forEach(n=>{add(i*384,[145,n,58]);add((i+1)*384,[129,n,0],0)}));
    events.sort((a,b)=>a.tick-b.tick||a.order-b.order);let last=0,track=[];
    for(const e of events){track.push(...vlq(e.tick-last),...e.data);last=e.tick}
    track.push(...vlq(1536-last),255,47,0);
    const len=track.length;return new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,0,96,77,84,114,107,(len>>>24)&255,(len>>>16)&255,(len>>>8)&255,len&255,...track]);
  }
  function challenge(date) { const str=date||new Date().toISOString().slice(0,10);return [...str].reduce((n,c)=>n+c.charCodeAt(0),0)%4; }
  const api={KEYS,scale,chord,noteName,validate,blank,observations,midi,challenge};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortCreative=api;
})(typeof window==='object'?window:this);
