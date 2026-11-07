(function(root){'use strict';const references=Object.freeze([60,120,250,1000,3000,8000]);
 function order(random=Math.random){const result=[...references];for(let i=result.length-1;i>0;i--){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw Error('random');const j=Math.floor(value*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
 class Round{constructor(random){this.order=order(random);this.index=0;this.answers=[];this.heard=false;}
 get current(){return this.order[this.index]??null;}
 get answered(){return this.answers.length>this.index;}
 get complete(){return this.index===references.length;}
 get score(){return this.answers.filter(row=>row.expected===row.played).length;}
 markHeard(){if(this.complete)throw Error('complete');this.heard=true;}
 answer(played){if(!references.includes(played))throw Error('answer');if(this.complete||this.answered||!this.heard)return false;this.answers.push({expected:this.current,played});return true;}
 next(){if(this.complete||!this.answered)return false;this.index++;this.heard=false;return true;}}
 const api={references,order,Round};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortFrequencyDrill=api;
})(typeof window==='object'?window:globalThis);
