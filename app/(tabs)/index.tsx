import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TarjetaSerie, type Accion } from '../../src/components/TarjetaSerie';
import { decidirSerie, deshacer, pendientes, useLista, type Estado } from '../../src/services/lista';
import { SERIES_MOCK } from '../../src/services/seriesMock';

const ESTADO_POR_ACCION: Record<Accion, Estado> = {
  quiero: 'quiero',
  descartar: 'descartada',
  vista: 'vista',
};

export default function Descubrir() {
  const { decisiones, historial } = useLista();
  const serie = pendientes(SERIES_MOCK, decisiones)[0];

  return (
    <View style={styles.pantalla}>
      {serie ? (
        <TarjetaSerie
          key={serie.id}
          serie={serie}
          onDecidir={(accion) => decidirSerie(serie.id, ESTADO_POR_ACCION[accion])}
        />
      ) : (
        <View style={styles.vacio}>
          <Text style={styles.textoVacio}>No hay más series por ahora</Text>
        </View>
      )}
      <Pressable
        style={[styles.deshacer, historial.length === 0 && styles.deshabilitado]}
        disabled={historial.length === 0}
        accessibilityRole="button"
        accessibilityLabel="Deshacer la última decisión"
        onPress={deshacer}
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
