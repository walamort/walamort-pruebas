(function(root){'use strict';
function gainDb(input,threshold,ratio,knee=0){const x=input-threshold;if(knee>0&&Math.abs(x)<=knee/2)return (1/ratio-1)*(x+knee/2)**2/(2*knee);return x>knee/2?(1/ratio-1)*x:0;}
class Envelope{constructor(sampleRate){this.rate=sampleRate;this.gr=0;this.x=[0,0];this.hp=[0,0];}step(left,right,p){let peak=0;const alpha=p.sidechain>0?Math.exp(-2*Math.PI*p.sidechain/this.rate):0;for(let ch=0;ch<2;ch++){const x=ch?right:left;let y=x;if(alpha){y=alpha*(this.hp[ch]+x-this.x[ch]);this.hp[ch]=y;}else this.hp[ch]=0;this.x[ch]=x;peak=Math.max(peak,Math.abs(y));}const target=gainDb(20*Math.log10(Math.max(1e-9,peak)),p.threshold,p.ratio,p.knee);const ms=target<this.gr?p.attack:p.release,coeff=Math.exp(-1/(this.rate*Math.max(.0001,ms/1000)));this.gr=target+(this.gr-target)*coeff;return 10**((this.gr+p.makeup)/20);}}
const api={gainDb,Envelope};if(typeof module==='object'&&module.exports)module.exports=api;else root.MixDSP=api;
})(globalThis);
