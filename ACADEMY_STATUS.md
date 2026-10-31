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

## Dictado escrito y Biblioteca Walamort
- Dictado bilingüe de dos compases 4/4, cinco tonalidades y tres niveles. Generación reproducible por código, cuenta previa, tónica de referencia y reproducción de respuesta.
- Escritura mediante selección de nota/silencio y duración: semicorchea, corchea, negra, negra con puntillo y blanca. Pentagrama SVG con armaduras de Sol/Fa/Re menor, becuadros, puntillos, plicas y líneas adicionales. El editor no usa ligaduras ni permite cruzar barras; las respuestas completas suman ocho pulsos.
- Corrección separada de alturas/silencios y posiciones/duraciones. Se compara por inicio temporal, para evitar desplazar toda la evaluación por una figura distinta. Solo la primera evaluación del dictado se registra en el historial. Mi ruta incorpora esos resultados en oído y dirige preparación/profundización al nuevo dictado.
- Biblioteca bilingüe: fichas de lectura, dictado y construcción de acordes, entre dos y ocho ejercicios; soluciones opcionales, impresión y descarga HTML autocontenida sin scripts. Se puede imprimir o guardar como PDF usando el navegador; no se entrega un PDF precompilado.
- Enlaces reproducibles para preparar clases, con tipo/nivel/tonalidad/cantidad/código. Son actividades de práctica abierta con soluciones consultables, no aula con grupos ni exámenes protegidos.
- Fichas de dictado enlazan exactamente con el ejercicio interactivo; las de acordes abren el laboratorio con grado/séptima/inversión preseleccionados. Integrado en portadas, catálogos, ruta y herramientas anteriores. Inglés con notación C/D/E, metadatos y sitemap; pruebas excluido de indexación.
- Pruebas: node tests/notation.cjs (2250 dictados reproducibles, compases/duraciones, alteraciones, corrección, primer intento, fichas offline y enlaces); se mantienen tests/academy.cjs y tests/creative.cjs.

## Próximas prioridades actualizadas
1. Ampliar lectura con ritmos; editor con ligaduras, edición individual y más compases.
2. Afinador/entonación con micrófono, con pruebas físicas antes de evaluar rendimiento.
3. Recorridos del museo sonoro y digitaciones guiadas en instrumentos virtuales.
4. Más cursos por instrumento y traducción inglesa del catálogo antiguo.
5. Aula docente con cuentas/tareas/resultados compartidos, comunidad y servicios con gestión real: aún requieren backend, privacidad y operación de contenidos.

## Integración del 31 de octubre
Se integró el cambio remoto de retrato sin sobrescribirlo. Las pruebas de Academy, creación y notación pasaron. El servidor local permite comprobar el dictado completo (escucha, escritura, evaluación 100% y primer intento guardado). En esa integración, Git Credential Manager denegó acceso al almacén de credenciales de Windows; el usuario completó después ambas subidas y se confirmó la publicación del dictado y la biblioteca. No se cambiaron credenciales ni protecciones del sistema.

## Lectura de notas a primera vista — 31 de octubre
Módulo bilingüe de identificación visual con claves de sol/fa/do (alto) o mezcla; siete armaduras mayores (Do, Sol, Re, La, Fa, Si bemol y Mi bemol); tres niveles, líneas adicionales y alteraciones escritas en avanzado. No evalúa ejecución instrumental. Diez preguntas por sesión, sin límite por defecto o con 5/8/12 segundos por pregunta, pausa explícita/al salir de pestaña, corrección explicada y audio posterior con timbre elegido. Precisión al historial local; media de respuesta y omisiones solo como orientación. Referencia imprimible de claves y armaduras integrada en Biblioteca, ruta y catálogo.
Pruebas: node tests/sight-reading.cjs cubre 6300 preguntas, notas/MIDI, armaduras en tres claves, opciones únicas, sesión bilingüe completa, pausa/reanudación, límites de tiempo e integración de progreso. También se verificó en navegador local una sesión con un vencimiento, pausa/reanudación y corrección de Fa sostenido 2 en clave de fa/La mayor.

## Afinador y entonación — 31 de octubre
Módulo bilingüe integrado en catálogo, portadas, laboratorio y ruta. Afinador libre y práctica de nota objetivo, referencia La4 ajustable, tolerancia configurable y timbres de piano/guitarra/flauta/violín. Medidor de frecuencia y cents, nivel de entrada y estabilidad orientativa; rango aproximado 40–1200 Hz para una sola nota.
Micrófono solo por acción explícita; análisis local sin grabar ni subir audio. Detener, ocultar o salir libera las pistas. Demostración sintetizada sin permisos, excluida de guardado. Historial/exportación JSON de resúmenes numéricos locales, separado de las calificaciones de cuestionarios. La práctica estima tiempo dentro del margen; no califica calidad vocal ni interpretación.
Validación: tests/pitch.cjs pasa 168 señales sintetizadas en cuatro frecuencias de muestreo, armónicos/ruido, silencio/saturación, calibración, tiempos y flujos simulados de permisos/cancelación/liberación. Vista inglesa móvil de 390 px y demo revisadas en navegador. Falta validación física con distintos micrófonos, instrumentos y dispositivos; no se promete precisión universal.
Referencias técnicas: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia y https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatTimeDomainData
Prioridades siguientes: validación física del afinador; lectura con ritmo y dictados más extensos; museo sonoro y digitaciones; cursos por instrumento y traducción del catálogo antiguo. Cuentas docentes/comunidad requieren backend y operación real.

