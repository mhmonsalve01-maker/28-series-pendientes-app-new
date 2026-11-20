# Series pendientes (app)

Descubre series deslizando tarjetas: derecha = quiero ver, izquierda = no me interesa; luego marca avances.

## Requisitos
Node, un teléfono con Expo Go (o emulador de Android).

## Instalación y ejecución
```bash
npm install
cp .env.example .env   # EXPO_PUBLIC_API_URL (URL pública, no secreta)
npx expo start
```

## Pruebas y calidad
`npm run lint` · `npm run typecheck` · `npm test` (también se ejecutan en el pre-commit).

## Capturas
Guardar en `docs/capturas/`: Descubrir, Mi lista, Detalle y Buscar.

## Configuración de IA
Ver `CLAUDE.md`, `.claude/settings.json` y la carpeta `ia/`.
