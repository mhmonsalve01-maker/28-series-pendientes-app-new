import type { SQLiteDatabase } from 'expo-sqlite';

export const NOMBRE_DB = 'series.db';

const MIGRACIONES: string[] = [
  `CREATE TABLE serie (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    nombre_busqueda TEXT NOT NULL,
    imagen_url TEXT,
    resumen TEXT,
    generos TEXT,
    estado TEXT NOT NULL DEFAULT 'quiero'
      CHECK (estado IN ('quiero','viendo','vista','descartada')),
    temporada_actual INTEGER CHECK (temporada_actual IS NULL OR temporada_actual >= 1),
    episodio_actual INTEGER CHECK (episodio_actual IS NULL OR episodio_actual >= 1),
    remote_id TEXT,
    updated_at TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0,
    pending INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX idx_serie_estado ON serie(estado);
  CREATE INDEX idx_serie_nombre_busqueda ON serie(nombre_busqueda);`,
];

export async function migrar(db: SQLiteDatabase): Promise<void> {
  const fila = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = fila?.user_version ?? 0;
  for (let i = version; i < MIGRACIONES.length; i++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRACIONES[i]);
      await db.execAsync(`PRAGMA user_version = ${i + 1}`);
    });
  }
}
