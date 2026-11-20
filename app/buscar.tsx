import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { buscarGuardadas } from '../src/repositories/serieRepository';
import { buscarSeries, unirResultados } from '../src/services/busqueda';
import { SERIES_MOCK } from '../src/services/seriesMock';
import type { SerieGuardada } from '../src/services/tipos';

export default function Buscar() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [texto, setTexto] = useState('');
  const [guardadas, setGuardadas] = useState<SerieGuardada[]>([]);

  useEffect(() => {
    if (texto.trim() === '') return;
    let cancelado = false;
    async function buscar() {
      const filas = await buscarGuardadas(db, texto);
      if (!cancelado) setGuardadas(filas);
    }
    void buscar();
    return () => {
      cancelado = true;
    };
  }, [db, texto]);

  const resultados =
    texto.trim() === '' ? [] : unirResultados(guardadas, buscarSeries(SERIES_MOCK, texto));

  return (
    <View style={styles.pantalla}>
      <TextInput
        style={styles.input}
        value={texto}
        onChangeText={setTexto}
        placeholder="Buscar por nombre"
        accessibilityLabel="Buscar series por nombre"
        autoCorrect={false}
      />
      <FlatList
        data={resultados}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={styles.contenido}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            {texto.trim() === '' ? 'Escribe el nombre de una serie.' : 'Sin resultados.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.fila}
            accessibilityRole="button"
            accessibilityLabel={`Abrir detalle de ${item.nombre}`}
            onPress={() => router.push(`/serie/${item.id}`)}
          >
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.generos}>{item.generos}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f0f0f0', padding: 16 },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fff' },
  contenido: { gap: 10, paddingTop: 16 },
  vacio: { textAlign: 'center', marginTop: 24, color: '#666' },
  fila: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  nombre: { fontSize: 18, fontWeight: '600' },
  generos: { fontSize: 14, color: '#666', marginTop: 4 },
});
