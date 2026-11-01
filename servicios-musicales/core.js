(function (root) {
  'use strict';
  const options = {
    service: {lesson:['Clase individual','Individual lesson'],workshop:['Taller para grupo','Group workshop'],institution:['Experiencia institucional','Institutional experience']},
    topic: {production:['Producción y mezcla','Production and mixing'],theory:['Teoría, lectura y oído','Theory, reading and ear training'],instrument:['Instrumento y técnica','Instrument and technique'],armonia:['Armonía','Harmony'],composicion:['Composición','Composition'],improvisacion:['Improvisación','Improvisation'],world:['Instrumentos del mundo y ritmo en equipo','World instruments and team rhythm']},
    format: {online:['Virtual','Online'],onsite:['Presencial','In person']}
  };
  function clean(value, max) {
    return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0,max) : '';
  }
  function validate(input) {
    if (!input || typeof input !== 'object') throw Error('invalid');
    for (const name of ['service','topic','format']) if (!Object.hasOwn(options[name],input[name])) throw Error('invalid');
    const raw = String(input.participants ?? '').trim();
    if (!/^\d{1,3}$/.test(raw)) throw Error('participants');
    const participants = Number(raw);
    if (participants < 1 || participants > 300) throw Error('participants');
    if (input.service === 'lesson' && participants !== 1) throw Error('individual');
    if (input.service !== 'lesson' && participants < 2) throw Error('group');
    if (input.service === 'lesson' && input.format !== 'online') throw Error('online');
    const place = clean(input.place,100), when = clean(input.when,80), objective = clean(input.objective,500);
    if (input.format === 'onsite' && !place) throw Error('place');
    if (objective.length < 12) throw Error('objective');
    return {service:input.service,topic:input.topic,format:input.format,participants,place,when,objective};
  }
  function message(input, lang='es') {
    const v=validate(input), en=lang==='en', i=en?1:0, t=(a,b)=>en?b:a;
    return [t('Hola Walter, quiero consultar una experiencia Walamort.','Hello Walter, I would like to inquire about a Walamort experience.'),
      t('Experiencia: ','Experience: ')+options.service[v.service][i],
      t('Tema: ','Topic: ')+options.topic[v.topic][i],
      t('Modalidad: ','Format: ')+options.format[v.format][i],
      t('Participantes: ','Participants: ')+v.participants,
      t('Ciudad / zona horaria: ','City / time zone: ')+(v.place||t('Por definir','To be discussed')),
      t('Fecha / periodo: ','Date / period: ')+(v.when||t('Consultar disponibilidad','Please advise availability')),
      t('Objetivo y contexto: ','Goal and context: ')+v.objective,
      '',t('Entiendo que las actividades actuales se realizan en español y que fecha, alcance, recursos y precio requieren confirmación personal. Esta consulta no es una reserva.','I understand current activities are delivered in Spanish and dates, scope, resources and price require personal confirmation. This inquiry is not a booking.')].join('\n');
  }
  function links(text) {
    return {whatsapp:'https://wa.me/573053650966?text='+encodeURIComponent(text),email:'mailto:hola@walamort.com?subject='+encodeURIComponent('Consulta Walamort / Music inquiry')+'&body='+encodeURIComponent(text)};
  }
  const api={options,clean,validate,message,links};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.WalamortInquiry=api;
})(typeof window==='object'?window:this);
