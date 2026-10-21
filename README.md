# Cierre del viaje · 23 septiembre 2026

Viaje completado del 8 al 22 de septiembre, con regreso a España. La memoria diaria distingue hechos confirmados, incertidumbres y planificación histórica. La guía pública conserva exclusivamente información de viaje sin incidencias personales.

# Guía de viaje a Perú

Itinerario reutilizable de dos semanas por Lima, Arequipa, el Valle Sagrado, Machu Picchu, Cusco y la Amazonía peruana.

La web incluye el recorrido día a día, guía cultural, mapas, proveedores públicos, recomendaciones de reserva y un presupuesto de referencia para dos adultos en septiembre de 2026.

## Privacidad

Esta edición pública no contiene billetes, tarjetas de embarque, correos privados, teléfonos directos, localizadores, PIN, estados de pago, documentos personales ni enlaces a reservas particulares. Los enlaces incluidos llevan a páginas públicas de hoteles, museos, transportistas y organismos oficiales.

## Desarrollo

```bash
npm ci --ignore-scripts --frozen-lockfile
npm run typecheck
npm run build
```

La rama `main` se publica automáticamente en GitHub Pages mediante GitHub Actions.

## Mantenimiento de seguridad · 21 octubre 2026

Vite 8.0.13 → 8.3.5 y source-map-js 1.2.2 corrigen los avisos de seguridad del entorno de construcción. Se mantiene Bun 1.3.8, el enlace aislado y la política habitual de siete días; el propietario autorizó una excepción solo para este incidente. No se incorpora contenido del repositorio privado del viaje. Validación: auditoría completa de Bun, TypeScript y construcción de producción.

## Security maintenance — 21 October 2026

Builds now use stable Node 24.22.1 (October 21 security release) and npm 11.19.1
(August 26 release), replacing Bun 1.3.8. The owner approved this migration and
the incident release-age exception. Run `nvm use` or prefix commands with
`bash scripts/with-node.sh`; downloaded Node archives are checksum-verified.
`package-lock.json` records npm's dependency tree. `.npmrc` keeps the seven-day
release-age policy and disables dependency lifecycle scripts. No application
content, itinerary, maps, or public URLs are changed. GitHub Pages serves static
files; Node is used only while building. Pull requests now typecheck, audit and
build without publishing; merging main publishes through the existing Pages job.
