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
node --check para scripts; work/verify.cjs comprueba emparejamiento rítmico (exactos, omisiones, extras, fuera de tolerancia), validación de dictado, límites del tempo, sesión completa de lectura, persistencia y recuperación de almacenamiento corrupto, enlaces locales de catálogo y Preuniversitario. No se ha verificado físicamente audio ni latencia en iOS/Android; la compensación temporal sigue siendo manual.

## Prioridades siguientes
1. Lectura: armaduras, alteraciones accidentales, duración y lectura a primera vista con tiempo.
2. Dictados: variación tonal, duraciones y transcripción en pentagrama; ahora solo se evalúan alturas y octavas.
3. Armonía: entrada real de cuatro voces y reglas explicadas de tesitura, cruces, paralelas y resolución; el Aula actual es un cuestionario conceptual, no un corrector SATB.
4. Seguimiento: resultados por destreza y nivel, objetivos y exportación; el historial actual es local, sin cuenta ni sincronización.
5. Pruebas físicas de audio, interrupciones y latencia en Safari iOS y Chrome Android.

## Publicación
Sitio de pruebas: https://walamort.github.io/walamort-pruebas/
Repositorio principal: exclusivamente rama home-improvements-oct29. Su rama no tiene una URL pública independiente confirmada. Nunca publicar estos cambios en main de producción.
