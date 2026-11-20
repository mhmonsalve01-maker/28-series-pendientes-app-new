export type DecisionInclinacion = 'quiero' | 'descartar';

export const UMBRAL_INCLINACION = 0.5; // radianes (≈ 29°)
export const UMBRAL_NEUTRO = 0.2; // radianes (≈ 11°)

export type ResultadoInclinacion = {
  armado: boolean;
  decision: DecisionInclinacion | null;
};

export function procesarInclinacion(armado: boolean, gamma: number): ResultadoInclinacion {
  if (!Number.isFinite(gamma)) return { armado, decision: null };
  if (!armado) {
    return { armado: Math.abs(gamma) <= UMBRAL_NEUTRO, decision: null };
  }
  if (gamma >= UMBRAL_INCLINACION) return { armado: false, decision: 'quiero' };
  if (gamma <= -UMBRAL_INCLINACION) return { armado: false, decision: 'descartar' };
  return { armado, decision: null };
}
