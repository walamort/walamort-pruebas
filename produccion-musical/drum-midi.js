(function(root){'use strict';
 const C=typeof module==='object'&&module.exports?require('./core.js'):root.WalamortProduction,ppq=480,notes=Object.freeze({kick:36,snare:38,hat:42,perc:75});
 function plan(raw,scope='pattern'){
  const s=C.settings(raw,true);if(!['pattern','arrangement'].includes(scope))throw Error('scope');
  const map=scope==='pattern'?{beats:4,cycles:[{beat:0,name:'pattern',repetition:0,index:0,drums:true,energy:1,groove:'inherit'}]}:C.timeline(s),hits=[],markers=[];
  for(const cycle of map.cycles){markers.push({tick:cycle.beat*ppq,text:cycle.name+' '+(cycle.index+1)+' / '+(cycle.repetition+1)});if(!cycle.drums||!cycle.energy||scope==='arrangement'&&s.composition&&!s.compositionDrums)continue;
   const chosen=C.rhythm(s,cycle),pattern=chosen.pattern,bars=scope==='pattern'?1:4;
   for(let bar=0;bar<bars;bar++)for(let step=0;step<16;step++)for(const lane of C.lanes){const velocity=pattern[lane][step]*cycle.energy;if(!velocity)continue;hits.push({tick:Math.round((cycle.beat+bar*4+step/4+(step%2?chosen.swing/4:0))*ppq),note:notes[lane],velocity:Math.max(1,Math.round(velocity*100))});}
  }
  if(!hits.length)throw Error('empty');return {tempo:s.tempo,ticks:map.beats*ppq,bars:map.beats/4,hits,markers};
 }
 function vlq(value){const bytes=[value&127];while(value>>=7)bytes.unshift((value&127)|128);return bytes;}
 function encode(raw,scope='pattern'){
  const p=plan(raw,scope),events=[],tempo=Math.round(60000000/p.tempo),add=(tick,data,order=0)=>events.push({tick,data,order});
  add(0,[255,81,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255],-3);add(0,[255,88,4,4,2,24,8],-3);
  const title=[...('Walamort drums')].map(c=>c.charCodeAt(0));add(0,[255,3,title.length,...title],-3);
  for(const marker of p.markers){const text=[...marker.text].map(c=>c.charCodeAt(0));add(marker.tick,[255,6,text.length,...text],-2);}
  for(const hit of p.hits){add(hit.tick,[153,hit.note,hit.velocity]);add(Math.min(p.ticks,hit.tick+30),[137,hit.note,0],-1);}
  events.sort((a,b)=>a.tick-b.tick||a.order-b.order);const track=[];let previous=0;for(const event of events){track.push(...vlq(event.tick-previous),...event.data);previous=event.tick;}track.push(...vlq(p.ticks-previous),255,47,0);const length=track.length;
  return {bytes:new Uint8Array([77,84,104,100,0,0,0,6,0,0,0,1,1,224,77,84,114,107,(length>>>24)&255,(length>>>16)&255,(length>>>8)&255,length&255,...track]),bars:p.bars,hits:p.hits.length,tempo:p.tempo};
 }
 const api={ppq,notes,plan,encode};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortDrumMIDI=api;
})(typeof window==='object'?window:globalThis);
