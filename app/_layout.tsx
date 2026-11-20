import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { migrar, NOMBRE_DB } from '../src/db/migraciones';
import { cargarLista } from '../src/services/lista';

async function iniciarDb(db: SQLiteDatabase) {
  await migrar(db);
  await cargarLista(db);
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={NOMBRE_DB} onInit={iniciarDb}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="serie/[id]" options={{ title: 'Detalle' }} />
          <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
        </Stack>
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
