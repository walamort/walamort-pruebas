# Revisión técnica del sitio — 13 de noviembre de 2026

## Alcance
Se revisaron las 105 páginas HTML públicas de cada repositorio (plantillas de _fuente excluidas), enlaces y recursos locales, fragmentos, identificadores, títulos, descripciones, encabezados H1, alternativas de imágenes, nombres estáticos de controles y destinos ARIA. Se ejecutaron las 61 suites JavaScript de cada repositorio. Trece rutas públicas representativas devolvieron HTTP 200. Esto no equivale a probar manualmente cada interacción ni a certificar WCAG o posicionamiento en buscadores.

## Problemas corregidos
- Lectura rítmica: el destino #rhythm-reading solo existía después de ejecutar JavaScript. Ahora tiene una sección estática en español e inglés, con explicación y enlace imprimible de respaldo. El programa reutiliza esa sección en lugar de duplicarla. Quedan resueltas las referencias de lectura, ruta personal, práctica y preuniversitario.
- Estudios instrumentales: se asociaron siete controles de tongue drum a sus etiquetas visibles; el selector interno de afinación y el selector de carácter sonoro del handpan recibieron nombres accesibles. Ambos estudios tienen ahora un encabezado H1 accesible sin modificar su composición visual.
- Metadatos: se añadieron descripciones a dictado melódico, escalas auditivas, lectura musical, práctica rítmica, test y la antigua página de idiomas.
- Redirección antigua: /idiomas/ usa ahora una ruta relativa a clases, conservando el contexto del sitio de pruebas. Mantiene noindex y ofrece un encabezado de respaldo.
- 404 de pruebas: sus cinco accesos a semana, métodos, servicios, clases y contacto apuntan al inicio del sitio de pruebas, no a fragmentos inexistentes de la propia 404.

## Prevención
scripts/site-integrity.py comprueba estas condiciones sin navegador ni red y ya forma parte del trabajo de GitHub que verifica cada push y pull request. Resuelve la ruta base desde el canonical, por lo que no depende del nombre de la carpeta de checkout. Las políticas CSP y permisos del workflow se conservan.

## Verificación
- 105 páginas por repositorio sin incidencias en las comprobaciones estáticas indicadas.
- 61 suites JavaScript aprobadas por repositorio después de los cambios.
- Políticas de seguridad comprobadas: 111 HTML en principal (incluye plantillas) y 105 en pruebas.
- En navegador: enlace rítmico ES/EN, una única sección, inicio y respuesta de ejercicio, etiqueta de volumen enfocando su deslizador y selector de carácter sonoro reconocido por nombre.
- Inicio a 390 px: sin desbordamiento horizontal; menú desplegable y búsqueda con seis resultados para «ritmo».
- Se conservaron los enlaces existentes de checkout. No se cambiaron colores ni alojamiento.

## Pendientes prioritarios
1. Completar y revisar la traducción portuguesa de las herramientas que todavía abren en español, con pruebas editoriales y musicales.
2. Realizar pruebas con lectores de pantalla y dispositivos físicos (MIDI, micrófono, auriculares), además de la automatización.
3. Revisar contraste, tamaño táctil y rendimiento con mediciones por página en una conexión móvil real.
4. Validar importaciones MIDI/MusicXML en varias aplicaciones externas cuando estén disponibles.

La revisión estática no verifica disponibilidad de servicios externos, pagos reales, calidad de todas las muestras ni todos los estados generados por JavaScript.
