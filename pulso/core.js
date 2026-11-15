(function(root){'use strict';
const instruments=[
{id:'guitar',names:['Guitarra','Guitar','Violão'],family:'strings',tunings:[['standard','Estándar / Standard',[40,45,50,55,59,64]],['dropD','Drop D',[38,45,50,55,59,64]],['dadgad','DADGAD',[38,45,50,55,57,62]],['openG','Open G',[38,43,50,55,59,62]],['openD','Open D',[38,45,50,54,57,62]],['halfDown','−½ tono / step',[39,44,49,54,58,63]]]},
{id:'guitar7',names:['Guitarra · 7 cuerdas','7-string guitar','Violão · 7 cordas'],family:'strings',tunings:[['standard','B–E–A–D–G–B–E',[35,40,45,50,55,59,64]]]},
{id:'bass',names:['Bajo','Bass','Baixo'],family:'strings',tunings:[['four','4 · E–A–D–G',[28,33,38,43]],['dropD','4 · Drop D',[26,33,38,43]],['five','5 · B–E–A–D–G',[23,28,33,38,43]],['six','6 · B–E–A–D–G–C',[23,28,33,38,43,48]]]},
{id:'ukulele',names:['Ukelele','Ukulele','Ukulele'],family:'strings',tunings:[['highG','G4–C4–E4–A4',[67,60,64,69]],['lowG','G3–C4–E4–A4',[55,60,64,69]]]},
{id:'violin',names:['Violín','Violin','Violino'],family:'strings',tunings:[['standard','G3–D4–A4–E5',[55,62,69,76]]]},
{id:'viola',names:['Viola','Viola','Viola'],family:'strings',tunings:[['standard','C3–G3–D4–A4',[48,55,62,69]]]},
{id:'cello',names:['Violonchelo','Cello','Violoncelo'],family:'strings',tunings:[['standard','C2–G2–D3–A3',[36,43,50,57]]]},
{id:'mandolin',names:['Mandolina · por orden','Mandolin · per course','Bandolim · por ordem'],family:'strings',tunings:[['standard','G3–D4–A4–E5',[55,62,69,76]]]},
{id:'wind',names:['Vientos · cromático','Winds · chromatic','Sopros · cromático'],family:'wind',tunings:[['concert','Concert · C',[]],['bb','B♭ · −2',[]],['eb','E♭ · −9',[]],['f','F · −7',[]],['tenor','B♭ tenor · −14',[]]]},
{id:'percussion',names:['Percusión afinada','Pitched percussion','Percussão afinada'],family:'percussion',tunings:[['chromatic','Cromático / Chromatic',[]],['cmajor','C mayor / major',[60,62,64,65,67,69,71,72]],['dminor','D menor / minor',[50,57,58,60,62,64,65,69]]]},
{id:'chromatic',names:['Afinador cromático','Chromatic tuner','Afinador cromático'],family:'chromatic',tunings:[['chromatic','12 notas / notes',[]]]}
];
const meters={'2/4':{beats:2,steps:8,groups:[4,4]},'3/4':{beats:3,steps:12,groups:[4,4,4]},'4/4':{beats:4,steps:16,groups:[4,4,4,4]},'6/8':{beats:3,steps:12,groups:[6,6]},'5/8':{beats:2.5,steps:10,groups:[4,6]},'7/8':{beats:3.5,steps:14,groups:[4,4,6]}};
const tracks=['kick','snare','hat','wood'];
const pattern=(meter,rows)=>({meter,bars:rows[0].length/meters[meter].steps,rows:rows.map(row=>row.slice())});
function make(meter,notes,bars=1){const rows=tracks.map(()=>Array(meters[meter].steps*bars).fill(0));for(const [track,positions]of Object.entries(notes))for(const [step,vel]of positions)rows[tracks.indexOf(track)][step]=vel;return pattern(meter,rows);}
const presets=[
['click',['Pulso claro','Clear pulse','Pulso claro'],'4/4',{wood:[[0,2],[4,1],[8,1],[12,1]]}],
['rock',['Rock · base','Rock · basic','Rock · base'],'4/4',{kick:[[0,2],[8,2]],snare:[[4,2],[12,2]],hat:[[0,1],[2,1],[4,1],[6,1],[8,1],[10,1],[12,1],[14,1]]}],
['funk',['Funk · síncopa','Funk · syncopation','Funk · síncope'],'4/4',{kick:[[0,2],[6,1],[10,2]],snare:[[4,2],[11,1],[12,2]],hat:[[0,2],[2,1],[4,1],[6,1],[8,2],[10,1],[12,1],[14,1]]}],
['pop',['Pop · cuatro al piso','Pop · four on floor','Pop · quatro no chão'],'4/4',{kick:[[0,2],[4,2],[8,2],[12,2]],snare:[[4,2],[12,2]],hat:[[2,1],[6,1],[10,1],[14,1]]}],
['bossa',['Bossa · estudio simplificado','Bossa · simplified study','Bossa · estudo simplificado'],'4/4',{kick:[[0,2],[6,1],[8,2],[14,1]],wood:[[0,1],[6,2],[10,1]],hat:[[0,1],[2,1],[4,1],[6,1],[8,1],[10,1],[12,1],[14,1]]}],
['clave32',['Clave 3–2','3–2 clave','Clave 3–2'],'4/4',{wood:[[0,2],[6,2],[12,2],[20,2],[24,2]]}],
['clave23',['Clave 2–3','2–3 clave','Clave 2–3'],'4/4',{wood:[[4,2],[8,2],[16,2],[22,2],[28,2]]}],
['cumbia',['Cumbia · estudio','Cumbia · study','Cumbia · estudo'],'4/4',{kick:[[0,2],[8,2]],snare:[[4,1],[12,1]],hat:[[0,1],[2,2],[4,1],[6,2],[8,1],[10,2],[12,1],[14,2]]}],
['reggae',['Reggae · estudio','Reggae · study','Reggae · estudo'],'4/4',{kick:[[8,2]],snare:[[8,2]],wood:[[2,1],[6,1],[10,1],[14,1]]}],
['swing',['Swing · estudio','Swing · study','Swing · estudo'],'4/4',{kick:[[0,1],[4,1],[8,1],[12,1]],snare:[[4,1],[12,1]],hat:[[0,2],[2,1],[4,2],[6,1],[8,2],[10,1],[12,2],[14,1]]}],
['waltz',['Vals · 3/4','Waltz · 3/4','Valsa · 3/4'],'3/4',{kick:[[0,2]],wood:[[4,1],[8,1]],hat:[[0,1],[2,1],[4,1],[6,1],[8,1],[10,1]]}],
['sixEight',['6/8 · dos grupos','6/8 · two groups','6/8 · dois grupos'],'6/8',{kick:[[0,2]],snare:[[6,2]],hat:[[0,2],[2,1],[4,1],[6,2],[8,1],[10,1]]}],
['five',['5/8 · 2+3','5/8 · 2+3','5/8 · 2+3'],'5/8',{wood:[[0,2],[4,2]],hat:[[0,1],[2,1],[4,1],[6,1],[8,1]]}],
['seven',['7/8 · 2+2+3','7/8 · 2+2+3','7/8 · 2+2+3'],'7/8',{wood:[[0,2],[4,2],[8,2]],hat:[[0,1],[2,1],[4,1],[6,1],[8,1],[10,1],[12,1]]}]
].map(([id,names,meter,notes])=>({id,names,pattern:make(meter,notes,id.startsWith('clave')?2:1)}));
function validate(p){if(!p||!Object.hasOwn(meters,p.meter)||![1,2].includes(p.bars||1)||!Array.isArray(p.rows)||p.rows.length!==4||p.rows.some(r=>!Array.isArray(r)||r.length!==meters[p.meter].steps*(p.bars||1)||r.some(v=>![0,1,2].includes(v))))throw Error('Invalid pattern');return pattern(p.meter,p.rows);}
function events(p,bpm,swing=0){validate(p);if(!Number.isFinite(bpm)||bpm<30||bpm>260||!Number.isFinite(swing)||swing<0||swing>.8)throw Error('Invalid tempo');const step=60/bpm/4;return p.rows.flatMap((row,t)=>row.map((v,i)=>v?{track:tracks[t],time:(i+(i%4>=2?swing:0))*step,velocity:v,step:i}:null).filter(Boolean)).sort((a,b)=>a.time-b.time);}
function tapTempo(times){if(!Array.isArray(times)||times.length<3)return null;const gaps=times.slice(1).map((t,i)=>t-times[i]).filter(v=>v>=230&&v<=2000).sort((a,b)=>a-b);return gaps.length>=2?Math.max(30,Math.min(260,Math.round(60000/gaps[Math.floor(gaps.length/2)]))):null;}
function nearest(f,notes,a4=440){if(!Number.isFinite(f)||f<=0||!notes.length)return null;return notes.reduce((best,n)=>Math.abs(1200*Math.log2(f/(a4*2**((n-69)/12))))<Math.abs(1200*Math.log2(f/(a4*2**((best-69)/12))))?n:best);}
function written(midi,transpose){return midi-({bb:-2,eb:-9,f:-7,tenor:-14}[transpose]||0);}
function project(x){if(!x||x.version!==1||typeof x.name!=='string'||!x.name.trim()||x.name.length>60||!Number.isInteger(x.bpm)||x.bpm<30||x.bpm>260)throw Error('Invalid project');return {version:1,name:x.name.trim(),bpm:x.bpm,pattern:validate(x.pattern)};}
const api={instruments,meters,tracks,presets,make,validate,events,tapTempo,nearest,written,project};if(typeof module==='object'&&module.exports)module.exports=api;else root.PulsoCore=api;
})(typeof window==='object'?window:globalThis);
