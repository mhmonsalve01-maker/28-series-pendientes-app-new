import { useSyncExternalStore } from 'react';

import type { Serie } from './seriesMock';

export type Estado = 'quiero' | 'viendo' | 'vista' | 'descartada';
export type Registro = { estado: Estado; temporada: number | null; episodio: number | null };
export type Decisiones = Record<number, Registro>;
export type AlmacenLista = { decisiones: Decisiones; historial: number[] };

export const ALMACEN_VACIO: AlmacenLista = { decisiones: {}, historial: [] };

export function pendientes(series: Serie[], decisiones: Decisiones): Serie[] {
  return series.filter((s) => !(s.id in decisiones));
}

export function conDecision(a: AlmacenLista, id: number, estado: Estado): AlmacenLista {
  if (id in a.decisiones) return a;
  return {
    decisiones: { ...a.decisiones, [id]: { estado, temporada: null, episodio: null } },
    historial: [...a.historial, id],
  };
}

export function sinUltima(a: AlmacenLista): AlmacenLista {
  const id = a.historial[a.historial.length - 1];
  if (id === undefined) return a;
  const decisiones = { ...a.decisiones };
  delete decisiones[id];
  return { decisiones, historial: a.historial.slice(0, -1) };
}

export function conProgreso(
  a: AlmacenLista,
  id: number,
  temporada: number,
  episodio: number,
): AlmacenLista {
  const actual = a.decisiones[id];
  const estado: Estado = actual?.estado === 'vista' ? 'vista' : 'viendo';
  return {
    ...a,
    decisiones: { ...a.decisiones, [id]: { estado, temporada, episodio } },
  };
}

// --- Almacén en memoria (se reemplaza por SQLite en el Hito 2) ---
let almacen: AlmacenLista = ALMACEN_VACIO;
const oyentes = new Set<() => void>();

function actualizar(nuevo: AlmacenLista) {
  if (nuevo === almacen) return;
  almacen = nuevo;
  oyentes.forEach((o) => o());
}

export function decidirSerie(id: number, estado: Estado) {
  actualizar(conDecision(almacen, id, estado));
}
export function deshacer() {
  actualizar(sinUltima(almacen));
}
export function guardarProgreso(id: number, temporada: number, episodio: number) {
  actualizar(conProgreso(almacen, id, temporada, episodio));
}

export function useLista(): AlmacenLista {
  return useSyncExternalStore(
    (cb) => {
      oyentes.add(cb);
      return () => {
        oyentes.delete(cb);
      };
    },
    () => almacen,
  );
}
