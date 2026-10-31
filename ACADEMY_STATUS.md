# Continuación Academy — 2026-10-30

## Auditoría
Los commits 95ba5b8 (pruebas) y 7f13771 (home-improvements-oct29) ya implementaban dictado melódico y práctica rítmica. Ambos estaban enlazados desde practica/ y preuniversitario/. No se recrearon esas herramientas.

## Entregado
- Guardado local de intentos de dictado, ritmo y lectura (máximo 200); resumen por actividad con último resultado y mejor puntuación; borrado del historial de práctica independiente del Aula.
- Dictado: evita entradas concurrentes mientras se activa audio; Detener cancela una referencia Do4 pendiente. Cada ejercicio guarda una evaluación, para no contar repetidamente una respuesta revelada.
- Ritmo: al cambiar tempo exige volver a escuchar; Enter y Espacio permiten tocar con teclado sin repetición automática. Cada nuevo intento puede guardar su resultado.
- Lectura de notas naturales: sol/fa, líneas adicionales y mezcla de claves; sesiones de diez preguntas con octava y explicaciones. No evalúa duración ni armaduras.
- Catálogo, Preuniversitario y Aula conectados a los ejercicios y seguimiento.

## Validación
node --check para scripts; node tests/academy.cjs comprueba emparejamiento rítmico (exactos, omisiones, extras, fuera de tolerancia), validación de dictado, límites del tempo, sesión completa de lectura, persistencia y recuperación de almacenamiento corrupto, enlaces locales de catálogo y Preuniversitario. No se ha verificado físicamente audio ni latencia en iOS/Android; la compensación temporal sigue siendo manual.

## Prioridades siguientes
1. Lectura: armaduras, alteraciones accidentales, duración y lectura a primera vista con tiempo.
2. Dictados: variación tonal, duraciones y transcripción en pentagrama; ahora solo se evalúan alturas y octavas.
3. Armonía: entrada real de cuatro voces y reglas explicadas de tesitura, cruces, paralelas y resolución; el Aula actual es un cuestionario conceptual, no un corrector SATB.
4. Seguimiento: resultados por destreza y nivel, objetivos y exportación; el historial actual es local, sin cuenta ni sincronización.
5. Pruebas físicas de audio, interrupciones y latencia en Safari iOS y Chrome Android.

## Publicación
Sitio de pruebas: https://walamort.github.io/walamort-pruebas/
Repositorio principal: exclusivamente rama home-improvements-oct29. Su rama no tiene una URL pública independiente confirmada. Nunca publicar estos cambios en main de producción.

Comprobación publicada: despliegue de e835f18 completado con éxito; corrección visual de lectura y ciclo de dictado (escuchar, introducir, evaluar, verificar historial) comprobados en navegador con vista estrecha. Los enlaces github.io redirigen actualmente a https://walamort.com/walamort-pruebas/ por la configuración de dominio heredada de GitHub Pages. Eso no implica un cambio en main de producción.

## Mano y timbres interactivos
Mano lateral con nueve posiciones explorables: cinco dedos/líneas y cuatro espacios; claves de sol/fa, nota en pentagrama y sonido al tocar, botones accesibles alternativos. Selector persistente de piano, guitarra, flauta y violín sintetizados en lectura, dictado y ritmo. En lectura, la nota del ejercicio solo se oye tras contestar. El patrón rítmico y los golpes usan el instrumento; el metrónomo mantiene clic diferenciado. Pruebas de correspondencia de claves y nueve posiciones, y cuatro espectros de sonido distintos.

## Mano natural y clave de do
Silueta vectorial original con pulgar superior, dedos abiertos, proporciones diferenciadas y pliegues. Nueve puntos táctiles, conectores de color y botones alternativos. Clave de do en tercera línea (alto) añadida a exploración y ejercicio; modo avanzado combina sol, fa y do. Do4 corresponde a la línea central de alto (líneas Fa3, La3, Do4, Mi4, Sol4). Pruebas de correspondencia incluidas.

## Mi ruta y acceso en inglés
Objetivos (inicio, admisión, profundización), rutina de 10/20/30 minutos, diagnóstico conceptual de nueve preguntas con explicaciones, recomendaciones por resultados recientes, casillas de práctica diaria y exportación JSON de preferencias/resultados. No evalúa audición en el diagnóstico conceptual; el oído se observa en dictados.
Inglés: portada /en/, catálogo, preparación musical, ruta y herramientas de lectura, dictado y ritmo con etiquetas, mensajes y notación C/D/E. El historial comparte identificadores entre idiomas. La biblioteca ampliada (armonía, acordes, escalas, museo, etc.) sigue en español y se indica en los enlaces. Hreflang recíproco, canonicals, descripciones, Open Graph y sitemap preparados. Pruebas mantiene Disallow / y noindex; la rama principal de desarrollo prepara las URLs inglesas para una futura publicación autorizada. No hay publicación en main de producción ni garantía de posicionamiento en buscadores.
Pruebas: validación de perfiles, duración total exacta de rutinas, prioridad de habilidades, persistencia de lista diaria, diagnóstico completo de nueve preguntas, notación inglesa, historial compartido, enlaces y metadatos bilingües. Ejecutar node tests/academy.cjs.

## Estudio creativo y armonía aplicada
- Estudio bilingüe de cuatro compases en 4/4: 16 notas/silencios de negra, teclado de escala, selección cromática, motivo, retrogradación del primer compás, transposición cromática y deshacer. Ejemplo original incluido.
- Cuatro acordes diatónicos con tríadas/séptimas e inversiones. Cinco tonalidades: Do/Sol/Fa mayor y La/Re menor natural.
- Laboratorio bilingüe para oír acordes simultáneos, arpegios y recorrido I–IV–V–I (i–iv–v–i en menor natural), ver notas/bajo/estructura y llevar el acorde al primer compás del estudio. No corrige SATB ni presenta la menor natural como menor armónica.
- Guardado local explícito, apertura/descarga JSON con validación, MIDI estándar formato 0 con melodía y acompañamiento en canales separados y ficha imprimible. No hay nube ni publicación. Los proyectos de pruebas usan un espacio de almacenamiento separado del sitio público.
- Retos creativos diarios y observaciones sobre cromatismos, saltos y notas ajenas al acorde, sin calificarlos automáticamente como errores.
- Integrado en portadas, catálogos, Mi ruta, preparación y cursos. Canonicals/hreflang/sitemap; pruebas mantiene noindex.
- Ejecutar node tests/creative.cjs y node tests/academy.cjs. Se verifican tríadas/séptimas/inversiones, cinco escalas, importación, deshacer, reproducción, integridad del archivo MIDI, fin de notas y flujo bilingüe.

## Siguientes posibilidades de marca, por prioridad
1. Dictados con duraciones y entrada en pentagrama; lectura con armaduras y alteraciones.
2. Biblioteca descargable de materiales propios, ejercicios y acompañamientos; ampliar las traducciones inglesas del catálogo anterior.
3. Afinador y ejercicios de entonación con micrófono: requieren pruebas físicas de ruido/latencia.
4. Museo sonoro con mapa y recorridos culturales revisados; ampliar instrumentos virtuales con digitaciones.
5. Corrección SATB con entrada real de voces, alcance explícito de las reglas y explicaciones.
6. Perfiles sincronizados y aula docente con tareas/grupos: requieren diseño de backend, privacidad y recuperación de cuentas.
7. Comunidad, talleres y productos propios, con gestión de inscripciones, moderación y contenidos antes de habilitar servicios reales.
