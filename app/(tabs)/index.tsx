import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TarjetaSerie, type Accion } from '../../src/components/TarjetaSerie';
import { tic } from '../../src/sensors/haptics';
import { useInclinacion, type EstadoInclinacion } from '../../src/sensors/useInclinacion';
import { decidirSerie, deshacer, pendientes, useLista, type Estado } from '../../src/services/lista';
import { SERIES_MOCK } from '../../src/services/seriesMock';

const ESTADO_POR_ACCION: Record<Accion, Estado> = {
  quiero: 'quiero',
  descartar: 'descartada',
  vista: 'vista',
};

const MENSAJE: Record<EstadoInclinacion, string> = {
  apagado: 'Decide inclinando el teléfono: derecha = Quiero, izquierda = Descartar.',
  iniciando: 'Activando el sensor de movimiento…',
  listo: 'Inclina a la derecha para «Quiero» o a la izquierda para «Descartar». Vuelve al centro entre cada decisión.',
  'no-disponible': 'Este dispositivo no tiene sensor de movimiento disponible. Usa los gestos o los botones.',
  'sin-permiso': 'Sin permiso de movimiento. Puedes seguir con los gestos o los botones.',
};

export default function Descubrir() {
  const { decisiones, historial } = useLista();
  const serie = pendientes(SERIES_MOCK, decisiones)[0];
  const [inclinar, setInclinar] = useState(false);

  const estadoSensor = useInclinacion(inclinar, (decision) => {
    if (!serie) return;
    void tic();
    decidirSerie(serie.id, decision === 'quiero' ? 'quiero' : 'descartada');
  });

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

      <Text style={styles.mensaje} accessibilityLiveRegion="polite">
        {MENSAJE[estadoSensor]}
      </Text>

      <View style={styles.acciones}>
        <Pressable
          style={[styles.boton, inclinar && styles.botonActivo]}
          accessibilityRole="switch"
          accessibilityState={{ checked: inclinar }}
          accessibilityLabel="Decidir inclinando el teléfono"
          onPress={() => setInclinar((v) => !v)}
        >
          <Text style={styles.textoBoton}>{inclinar ? 'Inclinación: activa' : 'Activar inclinación'}</Text>
        </Pressable>
        <Pressable
          style={[styles.boton, historial.length === 0 && styles.deshabilitado]}
          disabled={historial.length === 0}
          accessibilityRole="button"
          accessibilityLabel="Deshacer la última decisión"
          onPress={deshacer}
        >
          <Text style={styles.textoBoton}>Deshacer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f0f0f0' },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textoVacio: { fontSize: 18 },
  mensaje: { textAlign: 'center', color: '#555', fontSize: 13, paddingHorizontal: 24, marginBottom: 8 },
  acciones: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 },
  boton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#34495e' },
  botonActivo: { backgroundColor: '#27ae60' },
  deshabilitado: { opacity: 0.4 },
  textoBoton: { color: '#fff', fontWeight: '600' },
});
