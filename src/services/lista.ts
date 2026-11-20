import type { SQLiteDatabase } from 'expo-sqlite';
import { useSyncExternalStore } from 'react';

import * as repo from '../repositories/serieRepository';
import type { Estado, SerieBase, SerieGuardada } from './tipos';

export type { Estado, SerieBase, SerieGuardada } from './tipos';

export type EstadoLista = { filas: SerieGuardada[]; historial: number[] };

// Series del catálogo que el usuario aún no decidió (RF-05: las descartadas no vuelven).
export function pendientes<T extends { id: number }>(catalogo: T[], filas: { id: number }[]): T[] {
  const decididas = new Set(filas.map((f) => f.id));
  return catalogo.filter((s) => !decididas.has(s.id));
}

let estado: EstadoLista = { filas: [], historial: [] };
const oyentes = new Set<() => void>();

function publicar(nuevo: EstadoLista) {
  estado = nuevo;
  oyentes.forEach((o) => o());
}

const ahora = () => new Date().toISOString();

export async function cargarLista(db: SQLiteDatabase): Promise<void> {
  publicar({ ...estado, filas: await repo.listarActivas(db) });
}

export async function decidirSerie(db: SQLiteDatabase, serie: SerieBase, nuevo: Estado): Promise<void> {
  if (estado.filas.some((f) => f.id === serie.id)) return;
  await repo.guardarDecision(db, serie, nuevo, ahora());
  publicar({ filas: await repo.listarActivas(db), historial: [...estado.historial, serie.id] });
}

export async function deshacer(db: SQLiteDatabase): Promise<void> {
  const id = estado.historial[estado.historial.length - 1];
  if (id === undefined) return;
  await repo.eliminarLogico(db, id, ahora());
  publicar({ filas: await repo.listarActivas(db), historial: estado.historial.slice(0, -1) });
}

export async function guardarProgreso(
  db: SQLiteDatabase,
  serie: SerieBase,
  temporada: number,
  episodio: number,
): Promise<void> {
  await repo.guardarProgreso(db, serie, temporada, episodio, ahora());
  publicar({ ...estado, filas: await repo.listarActivas(db) });
}

export function useLista(): EstadoLista {
  return useSyncExternalStore(
    (cb) => {
      oyentes.add(cb);
      return () => {
        oyentes.delete(cb);
      };
    },
    () => estado,
  );
}
