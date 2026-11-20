import type { Serie } from './seriesMock';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function buscarSeries(series: Serie[], texto: string): Serie[] {
  const q = normalizar(texto);
  if (q === '') return [];
  return series.filter((s) => normalizar(s.nombre).includes(q));
}
