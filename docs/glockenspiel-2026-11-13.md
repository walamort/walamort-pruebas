# Glockenspiel Studio · revisión premium

## Entrega pública
Tablero fotorrealista 1942×809 con 25 zonas accesibles alineadas. Imagen generada, descrita en assets/README.md.
Cuatro muestras estéreo originales de VSCO 2 CE (CC0), con hashes y créditos en samples/. Sus nombres usan otra convención de octava: el manifiesto registra raíces medidas en Hz para afinar el mapeo a A4=440. No se anuncian 25 grabaciones independientes ni capas múltiples de intensidad.
Volumen, resonancia, brillo, ambiente, delay y carácter de ataque. El ataque suave se obtiene por filtrado.
Generación en cuatro paletas, edición por pasos de hasta 64 eventos/64 pulsos, intensidad/duración/altura por evento.
Biblioteca local con 10 proyectos; JSON validado con parámetros, MIDI con tempo y WAV estéreo 44.1 kHz con efectos. Sin micrófono ni envío de proyectos a servidores.
Planificador de audio con anticipación, límite de voces, cancelación y parada al ocultar la página.

## Métodos
Solo Primeros pasos, de seis páginas, queda en descargas públicas.
Los tres métodos comerciales son Principiante, Intermedio y Avanzado: 26 páginas, ocho capítulos, ocho estudios y seis canciones originales por nivel. Incluyen pentagramas didácticos a altura real, actividades de creación, respuestas, rúbrica y plan de cuatro semanas.
Archivos comerciales y paquetes de práctica JSON/MIDI conservados fuera del repositorio público. No hay checkout ficticio: Hotmart pendiente de precio y registro real.

## Verificación
Prueba de navegador: carga acústica, generación, guardado, recuperación tras recargar, edición de eventos, importación JSON y descargas JSON/MIDI/WAV. WAV inspeccionado: estéreo 44100 Hz, audio no vacío y sin clipping en la muestra exportada. Ancho móvil 390 px sin desbordamiento global.
Pruebas automatizadas de mapeo/afinación, límites, generación, integridad de muestras, cancelación de carga y separación de métodos públicos/comerciales.
