import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TarjetaSerie } from '../../src/components/TarjetaSerie';
import { SERIES_MOCK } from '../../src/services/seriesMock';

export default function Descubrir() {
  const [indice, setIndice] = useState(0);
  const serie = SERIES_MOCK[indice];

  return (
    <View style={styles.pantalla}>
      {serie ? (
        <TarjetaSerie
          key={serie.id}
          serie={serie}
          onDecidir={() => setIndice((i) => i + 1)}
        />
      ) : (
        <View style={styles.vacio}>
          <Text style={styles.textoVacio}>No hay más series por ahora</Text>
        </View>
      )}
      <Pressable
        style={[styles.deshacer, indice === 0 && styles.deshabilitado]}
        disabled={indice === 0}
        accessibilityRole="button"
        accessibilityLabel="Deshacer la última decisión"
        onPress={() => setIndice((i) => Math.max(0, i - 1))}
      >
        <Text style={styles.textoDeshacer}>Deshacer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f0f0f0' },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textoVacio: { fontSize: 18 },
  deshacer: {
    alignSelf: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#34495e',
  },
  deshabilitado: { opacity: 0.4 },
  textoDeshacer: { color: '#fff', fontWeight: '600' },
});
