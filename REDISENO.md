# Portada editorial musical

La portada se genera desde `_fuente/plantilla-inicio.html`. El nuevo diseño carga
`assets/walamort-home.css` después de los componentes compartidos de `estilos.css`;
no carga `diseno-premium.css`. La composición, las fotografías y las rutas se
definen en la plantilla, no mediante parches sobre el HTML generado.

Ambientes: portada fotográfica y seis recorridos, museo verde, academia en papel,
laboratorio de instrumentos, producción fotográfica, servicios cálidos y tienda
con portadas y enlaces existentes. Los instrumentos enlazan tanto a sus fichas
como a los estudios existentes. Las representaciones de los estudios se rotulan
como tales; no se presentan como fotos de ejemplares de la colección.

Interacciones: menú móvil con Escape y retorno de foco; búsqueda sin distinción
de mayúsculas o tildes; filtros combinados por familia; contador anunciado,
estado vacío y restablecimiento; navegación convencional disponible sin JS.
Sin animación continua, audio automático ni nuevas dependencias de producción.

También se corrigen el desbordamiento de la navegación de Academy/Museo/Test y
el selector de copia que interceptaba los botones de avanzar en el calendario.
Los estilos premium de estas páginas y del índice de estudios se incorporan a
sus fuentes para conservarlos al regenerar.

Validación desde la raíz, con Python, Node, Playwright y Chrome disponibles:

```
python _fuente/build.py
python _fuente/check-static.py
node _fuente/check-home.cjs
node _fuente/check-explora.cjs
```

`check-home.cjs` verifica 320/390/768/1440 px, menú y foco, filtros, pestañas con
teclado, selección de calendario, enlaces/recursos/fragmentos, ausencia de errores
JS, apertura de estudios y alternativas sin JS. Guarda capturas en `outputs/`
fuera del repositorio. `check-explora.cjs` cubre las páginas relacionadas y 270
perfiles del test. Los accesos externos se bloquean durante estas pruebas para
no enviar reservas, suscripciones ni pagos.

Límites: las pruebas de estudios comprueban su carga y recursos, no audición ni
grabación/exportación. No se realizaron compras Hotmart, envíos de MailerLite o
reservas WhatsApp. No se añadieron cursos publicados, productos, testimonios ni
proyectos de producción ficticios. El despliegue requiere comprobar GitHub Pages
y el dominio después de publicar; una prueba local no acredita producción.

## Ajuste de marca y dirección de imagen

La portada usa ahora vino oscuro `#210b12`, crema `#fbefd9` y naranja
`#f87927`, siguiendo la referencia proporcionada. El nombre separa Wala en crema
y mort en naranja. Se mantienen ambientes distintos mediante superficies vino,
papel cálido y cobre dentro de la misma paleta.

Las seis tarjetas de recorrido usan escenas editoriales originales generadas con
la herramienta integrada image_gen, sin personas: instrumentos del mundo,
aprendizaje, handpan, escucha, grabación y escenario. Sus archivos WebP están en
`assets/editorial/`, con nombres versionados y un `manifest.json` que conserva los
prompts y la procedencia. No documentan instrumentos ni instalaciones del usuario.
La academia utiliza una variante mayor del recurso de aprendizaje. La portada,
la biografía y el bloque de producción conservan las fotos reales; se retiran
la galería repetida y el retrato duplicado en clases.

Las seis tarjetas suman unos 210 KB. Cargan de forma diferida, con dimensiones
reservadas; el recurso mayor de Academy evita ampliar una miniatura. No se
modificaron portadas comerciales ni recursos de los instrumentos interactivos.

El chequeo de portada sirve las respuestas locales mediante intercepción de
Playwright; así no depende del acceso de Chrome a un puerto local ni envía datos
al exterior. Conserva las mismas comprobaciones de navegación e interacciones.
