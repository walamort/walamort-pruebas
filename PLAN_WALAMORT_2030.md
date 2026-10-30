# Walamort — Plan maestro de producto, contenidos y posicionamiento

## Norte
Una plataforma cultural y educativa que conecta **descubrir → escuchar → tocar → aprender → crear → conectar**. Mantener autoría de Walter Agudelo Múnera, materiales reales, rigor cultural y accesibilidad.

## Reglas editoriales y técnicas
- No inventar instrumentos de la colección, testimonios, alianzas, cursos lanzados, precios, certificados ni resultados.
- Fotografías propias existentes en `/fotos/`; documentar derechos y texto alternativo descriptivo.
- Cada instrumento tiene una página canónica `/instrumentos/{slug}/` que enlaza a museo, estudio virtual, métodos, videos, clases y fuentes solo si existen.
- Evitar páginas vacías, enlaces rotos, contenido duplicado y títulos SEO repetidos.
- No afirmar que un curso en preparación está disponible para compra.
- No incorporar analítica invasiva, formularios de menores ni envío de datos sin consentimiento y política de privacidad.

## Navegación propuesta
- Explorar: `/museo/`, `/instrumentos/`, `/test-instrumento/`
- Aprender: `/academia/`, `/guias/`, clases
- Tocar: `/instrumentos-virtuales/`
- Escuchar: composiciones, conciertos, bases de improvisación (publicar solo rutas verificadas)
- Contratar: talleres, producción y clases (rutas verificadas)
- Sobre mí / contacto

## SEO: primera fase (0–30 días)
- [ ] Auditar con rastreo real HTTP: 200/301/404, canonical, indexabilidad y navegación móvil.
- [ ] Verificar sitemap contra rutas realmente publicadas; eliminar 404 y añadir nuevas páginas.
- [ ] Revisar robots.txt y encabezados de caché.
- [ ] Un H1 único, title/description y OpenGraph por página.
- [ ] Breadcrumbs visibles y JSON-LD BreadcrumbList cuando corresponda.
- [ ] Enlaces internos de páginas instrumentales hacia museo, guías, virtuales, clases, videos.
- [ ] Imágenes responsive con dimensiones explícitas, lazy-loading fuera del hero y compresión.
- [ ] Core Web Vitals en móvil: LCP, INP y CLS; medir antes de optimizar.
- [ ] Search Console: verificar propiedad, enviar sitemap, revisar cobertura y consultas; requiere acceso del propietario.
- [ ] Analytics respetuosa con privacidad y eventos: test_started, test_completed, virtual_instrument_played, guide_downloaded, contact_clicked, checkout_clicked.
- [ ] Confirmar versión portuguesa real; hreflang solo en páginas equivalentes.

## Museo y documentación (30–90 días)
- [ ] Inventario con identificador, nombre local, familia, procedencia verificada, fotografía, fuente, grabación, permiso de uso, URL y estado.
- [ ] 12 primeras fichas completas a partir de instrumentos realmente disponibles.
- [ ] Clips: nota aislada, escala/patrón, ejemplo musical y contexto; normalización y metadatos.
- [ ] Comparador auditivo A/B con controles accesibles.
- [ ] Citas de fuentes, autoría, fecha de actualización y correcciones.
- [ ] Evitar atribuir una tradición a una región sin verificar con fuentes o especialistas.

## Academy y conversiones (30–120 días)
- [ ] Landing de curso piloto con objetivos, temario, muestra gratuita, preguntas frecuentes y estado real.
- [ ] Solicitud voluntaria de interés (sin almacenar datos hasta tener política y proveedor configurado).
- [ ] Fichas de métodos reales con niveles, muestras, requisitos, precios y checkout verificados.
- [ ] Página institucional: talleres y conciertos didácticos, formatos, públicos y formulario/medio de contacto.
- [ ] Validar con usuarios: 5 pruebas de navegación móvil y 10 entrevistas a potenciales estudiantes.
- [ ] Test orientativo: gustos, presupuesto, volumen, portabilidad y objetivos; explicar limitaciones.

## Studio y comunidad (3–12 meses)
- [ ] Unificar interfaz de kalimba/tongue drum/handpan si están efectivamente disponibles.
- [ ] Guardado local opcional de melodías, exportación MIDI/audio cuando sea viable y probado.
- [ ] Biblioteca Play Along con licencias claras.
- [ ] Primer sample pack de sonidos originales con términos de uso.
- [ ] Probar talleres y alianzas institucionales antes de lanzar una membresía.
- [ ] Comunidad moderada, privacidad y seguridad como condiciones previas.

## Métricas de decisión
1. Tráfico orgánico no de marca y páginas indexadas.
2. Test completado / iniciado.
3. Interacciones significativas por instrumento.
4. Descargas de recursos y solicitudes de clase/taller.
5. Conversiones a ventas reales, ingresos netos y coste de producción.
6. Retorno a 30 días y satisfacción de estudiantes.

## Experimentos priorizados
A. Página de kalimba: ¿test + virtual + guía mejora la solicitud de clases?
B. Taller institucional piloto: ¿una demostración documentada genera contrataciones?
C. Curso de exploración: ¿la lección gratuita genera suficiente interés antes de producir 24 videos?
D. Sample pack: ¿productores valoran sonidos reales de la colección?

## Dependencias del propietario
Inventario real de instrumentos, fotografías y grabaciones autorizadas, permisos culturales, fuentes verificables, acceso a Search Console, políticas legales revisadas, oferta y tarifas confirmadas.

## Principio de lanzamiento
Publicar solo funciones verificadas; medir uso; iterar. Ningún resultado SEO o ingreso está garantizado.
