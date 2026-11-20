import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLista, type Estado } from '../../src/services/lista';
import { SERIES_MOCK } from '../../src/services/seriesMock';

const ETIQUETA: Record<Estado, string> = {
  quiero: 'Quiero ver',
  viendo: 'Viendo',
  vista: 'Vista',
  descartada: 'Descartada',
};

export default function MiLista() {
  const router = useRouter();
  const { decisiones } = useLista();

  const items = SERIES_MOCK.flatMap((serie) => {
    const reg = decisiones[serie.id];
    return reg && reg.estado !== 'descartada' ? [{ serie, reg }] : [];
  });

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={items.length === 0 ? styles.vacio : styles.contenido}
      data={items}
      keyExtractor={(i) => String(i.serie.id)}
      ListEmptyComponent={<Text>Aún no agregaste series. Desliza a la derecha en Descubrir.</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={styles.fila}
          accessibilityRole="button"
          accessibilityLabel={`${item.serie.nombre}, ${ETIQUETA[item.reg.estado]}. Abrir detalle`}
          onPress={() => router.push(`/serie/${item.serie.id}`)}
        >
          <View>
            <Text style={styles.nombre}>{item.serie.nombre}</Text>
            <Text style={styles.estado}>
              {ETIQUETA[item.reg.estado]}
              {item.reg.temporada && item.reg.episodio
                ? ` · T${item.reg.temporada} E${item.reg.episodio}`
                : ''}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: { flex: 1, backgroundColor: '#f0f0f0' },
  contenido: { padding: 16, gap: 10 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fila: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  nombre: { fontSize: 18, fontWeight: '600' },
  estado: { fontSize: 14, color: '#666', marginTop: 4 },
});
