import { Link, Tabs } from 'expo-router';

function BotonBuscar() {
  return (
    <Link
      href="/buscar"
      accessibilityRole="button"
      accessibilityLabel="Buscar series"
      style={{ marginRight: 16, fontSize: 16, color: '#007aff' }}
    >
      Buscar
    </Link>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerRight: () => <BotonBuscar /> }}>
      <Tabs.Screen name="index" options={{ title: 'Descubrir' }} />
      <Tabs.Screen name="mi-lista" options={{ title: 'Mi lista' }} />
    </Tabs>
  );
}
