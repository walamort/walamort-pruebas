(function(root){
  'use strict';
  function frequency(note,a4=440){return a4*Math.pow(2,(note-69)/12)}
  function cents(f,target){return 1200*Math.log2(f/target)}
  function pitch(f,a4=440){if(!Number.isFinite(f)||f<=0||!Number.isFinite(a4)||a4<=0)return null;const midi=Math.round(69+12*Math.log2(f/a4));return {midi,frequency:frequency(midi,a4),cents:cents(f,frequency(midi,a4))}}
  function name(note,lang='es',flat=false){const es=flat?['Do','Re♭','Re','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si']:['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];const en=flat?['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B']:['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];return (lang==='en'?en:es)[((note%12)+12)%12]+(Math.floor(note/12)-1)}
  function analyze(buffer,sampleRate,options={}){
    if(!buffer||buffer.length<256||!Number.isFinite(sampleRate)||sampleRate<8000)return {frequency:null,rms:0,confidence:0,clipped:false};
    let sum=0,square=0,clipping=0;for(let i=0;i<buffer.length;i++){const v=buffer[i];if(!Number.isFinite(v))return {frequency:null,rms:0,confidence:0,clipped:false};sum+=v;square+=v*v;if(Math.abs(v)>=.985)clipping++}
    const rms=Math.sqrt(Math.max(0,square/buffer.length-(sum/buffer.length)**2)),clipped=clipping/buffer.length>=.01;
    if(rms<(options.threshold??.008)||clipped)return {frequency:null,rms,confidence:0,clipped};
    const minLag=Math.max(2,Math.floor(sampleRate/(options.maxFrequency||1200))),maxLag=Math.min(Math.floor(buffer.length/2)-1,Math.ceil(sampleRate/(options.minFrequency||40))+2),window=Math.min(2048,buffer.length-maxLag);
    if(maxLag<=minLag)return {frequency:null,rms,confidence:0,clipped};
    const normalized=new Float64Array(maxLag+1);let cumulative=0;normalized[0]=1;
    for(let lag=1;lag<=maxLag;lag++){let diff=0;for(let i=0;i<window;i++){const d=buffer[i]-buffer[i+lag];diff+=d*d}cumulative+=diff;normalized[lag]=cumulative>0?diff*lag/cumulative:1}
    let lag=-1,best=minLag;for(let i=minLag;i<maxLag;i++){if(normalized[i]<normalized[best])best=i;if(normalized[i]<.15){let candidate=i,j=i+1;while(j<=maxLag&&normalized[j]<.22){if(normalized[j]<normalized[candidate])candidate=j;j++}lag=candidate;break}}
    if(lag<0&&normalized[best]<.22)lag=best;
    if(lag<0)return {frequency:null,rms,confidence:Math.max(0,1-normalized[best]),clipped};
    const left=normalized[Math.max(1,lag-1)],center=normalized[lag],right=normalized[Math.min(maxLag,lag+1)],denominator=left-2*center+right;
    const offset=Math.abs(denominator)>1e-12?Math.max(-1,Math.min(1,.5*(left-right)/denominator)):0,f=sampleRate/(lag+offset),confidence=Math.max(0,Math.min(1,1-center));
    if(f<39.8||f>1202||confidence<.78)return {frequency:null,rms,confidence,clipped};return {frequency:f,rms,confidence,clipped};
  }
  function median(values){const a=values.slice().sort((a,b)=>a-b);return a.length?a[Math.floor(a.length/2)]:null}
  class Measurement{
    constructor(){this.validSeconds=0;this.inTuneSeconds=0;this.previous=null}
    add(time,within){if(this.previous!==null){const delta=(time-this.previous)/1000;if(delta>0&&delta<=.35){this.validSeconds+=delta;if(within)this.inTuneSeconds+=delta}}this.previous=time}
    silence(){this.previous=null}
    summary(){return {validSeconds:this.validSeconds,inTunePercent:this.validSeconds?Math.round(100*this.inTuneSeconds/this.validSeconds):null}}
  }
  function validRecord(r){return r&&typeof r.date==='string'&&Number.isFinite(Date.parse(r.date))&&Number.isInteger(r.target)&&r.target>=48&&r.target<=84&&Number.isFinite(r.a4)&&r.a4>=430&&r.a4<=450&&[5,10,20].includes(r.tolerance)&&Number.isFinite(r.validSeconds)&&r.validSeconds>=5&&r.validSeconds<86400&&Number.isInteger(r.inTunePercent)&&r.inTunePercent>=0&&r.inTunePercent<=100}
  const api={frequency,cents,pitch,name,analyze,median,Measurement,validRecord};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortPitch=api;
})(typeof window==='object'?window:this);
