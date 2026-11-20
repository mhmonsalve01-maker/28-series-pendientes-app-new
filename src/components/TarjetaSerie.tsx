import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { decidir, type Decision } from '../services/decision';
import type { Serie } from '../services/seriesMock';

type Props = {
  serie: Serie;
  onDecidir: (decision: 'quiero' | 'descartar') => void;
};

const DURACION_SALIDA = 250;

export function TarjetaSerie({ serie, onDecidir }: Props) {
  const { width: ancho } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  function salir(decision: 'quiero' | 'descartar') {
    const destino = decision === 'quiero' ? ancho * 1.5 : -ancho * 1.5;
    x.value = withTiming(destino, { duration: DURACION_SALIDA });
    setTimeout(() => onDecidir(decision), DURACION_SALIDA);
  }

  function terminar(dx: number, vx: number) {
    const decision: Decision = decidir(dx, vx, ancho);
    if (decision === 'volver') {
      x.value = withSpring(0);
      y.value = withSpring(0);
    } else {
      salir(decision);
    }
  }

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY;
    })
    .onEnd((e) => terminar(e.translationX, e.velocityX));

  const estilo = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${interpolate(x.value, [-ancho, 0, ancho], [-15, 0, 15])}deg` },
    ],
    opacity: interpolate(Math.abs(x.value), [0, ancho], [1, 0.3]),
  }));

  return (
    <View style={styles.contenedor}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.tarjeta, estilo]}>
          <Text style={styles.titulo}>{serie.nombre}</Text>
          <Text style={styles.generos}>{serie.generos}</Text>
          <Text style={styles.resumen}>{serie.resumen}</Text>
        </Animated.View>
      </GestureDetector>

      <View style={styles.botones}>
        <Pressable
          style={[styles.boton, styles.descartar]}
          accessibilityRole="button"
          accessibilityLabel={`Descartar ${serie.nombre}`}
          onPress={() => salir('descartar')}
        >
          <Text style={styles.textoBoton}>Descartar</Text>
        </Pressable>
        <Pressable
          style={[styles.boton, styles.quiero]}
          accessibilityRole="button"
          accessibilityLabel={`Quiero ver ${serie.nombre}`}
          onPress={() => salir('quiero')}
        >
          <Text style={styles.textoBoton}>Quiero</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  tarjeta: {
    width: '100%',
    minHeight: 320,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  titulo: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  generos: { fontSize: 14, color: '#666', marginBottom: 12 },
  resumen: { fontSize: 16, lineHeight: 22 },
  botones: { flexDirection: 'row', gap: 16, marginTop: 24 },
  boton: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  descartar: { backgroundColor: '#c0392b' },
  quiero: { backgroundColor: '#27ae60' },
  textoBoton: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