Corrección de estado del afinador: al detener la entrada se limpian nota, frecuencia, desviación, fuente y nivel; se oculta la aguja sin señal y se actualiza su etiqueta accesible. Se conservan métricas de sesión y posibilidad de guardar. Prueba de regresión bilingüe y demo local verificadas sin activar el micrófono físico.

## Lectura rítmica — 31 de octubre
Ampliación bilingüe en lectura-primera-vista/#rhythm-reading. Sesiones de diez preguntas alternan duración de figura/silencio y pulsos faltantes en compases 2/4, 3/4 y 4/4, con negra como unidad. Tres niveles: redonda/blanca/negra; corcheas y silencios; puntillos. No incluye compases compuestos, síncopas con ligaduras ni interpretación instrumental.
Corrección explicada con suma de duraciones. Audio posterior a responder: cuenta previa a 100 pulsos por minuto y fragmento escrito; no reproduce la parte faltante. Selector de piano/guitarra/flauta/violín junto a la actividad, sincronizado con el selector de notas; parada explícita y al ocultar la pestaña. No se reproduce audio automáticamente.
Resultado local independiente con identificador Lectura rítmica, visible en historial del catálogo español; no se mezcla con precisión de golpes ni con diagnóstico de ritmo. Enlaces añadidos a catálogo español/inglés, Mi ruta y preuniversitario disponible. Las páginas conservan la política de indexación específica de cada repositorio.
Validación: tests/rhythm-reading.cjs comprueba 3000 preguntas, suma exacta de compases, niveles, opciones únicas, diez respuestas bilingües, un único guardado por sesión, sincronización de timbre y programación/cancelación de audio simulada. También pasan sight-reading.cjs y academy.cjs. Revisión visual de pregunta y corrección en pantalla de 390 px en español e inglés; sin reproducir audio físico durante la clase del usuario. La escucha real y el micrófono del afinador siguen pendientes de prueba física.

## Biblioteca: fichas rítmicas y referencia de duraciones
Nuevo tipo de ficha bilingüe rhythm: reproduce preguntas por código y nivel, con 2/4/6/8 ejercicios de figuras y compases simples. Incluye tabla de seis figuras, silencios y equivalencias en pulsos de negra. Soluciones opcionales, impresión y descarga HTML autocontenida sin scripts ni dependencias externas. La tonalidad se deshabilita por no aplicarse al ejercicio rítmico.
Audio en la web: cuatro pulsos de cuenta previa y luego el fragmento escrito; conserva silencios y no reproduce la duración faltante. El enlace de práctica abre la actividad del mismo nivel, no el mismo cuestionario. El enlace compartido de Biblioteca sí conserva los ejercicios exactos; no es un examen reservado. Se detiene el audio al imprimir. Acceso desde lectura rítmica y Biblioteca en ambos idiomas.
Pruebas ampliadas de notación en ambos repositorios: generación reproducible, referencia y metadatos, soluciones incluidas/excluidas del HTML, descarga sin scripts ni controles web, cuatro pulsos iniciales y posición temporal del fragmento. Pruebas de lectura rítmica y revisión visual de tabla en navegador. Se entregan ejemplos HTML en español/inglés con y sin soluciones. Escucha física sigue pendiente.

## Enlaces de estudiante y solucionario
Biblioteca conserva la opción de soluciones mediante solutions=0/1; por defecto se ocultan y solo el valor exacto 1 las activa. Añade enlaces explícitos de ficha del estudiante y solucionario con el mismo código/ejercicios. El encabezado identifica el solucionario. Ambas vistas siguen siendo públicas y se explica que no constituyen exámenes protegidos.
Las fichas web, impresas y HTML descargables incluyen líneas vacías para nombre y fecha; no se recopilan esos datos. Los nombres de descarga distinguen student/solutions. Ejemplos HTML actualizados en ambos idiomas.
Validación en ambos repositorios con tests/notation.cjs: enlaces y parámetros, soluciones excluidas/incluidas en DOM/descarga, valores inválidos, identidad impresa y funciones previas. En navegador se siguió el enlace de solucionario a estudiante y se confirmaron cero bloques de solución.

## Cambio de idioma sin perder la ficha
El enlace español/inglés de Biblioteca ahora conserva tipo, nivel, tonalidad, cantidad, código y opción de soluciones, y se actualiza al cambiar los filtros. Pruebas de notación en ambos repositorios verifican destinos por idioma y parámetros. Comprobado en navegador con seis ejercicios avanzados, código 987 y soluciones activas: mismas seis representaciones SVG al pasar de español a inglés y mismo solucionario.

## Acceso visible desde la portada de desarrollo
Panel superior con accesos a Centro de práctica, Preuniversitario y Mi ruta para evitar confundir la portada de pruebas con el catálogo. Revisión visual en escritorio y 390 px; enlaces relativos dentro de cada sitio. Solo pruebas y home-improvements-oct29; sin nuevos cambios en producción.

