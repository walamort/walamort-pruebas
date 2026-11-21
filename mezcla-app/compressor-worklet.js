import './compressor-dsp.js';
class WalamortCompressor extends AudioWorkletProcessor{
 static get parameterDescriptors(){return Object.entries({threshold:[-24,-60,0],ratio:[4,1,20],attack:[15,.1,2000],release:[200,2,4000],knee:[0,0,24],makeup:[0,0,18],sidechain:[0,0,400]}).map(([name,[defaultValue,minValue,maxValue]])=>({name,defaultValue,minValue,maxValue,automationRate:'k-rate'}));}
 constructor(){super();this.envelope=new globalThis.MixDSP.Envelope(sampleRate);this.frames=0;this.config={};this.port.onmessage=e=>{if(e.data?.type==='reset'){this.envelope=new globalThis.MixDSP.Envelope(sampleRate);this.frames=0;}};}
 process(inputs,outputs,params){const input=inputs[0],out=outputs[0];if(!out?.length)return true;for(const k in params)this.config[k]=params[k][0];const length=out[0].length;for(let i=0;i<length;i++){const l=input?.[0]?.[i]||0,r=input?.[1]?.[i]??l,g=this.envelope.step(l,r,this.config);out[0][i]=l*g;if(out[1])out[1][i]=r*g;}this.frames+=length;if(this.frames>=2048){this.port.postMessage({reduction:this.envelope.gr});this.frames=0;}return true;}
}
registerProcessor('walamort-compressor',WalamortCompressor);
