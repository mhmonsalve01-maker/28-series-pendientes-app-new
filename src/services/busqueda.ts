import type { Serie } from './seriesMock';

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Patrón para LIKE ... ESCAPE '\' : escapa %, _ y \ para que se busquen literalmente.
export function patronContiene(texto: string): string {
  return '%' + normalizar(texto).replace(/[\\%_]/g, '\\$&') + '%';
}

export function buscarSeries(series: Serie[], texto: string): Serie[] {
  const q = normalizar(texto);
  if (q === '') return [];
  return series.filter((s) => normalizar(s.nombre).includes(q));
}

export function unirResultados<A extends { id: number }, B extends { id: number }>(
  guardadas: A[],
  catalogo: B[],
): (A | B)[] {
  const ids = new Set(guardadas.map((s) => s.id));
  return [...guardadas, ...catalogo.filter((s) => !ids.has(s.id))];
}
