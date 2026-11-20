import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Descubrir" }} />
      <Tabs.Screen name="mi-lista" options={{ title: "Mi lista" }} />
    </Tabs>
  );
}
