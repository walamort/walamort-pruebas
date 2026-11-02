# Seguridad de Walamort

## Controles aplicados

- Política CSP por página: scripts locales e inline autorizados por SHA-256, sin `unsafe-inline` ni `unsafe-eval` en JavaScript. Atributos de eventos inline bloqueados.
- Conexiones limitadas al propio sitio y al formulario existente de MailerLite; imágenes externas a las miniaturas de YouTube, fuentes a Google Fonts e iframes al propio sitio/YouTube. Audio local, blob y data conservados.
- `base-uri 'none'`, `object-src 'none'`, `worker-src 'none'`, destinos de formularios limitados y política de referente que evita enviar la ruta completa a otras webs.
- Exportación CSV de informes protegida también frente a fórmulas precedidas por espacios y controles.
- Validaciones existentes conservadas: tamaño de archivos JSON/audio, esquemas de proyectos e informes, límites del historial. Importaciones y grabaciones permanecen locales.
- Comprobación automática en GitHub Actions con permisos de solo lectura y acción de checkout fijada por hash. No se ejecuta código de pull requests con secretos de producción.

## Antes de publicar cambios

Si se modifica un script inline, ejecutar `python scripts/security-policy.py` y después `python scripts/security-policy.py --check` y `node tests/security.cjs`. Probar en navegador audio, importaciones, búsqueda y el formulario afectado. Las hojas de estilo mantienen `unsafe-inline` por el diseño actual y los controles visuales dinámicos; esto no autoriza JavaScript inline.

## Límites del alojamiento y tareas de la cuenta

La CSP se entrega mediante HTML en GitHub Pages. No equivale a un cortafuegos ni protege una cuenta de GitHub comprometida. `frame-ancestors` y las cabeceras HTTP de servidor no se configuran con etiquetas meta. No se añadieron archivos `_headers` que GitHub Pages no aplicaría.

Para una capa adicional hay que configurar cabeceras reales en un proveedor compatible o un proxy del dominio: `Content-Security-Policy: frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` y una Permissions-Policy que permita micrófono únicamente al propio sitio. HSTS debe revisarse junto con HTTPS y los subdominios antes de activarlo. No cambiar DNS sin revisar correo y servicios existentes.

El titular debe conservar MFA/passkeys y recuperación en GitHub, Hotmart y el registrador; revisar colaboradores y proteger las ramas de publicación. No se modificaron credenciales, DNS, contratos ni configuración de cuentas en este bloque.

Esta revisión no es una auditoría exhaustiva ni una garantía de invulnerabilidad. No se ejecutaron ataques contra terceros, compras ni escaneos intrusivos.
