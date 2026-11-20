import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SERIES_MOCK } from '../../src/services/seriesMock';
import { validarProgreso, type ErrorCampo } from '../../src/services/validacion';

export default function SerieDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serie = SERIES_MOCK.find((s) => s.id === Number(id));

  const [temporada, setTemporada] = useState('');
  const [episodio, setEpisodio] = useState('');
  const [errores, setErrores] = useState<ErrorCampo[]>([]);
  const [mensaje, setMensaje] = useState('');

  if (!serie) {
    return (
      <View style={styles.centro}>
        <Text>No se encontró la serie.</Text>
      </View>
    );
  }

  const errorDe = (campo: ErrorCampo['campo']) => errores.find((e) => e.campo === campo)?.mensaje;

  function guardar() {
    const r = validarProgreso(temporada, episodio);
    if (!r.ok) {
      setErrores(r.errores);
      setMensaje('');
      return;
    }
    setErrores([]);
    setMensaje(`Progreso guardado: temporada ${r.temporada}, episodio ${r.episodio}.`);
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Stack.Screen options={{ title: serie.nombre }} />
      <Text style={styles.titulo}>{serie.nombre}</Text>
      <Text style={styles.generos}>{serie.generos}</Text>
      <Text style={styles.resumen}>{serie.resumen}</Text>

      <Text style={styles.subtitulo}>Mi progreso</Text>

      <Text style={styles.etiqueta}>Temporada</Text>
      <TextInput
        style={styles.input}
        value={temporada}
        onChangeText={setTemporada}
        keyboardType="number-pad"
        accessibilityLabel="Temporada actual"
      />
      {errorDe('temporada') ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {errorDe('temporada')}
        </Text>
      ) : null}

      <Text style={styles.etiqueta}>Episodio</Text>
      <TextInput
        style={styles.input}
        value={episodio}
        onChangeText={setEpisodio}
        keyboardType="number-pad"
        accessibilityLabel="Episodio actual"
      />
      {errorDe('episodio') ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {errorDe('episodio')}
        </Text>
      ) : null}

      <Pressable
        style={styles.boton}
        accessibilityRole="button"
        accessibilityLabel="Guardar progreso"
        onPress={guardar}
      >
        <Text style={styles.textoBoton}>Guardar progreso</Text>
      </Pressable>

      {mensaje ? (
        <Text style={styles.ok} accessibilityLiveRegion="polite">
          {mensaje}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contenedor: { padding: 20, gap: 6 },
  titulo: { fontSize: 26, fontWeight: '700' },
  generos: { fontSize: 14, color: '#666', marginBottom: 8 },
  resumen: { fontSize: 16, lineHeight: 22 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  etiqueta: { fontSize: 14, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fff' },
  error: { color: '#c0392b', fontSize: 13 },
  boton: { marginTop: 16, backgroundColor: '#2c3e50', padding: 14, borderRadius: 12, alignItems: 'center' },
  textoBoton: { color: '#fff', fontWeight: '600', fontSize: 16 },
  ok: { color: '#27ae60', marginTop: 12 },
});
