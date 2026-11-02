const assert=require('assert'),core=require('../produccion-musical/core.js');
const section=(changes={})=>({name:'verse',repeats:1,groove:'inherit',energy:1,drums:true,bass:true,keys:true,chords:[0,5,3,4],...changes});
const arrangement=[section({name:'intro',drums:false,bass:false,energy:.5}),section({name:'chorus',groove:'house',chords:[3,4,0,5]})],s=core.settings({arrangement,tempo:120});
const map=core.timeline(s);assert.equal(map.beats,32);assert.equal(map.duration,16);assert.deepEqual(map.cycles.map(c=>c.beat),[0,16]);
const plan=core.plan(s);assert.equal(plan.duration,16);assert(!plan.events.some(e=>e.track==='bass'&&e.beat<16));assert.equal(plan.events.find(e=>e.track==='keys'&&e.beat===16).note,65);
const audio=core.synth(s,8000);assert.equal(audio.duration,16);assert.equal(audio.tracks.drums.length,128000);assert.equal(core.metrics([audio.tracks.drums.slice(0,64000)]).peak,0);assert.equal(core.metrics([audio.tracks.bass.slice(0,64000)]).peak,0);assert(core.metrics([audio.tracks.drums.slice(64000)]).rms>0);
for(const track of ['drums','bass','keys'])assert.equal(core.metrics([core.synth({arrangement:[section({energy:0})]},8000).tracks[track]]).peak,0);
const a=core.synth({arrangement:[section({energy:1})]},8000),b=core.synth({arrangement:[section({energy:.5})]},8000);for(const track of ['drums','bass','keys'])assert(Math.abs(core.metrics([a.tracks[track]]).rms/2-core.metrics([b.tracks[track]]).rms)<1e-8);
const repeated=core.plan({arrangement:[section({repeats:4})],tempo:60});assert.equal(repeated.duration,64);assert(repeated.events.some(e=>e.beat>=48));assert(repeated.events.every(e=>e.beat<64));
for(const invalid of [null,{},[section({repeats:0})],[section({repeats:1.5})],[section({energy:NaN})],[section({keys:1})],[section({name:'<script>'})],[section({groove:'unknown'})],[section({chords:[0,1,2,7]})],[section({repeats:3}),section({repeats:2})],Array(5).fill(section())])assert.throws(()=>core.settings({arrangement:invalid},true));
const project=core.project({kind:'walamort-production',version:1,settings:s});assert.deepEqual(project.settings.arrangement,arrangement);project.settings.arrangement[0].chords[0]=6;assert.equal(s.arrangement[0].chords[0],0);
assert.equal(core.timeline(core.project({kind:'walamort-production',version:1,settings:{tempo:90}}).settings).beats,16);
const customized=core.synth({arrangement:[section({groove:'house'})],pattern:Object.fromEntries(core.lanes.map(l=>[l,Array(16).fill(0)]))},8000);assert(core.metrics([customized.tracks.drums]).rms>0);
console.log('PASS: arrangement boundaries/duration, section chords, inherited/section grooves, track rests, energy, repeats, JSON isolation and legacy projects.');

assert(!JSON.stringify(core.settings({arrangement:[section({audio:'private',filename:'secret'})]},true)).includes('private'));
assert(!JSON.stringify(core.settings({arrangement:[section({audio:'private',filename:'secret'})]},true)).includes('secret'));
assert.deepEqual(core.variation(s),core.variation(s));assert.notDeepEqual(core.variation(s).arrangement[0].chords,s.arrangement[0].chords);
