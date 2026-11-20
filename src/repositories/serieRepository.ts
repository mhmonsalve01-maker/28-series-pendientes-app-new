import type { SQLiteDatabase } from 'expo-sqlite';

import { normalizar, patronContiene } from '../services/busqueda';
import type { Estado, SerieBase, SerieGuardada } from '../services/tipos';

const COLUMNAS =
  'id, nombre, imagen_url, resumen, generos, estado, temporada_actual, episodio_actual, remote_id, updated_at, deleted, pending';

export function listarActivas(db: SQLiteDatabase): Promise<SerieGuardada[]> {
  return db.getAllAsync<SerieGuardada>(
    `SELECT ${COLUMNAS} FROM serie WHERE deleted = 0 ORDER BY updated_at DESC`,
  );
}

export function buscarGuardadas(db: SQLiteDatabase, texto: string): Promise<SerieGuardada[]> {
  return db.getAllAsync<SerieGuardada>(
    `SELECT ${COLUMNAS} FROM serie
     WHERE deleted = 0 AND nombre_busqueda LIKE ? ESCAPE '\\'
     ORDER BY nombre LIMIT 50`,
    [patronContiene(texto)],
  );
}

// Crea la decisión. Si ya existe una activa no cambia nada (evita duplicados);
// si estaba borrada lógicamente, la reactiva.
export async function guardarDecision(
  db: SQLiteDatabase,
  serie: SerieBase,
  estado: Estado,
  ahora: string,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO serie
       (id, nombre, nombre_busqueda, imagen_url, resumen, generos, estado, remote_id, updated_at, deleted, pending)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
     ON CONFLICT(id) DO UPDATE SET
       estado = excluded.estado,
       temporada_actual = NULL,
       episodio_actual = NULL,
       deleted = 0,
       pending = 1,
       updated_at = excluded.updated_at
     WHERE serie.deleted = 1`,
    [
      serie.id,
      serie.nombre,
      normalizar(serie.nombre),
      serie.imagen_url ?? null,
      serie.resumen ?? null,
      serie.generos ?? null,
      estado,
      String(serie.id),
      ahora,
    ],
  );
}

export async function guardarProgreso(
  db: SQLiteDatabase,
  serie: SerieBase,
  temporada: number,
  episodio: number,
  ahora: string,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO serie
       (id, nombre, nombre_busqueda, imagen_url, resumen, generos, estado,
        temporada_actual, episodio_actual, remote_id, updated_at, deleted, pending)
     VALUES (?, ?, ?, ?, ?, ?, 'viendo', ?, ?, ?, ?, 0, 1)
     ON CONFLICT(id) DO UPDATE SET
       estado = CASE WHEN serie.deleted = 0 AND serie.estado = 'vista' THEN 'vista' ELSE 'viendo' END,
       temporada_actual = excluded.temporada_actual,
       episodio_actual = excluded.episodio_actual,
       deleted = 0,
       pending = 1,
       updated_at = excluded.updated_at`,
    [
      serie.id,
      serie.nombre,
      normalizar(serie.nombre),
      serie.imagen_url ?? null,
      serie.resumen ?? null,
      serie.generos ?? null,
      temporada,
      episodio,
      String(serie.id),
      ahora,
    ],
  );
}

// Borrado lógico: la fila se conserva para poder sincronizarla después.
export async function eliminarLogico(db: SQLiteDatabase, id: number, ahora: string): Promise<void> {
  await db.runAsync('UPDATE serie SET deleted = 1, pending = 1, updated_at = ? WHERE id = ?', [
    ahora,
    id,
  ]);
}
