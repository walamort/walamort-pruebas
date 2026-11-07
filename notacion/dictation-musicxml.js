(function(root){'use strict';
 const N=typeof module==='object'&&module.exports?require('./core.js'):root.WalamortNotation;
 function score(p,lang='es'){
  if(!p||!Object.hasOwn(N.keys,p.key)||!Object.hasOwn(N.meters,p.meter)||!['es','en','pt'].includes(lang)||!Number.isFinite(p.tempo)||p.tempo<45||p.tempo>140)throw Error('Invalid export settings');
  const m=N.meters[p.meter],k=N.keys[p.key],parts=[p.expected,p.actual],labels={es:['Dictado: modelo e intento','Modelo','Último intento evaluado'],en:['Dictation: model and attempt','Model','Latest assessed attempt'],pt:['Ditado: modelo e tentativa','Modelo','Última tentativa avaliada']}[lang];
  for(const events of parts)if(!N.validate(events,p.meter)||N.total(events)!==m.total)throw Error('Incomplete dictation');
  let xml='<?xml version="1.0" encoding="UTF-8"?>\n<score-partwise version="4.0"><work><work-title>'+labels[0]+'</work-title></work><identification><encoding><software>Walamort Academy</software></encoding></identification><part-list>';
  labels.slice(1).forEach((label,i)=>xml+='<score-part id="P'+(i+1)+'"><part-name>'+label+'</part-name></score-part>');xml+='</part-list>';
  parts.forEach((events,index)=>{xml+='<part id="P'+(index+1)+'">';const timeline=N.timeline(events);
   for(let bar=0;bar<2;bar++){
    xml+='<measure number="'+(bar+1)+'">';const accidentals={};
    if(!bar)xml+='<attributes><divisions>4</divisions><key><fifths>'+k.signature+'</fifths><mode>'+(['Am','Dm'].includes(p.key)?'minor':'major')+'</mode></key><time><beats>'+p.meter.split('/')[0]+'</beats><beat-type>'+p.meter.split('/')[1]+'</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit>'+(m.pulse===1.5?'<beat-unit-dot/>':'')+'<per-minute>'+p.tempo+'</per-minute></metronome></direction-type><sound tempo="'+(p.tempo*m.pulse)+'"/></direction>';
    timeline.forEach((e,i)=>{if(e.beat<bar*m.bar||e.beat>=(bar+1)*m.bar)return;
     let accidental='';xml+='<note>';
     if(e.note===null)xml+='<rest/>';else{const s=N.spelling(e.note,k.flat),step='CDEFGAB'[s.letter],id=step+s.octave,previous=Object.hasOwn(accidentals,id)?accidentals[id]:(k.signature===1&&step==='F'?1:k.signature===-1&&step==='B'?-1:0);xml+='<pitch><step>'+step+'</step>'+(s.accidental?'<alter>'+s.accidental+'</alter>':'')+'<octave>'+s.octave+'</octave></pitch>';if(previous!==s.accidental&&!e.tie)accidental='<accidental>'+({1:'sharp',0:'natural','-1':'flat'}[s.accidental])+'</accidental>';if(!e.tie)accidentals[id]=s.accidental;}
     const ties=(e.tie?'<tie type="stop"/>':'')+(events[i+1]?.tie?'<tie type="start"/>':'');
     xml+='<duration>'+(e.duration*4)+'</duration>'+ties+'<type>'+({'.25':'16th','0.25':'16th','0.5':'eighth',1:'quarter','1.5':'quarter',2:'half'}[e.duration])+'</type>'+(e.duration===1.5?'<dot/>':'')+accidental+(ties?'<notations>'+ties.replaceAll('<tie ','<tied ')+'</notations>':'')+'</note>';
    });
    if(bar===1)xml+='<barline location="right"><bar-style>light-heavy</bar-style></barline>';xml+='</measure>';
   }xml+='</part>';
  });return xml+'</score-partwise>\n';
 }
 const api={score};if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortDictationMusicXML=api;
})(typeof window==='object'?window:globalThis);
