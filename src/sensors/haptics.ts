import * as Haptics from 'expo-haptics';

export async function tic(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Sin háptica en este dispositivo: la app sigue funcionando igual.
  }
}
