(function(root){'use strict';
 const cases=['same','opposite','left'],outputs=['stereo','mono','side'];
 function channels(example,output,rate=22050){
  if(!cases.includes(example)||!outputs.includes(output)||!Number.isInteger(rate)||rate<8000||rate>96000)throw Error('settings');
  const length=Math.round(rate*1.2),data=[new Float32Array(length),new Float32Array(length)];
  for(let i=0;i<length;i++){const time=i/rate,envelope=Math.min(1,time/.03,(1.2-time)/.06),left=Math.sin(2*Math.PI*220*time)*.025*Math.max(0,envelope),right=example==='same'?left:example==='opposite'?-left:0;data[0][i]=output==='stereo'?left:output==='mono'?(left+right)/2:(left-right)/2;data[1][i]=output==='stereo'?right:data[0][i];}
  return data;
 }
 class Player{
  constructor(Context){this.Context=Context;this.context=null;this.active=null;this.generation=0;}
  stop(){this.generation++;const source=this.active;this.active=null;if(source){source.onended=null;try{source.stop();}catch{}source.disconnect();}}
  async play(example,output,done=()=>{}){const data=channels(example,output);this.stop();const token=this.generation;if(!this.Context)throw Error('unsupported');if(!this.context||this.context.state==='closed')this.context=new this.Context();const ctx=this.context;await ctx.resume();if(token!==this.generation)return false;if(ctx.state!=='running')throw Error('audio');const buffer=ctx.createBuffer(2,data[0].length,22050);data.forEach((channel,i)=>buffer.copyToChannel(channel,i));const source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);this.active=source;source.onended=()=>{source.disconnect();if(this.active===source){this.active=null;done();}};source.start();return true;}
  close(){this.stop();if(this.context){this.context.close().catch(()=>{});this.context=null;}}
 }
 const api={channels,Player};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortMonoLesson=api;
})(typeof window==='object'?window:globalThis);
