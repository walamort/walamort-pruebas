const assert=require('assert'),C=require('../estudio-creativo/core.js'),P=require('../produccion-musical/core.js'),B=require('../produccion-musical/bridge-core.js'),T=require('../seguimiento/core.js');
for(const key of Object.keys(C.KEYS)){
 const raw={...C.blank(),title:'A <song>',key,tempo:45,instrument:'guitar',melody:[60,null,62,63,...Array(12).fill(null)],chords:[0,1,4,6].map((degree,i)=>({degree,seventh:true,inversion:i%4}))},s=B.convert(raw),plan=P.plan(s);
 assert.equal(s.tempo,45);assert.equal(plan.duration,16*60/45);assert.deepEqual(s.composition,C.validate(raw));
 const expected=[...raw.melody.flatMap((note,beat)=>note===null?[]:[{note,beat,duration:.9}]),...raw.chords.flatMap((c,bar)=>C.chord(key,c.degree,c.seventh,c.inversion).notes.map(note=>({note,beat:bar*4,duration:3.8})))];
 assert.deepEqual(plan.events.map(({note,beat,duration})=>({note,beat,duration})),expected);assert(plan.events.every(e=>e.track==='keys'));
 const pcm=P.synth(s,8000);assert.equal(P.metrics([pcm.tracks.drums]).peak,0);assert.equal(P.metrics([pcm.tracks.bass]).peak,0);assert(P.metrics([pcm.tracks.keys]).rms>0);
 assert(P.plan({...s,compositionBass:true}).events.some(e=>e.track==='bass'));assert(P.metrics([P.synth({...s,compositionDrums:true},8000).tracks.drums]).peak>0);
 const copy=P.project({kind:'walamort-production',version:1,settings:s});copy.settings.composition.melody[0]=80;assert.equal(s.composition.melody[0],60);
 const packet=B.packet(raw,1000);assert.deepEqual(B.validate(packet,2000),packet);assert.throws(()=>B.validate(packet,86402000));assert.throws(()=>B.validate({...packet,createdAt:100000},0));
}
const audio={sampleRate:48000,length:48000*20,duration:20,numberOfChannels:2,getChannelData(c){return Float32Array.from({length:this.length},(_,i)=>Math.sin(i/20)*(c?.5:1));}},context={createBuffer(channels,length,sampleRate){return {length,sampleRate,channels:[],copyToChannel(v,c){this.channels[c]=v}}}};
const source=audio.getChannelData(0),cut=B.cut(context,audio,5,8,false);assert.equal(cut.length,144000);assert.equal(cut.channels[0][100],source[240100]);const faded=B.cut(context,audio,5,8,true);assert.equal(faded.channels[0][0],0);assert.equal(faded.channels[1].at(-1),0);
for(const region of [[-1,2],[1,1],[0,13],[20,21],[3,2]])assert.throws(()=>B.cut(context,audio,...region));assert.equal(audio.duration,20);
const row={activity:'Práctica rítmica',level:'easy',score:80,date:'2026-11-02T12:00:00Z'},entries=[row,{...row,score:100,date:'2026-11-02T13:00:00Z'}];assert.equal(T.merge(entries,entries).length,2);assert.equal(T.summary(entries)[0].mean,90);assert.equal(T.summary(entries)[0].last,100);assert.deepEqual(T.validateBackup(T.backup(entries)),T.backup(entries));
for(const bad of [{...row,score:NaN},{...row,score:101},{...row,date:'bad'},{...row,level:{}}])assert.throws(()=>T.rows([bad]));const report=T.report(entries,'=ALIAS','A1');assert.equal(T.validateReport(report).group,'A1');assert(T.csv([report]).includes("'=ALIAS"));assert.throws(()=>T.validateReport({kind:'other',version:1}));
console.log('PASS: exact creative melody/rest/chord/inversion transfer, original tempo, optional stems, project isolation, expired packets, non-destructive sample-accurate cuts/fades, history validation/merge and safe teacher CSV.');
