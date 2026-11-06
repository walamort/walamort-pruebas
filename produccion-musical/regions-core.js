(function(root){
 'use strict';
 const limits=Object.freeze({regions:8,seconds:12,sourceBytes:48*1024*1024,workBytes:64*1024*1024});
 function source(audio){if(!audio||!Number.isInteger(audio.length)||audio.length<1||!Number.isFinite(audio.sampleRate)||audio.sampleRate<8000||audio.sampleRate>192000||![1,2].includes(audio.numberOfChannels)||!Number.isFinite(audio.duration)||audio.duration<.1||audio.duration>60||Math.abs(audio.duration-audio.length/audio.sampleRate)>1e-5)throw Error('source');const bytes=audio.length*audio.numberOfChannels*4;if(bytes>limits.sourceBytes)throw Error('memory');return bytes;}
 function definitions(regions,duration=60){
  if(!Number.isFinite(duration)||duration<.1||duration>60)throw Error('source');
  if(!Array.isArray(regions)||!regions.length||regions.length>limits.regions)throw Error('count');
  const rows=regions.map(r=>{if(!r||!Number.isFinite(r.start)||!Number.isFinite(r.end)||r.start<0||r.end>duration+1e-6||r.end-r.start<.1-1e-6||r.end-r.start>limits.seconds+1e-6||!Number.isFinite(r.gain)||r.gain<0||r.gain>2||typeof r.fade!=='boolean')throw Error('region');return {start:r.start,end:r.end,gain:r.gain,fade:r.fade};});
  if(rows.reduce((sum,r)=>sum+r.end-r.start,0)>limits.seconds+1e-6)throw Error('duration');return rows;
 }
 function plan(audio,regions,retainedBytes=0,wav=false){
  const sourceBytes=source(audio);if(!Number.isFinite(retainedBytes)||retainedBytes<0)throw Error('memory');
  const normalized=definitions(regions,audio.duration).map(r=>{const from=Math.round(r.start*audio.sampleRate),to=Math.min(audio.length,Math.round(r.end*audio.sampleRate));if(to<=from)throw Error('region');return {...r,start:from/audio.sampleRate,end:to/audio.sampleRate,from,to,length:to-from};});
  const length=normalized.reduce((sum,r)=>sum+r.length,0),duration=length/audio.sampleRate;if(duration>limits.seconds+1e-6)throw Error('duration');const outputBytes=length*audio.numberOfChannels*4,memoryBytes=sourceBytes+retainedBytes+outputBytes+(wav?length*audio.numberOfChannels*2+44:0);if(memoryBytes>limits.workBytes)throw Error('memory');
  return {regions:normalized,length,duration,sampleRate:audio.sampleRate,channels:audio.numberOfChannels,sourceBytes,outputBytes,memoryBytes};
 }

 function assemble(context,audio,regions,retainedBytes=0,wav=false){const p=plan(audio,regions,retainedBytes,wav),out=context.createBuffer(p.channels,p.length,p.sampleRate);for(let c=0;c<p.channels;c++){const input=audio.getChannelData(c),output=out.getChannelData(c);let offset=0;for(const r of p.regions){const edge=r.fade?Math.min(Math.round(p.sampleRate*.005),Math.floor(r.length/2)):0;for(let i=0;i<r.length;i++){const sample=input[r.from+i];if(!Number.isFinite(sample))throw Error('samples');const envelope=edge?Math.min(1,i/Math.max(1,edge-1),(r.length-1-i)/Math.max(1,edge-1)):1;output[offset+i]=sample*r.gain*envelope;}offset+=r.length;}}return out;}
 const api={limits,source,definitions,plan,assemble};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortRegions=api;
})(typeof window==='object'?window:globalThis);
