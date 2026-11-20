export type Decision = 'quiero' | 'descartar' | 'volver';

export const UMBRAL_DESPLAZAMIENTO = 0.3; // 30 % del ancho
export const UMBRAL_VELOCIDAD = 800; // px/s para un swipe rápido

export function decidir(dx: number, vx: number, ancho: number): Decision {
  if (ancho <= 0) return 'volver';
  const pasaUmbral = Math.abs(dx) >= ancho * UMBRAL_DESPLAZAMIENTO;
  const esRapido = Math.abs(vx) >= UMBRAL_VELOCIDAD && Math.sign(vx) === Math.sign(dx);
  if (!pasaUmbral && !esRapido) return 'volver';
  return dx > 0 ? 'quiero' : dx < 0 ? 'descartar' : 'volver';
}
