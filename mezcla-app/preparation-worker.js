importScripts('preparation-dsp.js');
self.onmessage=e=>{try{const {audio,rate,options}=e.data;const result=self.MixPreparation.process(audio,rate,options,p=>self.postMessage({type:'progress',value:p}));self.postMessage({type:'done',...result},result.layers.flat().map(a=>a.buffer));}catch(error){self.postMessage({type:'error',message:error.message});}};
