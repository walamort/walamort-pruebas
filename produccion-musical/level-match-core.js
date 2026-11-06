(function(root){
 'use strict';
 const limits=Object.freeze({seconds:8,sampleRate:44100,sourceBytes:20*1024*1024,maxCutDB:18,minRMS:1e-5});
 function match(a,b){if(!a||!b||![a.rms,b.rms].every(v=>Number.isFinite(v)&&v>limits.minRMS))throw Error('silence');const differenceDB=20*Math.log10(b.rms/a.rms),cut=Math.min(limits.maxCutDB,Math.abs(differenceDB));return {aDB:20*Math.log10(a.rms),bDB:20*Math.log10(b.rms),differenceDB,gainA:differenceDB<0?10**(-cut/20):1,gainB:differenceDB>0?10**(-cut/20):1,limited:Math.abs(differenceDB)>limits.maxCutDB,residualDB:Math.max(0,Math.abs(differenceDB)-limits.maxCutDB)};}
 function sourceBytes(data){let bytes=0;if(data?.imported){const a=data.imported;if(!Number.isInteger(a.length)||a.length<=0||![1,2].includes(a.numberOfChannels))throw Error('source');bytes=a.length*a.numberOfChannels*4;}else{if(!data?.tracks||!Number.isFinite(data.sampleRate)||data.sampleRate<=0)throw Error('source');for(const track of Object.values(data.tracks))for(const channel of Array.isArray(track)?track:[track]){if(!channel||!Number.isFinite(channel.byteLength)||channel.byteLength<1)throw Error('source');bytes+=channel.byteLength;}}if(bytes>limits.sourceBytes)throw Error('memory');return bytes;}
 async function compare(data,state,env,current=()=>true){
  sourceBytes(data);
  async function probe(bypass){if(!current())throw Error('cancelled');const context=new env.Offline(2,Math.ceil((limits.seconds+.12)*limits.sampleRate),limits.sampleRate);let graph,voices;try{graph=env.audio.graph(context,state,bypass);voices=env.audio.sources(context,graph,data,state,true);voices.start(.1);const buffer=await context.startRendering();if(!current())throw Error('cancelled');const from=Math.round(.1*buffer.sampleRate),length=Math.round(limits.seconds*buffer.sampleRate);return env.metrics(Array.from({length:buffer.numberOfChannels},(_,c)=>buffer.getChannelData(c).subarray(from,from+length)));}finally{if(voices)voices.stop();if(graph)graph.dispose();}}
  const a=await probe(true),b=await probe(false);return {...match(a,b),peakA:a.peak,peakB:b.peak};
 }
 const api={limits,match,sourceBytes,compare};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortLevelMatch=api;
})(typeof window==='object'?window:globalThis);
