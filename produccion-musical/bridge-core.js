(function(root){
 'use strict';
 const creative=typeof module==='object'&&module.exports?require('../estudio-creativo/core.js'):root.WalamortCreative;
 const production=typeof module==='object'&&module.exports?require('./core.js'):root.WalamortProduction;
 function packet(project,now=Date.now()){return {kind:'walamort-creative-transfer',version:1,createdAt:now,project:creative.validate(project)};}
 function validate(raw,now=Date.now()){if(!raw||raw.kind!=='walamort-creative-transfer'||raw.version!==1||!Number.isFinite(raw.createdAt)||raw.createdAt>now+60000||now-raw.createdAt>86400000)throw Error('transfer');return packet(raw.project,raw.createdAt);}
 function convert(raw){const p=creative.validate(raw);return production.settings({tempo:p.tempo,key:creative.KEYS[p.key].root,scaleMode:creative.KEYS[p.key].mode,patch:p.instrument,chords:p.chords.map(c=>c.degree),keysBank:{piano:'piano',guitar:'guitar-nylon',flute:'flute',violin:'violin'}[p.instrument],composition:p,arrangement:[],compositionDrums:false,compositionBass:false},true);}
 function region(audio,start,end){if(!audio||!Number.isFinite(start)||!Number.isFinite(end)||start<0||end>audio.duration+1e-6||end-start<.1-1e-6||end-start>12+1e-6)throw Error('region');const from=Math.round(start*audio.sampleRate),to=Math.min(audio.length,Math.round(end*audio.sampleRate));if(to<=from)throw Error('region');return {from,to,length:to-from,start:from/audio.sampleRate,end:to/audio.sampleRate};}
 function cut(context,audio,start,end,fade=true){const r=region(audio,start,end),out=context.createBuffer(audio.numberOfChannels,r.length,audio.sampleRate),edge=Math.min(Math.round(audio.sampleRate*.005),Math.floor(r.length/2));for(let c=0;c<audio.numberOfChannels;c++){const values=audio.getChannelData(c).slice(r.from,r.to);if(fade)for(let i=0;i<edge;i++){const gain=i/Math.max(1,edge-1);values[i]*=gain;values[values.length-1-i]*=gain;}out.copyToChannel(values,c);}return out;}
 const api={packet,validate,convert,region,cut};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortMusicBridge=api;
})(typeof window==='object'?window:globalThis);
