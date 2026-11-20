export type ErrorCampo = { campo: 'temporada' | 'episodio'; mensaje: string };

export type ResultadoProgreso =
  | { ok: true; temporada: number; episodio: number }
  | { ok: false; errores: ErrorCampo[] };

function parseEntero(texto: string): number | null {
  const limpio = texto.trim();
  if (!/^\d+$/.test(limpio)) return null;
  return Number(limpio);
}

export function validarProgreso(temporada: string, episodio: string): ResultadoProgreso {
  const errores: ErrorCampo[] = [];
  const t = parseEntero(temporada);
  const e = parseEntero(episodio);

  if (t === null || t < 1) {
    errores.push({ campo: 'temporada', mensaje: 'La temporada debe ser un número entero mayor o igual a 1.' });
  }
  if (e === null || e < 1) {
    errores.push({ campo: 'episodio', mensaje: 'El episodio debe ser un número entero mayor o igual a 1.' });
  }
  if (errores.length > 0 || t === null || e === null) {
    return { ok: false, errores };
  }
  return { ok: true, temporada: t, episodio: e };
}
