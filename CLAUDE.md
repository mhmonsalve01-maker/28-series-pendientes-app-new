# Series pendientes (app)

App para descubrir series deslizando tarjetas (derecha = quiero ver, izquierda = no me interesa) y marcar avances.

## Stack
Expo + React Native + TypeScript + Expo Router, SQLite local (expo-sqlite),
react-native-gesture-handler + react-native-reanimated, expo-sensors, expo-haptics.

## Comandos
- `npx expo start` · `npm run lint` · `npm run typecheck` · `npm run format:check` · `npm test`

## Estructura
app/ (rutas Expo Router) · src/db · src/repositories · src/services · src/api · src/sensors · src/components

## Sí
- SQL parametrizado solo en src/repositories.
- Cada gesto tiene un botón equivalente con accessibilityLabel.
- Llamar isAvailableAsync() antes de usar un sensor y cancelar la suscripción al salir de la pantalla.
- Tokens solo en expo-secure-store.
- La app nunca debe romperse si falta un sensor o un permiso.

## No
- Nunca leer ni escribir .env*, claves, keystores ni credenciales.
- Nunca poner firebaseConfig ni secretos en la app; solo EXPO_PUBLIC_API_URL (es pública).
- Nunca salir de esta carpeta.
- Nunca guardar tokens en AsyncStorage.
- No agregar funciones extra antes de cumplir los requisitos del documento del proyecto.
- Acciones con efecto fuera de la máquina (push, deploy, eas) solo con permiso explícito.
