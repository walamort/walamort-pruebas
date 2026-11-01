(() => {
  'use strict';
  const en=document.documentElement.lang==='en',lang=en?'en':'es',t=(a,b)=>en?b:a,$=id=>document.getElementById(id),core=window.WalamortInquiry;
  const ids=['service','topic','format','participants','place','when','objective'];
  const params=new URLSearchParams(location.search);
  for(const name of ['service','topic'])if(Object.hasOwn(core.options[name],params.get(name)))$(name).value=params.get(name);
  const errors={
    invalid:t('Revisa las opciones seleccionadas.','Check the selected options.'),
    participants:t('Escribe un número entero de participantes entre 1 y 300.','Enter a whole number of participants from 1 to 300.'),
    individual:t('La consulta de clase individual es para una persona. Para un grupo, elige taller o experiencia institucional.','Individual lesson inquiries are for one person. Choose a workshop or institutional experience for a group.'),
    group:t('Para una actividad de grupo indica al menos dos participantes.','Enter at least two participants for a group activity.'),
    online:t('Las clases individuales de este catálogo son virtuales. Para otros formatos, consulta directamente por correo.','Individual lessons in this catalog are online. Contact us directly for other formats.'),
    place:t('Indica la ciudad para consultar una actividad presencial.','Enter the city for an in-person inquiry.'),
    objective:t('Describe tu objetivo con al menos 12 caracteres.','Describe your goal using at least 12 characters.')
  };
  function languageLink(){const p=new URLSearchParams({service:$('service').value,topic:$('topic').value});$('language').href=document.body.dataset.base+(en?'':'en/')+'servicios-musicales/?'+p;}
  function invalidate(){
    $('requestResult').hidden=true;$('whatsapp').removeAttribute('href');$('email').removeAttribute('href');$('message').textContent='';$('requestStatus').textContent='';$('requestError').textContent='';languageLink();
  }
  ids.forEach(id=>$(id).addEventListener(id==='service'||id==='topic'||id==='format'?'change':'input',invalidate));
  $('requestForm').addEventListener('submit',event=>{
    event.preventDefault();invalidate();
    try {
      const input=Object.fromEntries(ids.map(id=>[id,$(id).value])),message=core.message(input,lang),links=core.links(message);
      $('message').textContent=message;$('whatsapp').href=links.whatsapp;$('email').href=links.email;$('requestResult').hidden=false;
      $('requestResult').scrollIntoView({block:'start',behavior:'smooth'});
    }catch(error){$('requestError').textContent=errors[error.message]||errors.invalid;}
  });
  $('copyRequest').onclick=async()=>{try{await navigator.clipboard.writeText($('message').textContent);$('requestStatus').textContent=t('Mensaje copiado. Tú decides si lo envías.','Message copied. You choose whether to send it.');}catch{$('requestStatus').textContent=t('No se pudo copiar automáticamente; selecciona el texto del mensaje y cópialo.','Automatic copy failed; select and copy the message text.');}};
  $('printRequest').onclick=()=>window.print();languageLink();
})();
