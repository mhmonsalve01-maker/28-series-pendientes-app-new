# Bitácora de IA

| Fecha | Propósito | Evidencia | Validación | Decisión |
|---|---|---|---|---|
| 2026-11-20 | Corregir error de lint: ref leída durante el render en TarjetaSerie | Salida de `npm run lint` (react-hooks/refs) | `npm run lint` sin errores tras el cambio | Aceptado: se usó useSharedValue en vez de useRef |
| 2026-11-20 | Detectar tipos de Jest faltantes | Salida del typecheck en el hook (TS2593) | Typecheck y commit pasan con `"types": ["jest"]` | Aceptado |
| 2026-11-20 | Persistencia en SQLite (modelo, migraciones, repositorio) | Pruebas pasando; app cerrada y reabierta; modo avión | La lista, el detalle y la búsqueda funcionan sin conexión | Aceptado |
