export type Estado = 'quiero' | 'viendo' | 'vista' | 'descartada';

export type SerieBase = {
  id: number;
  nombre: string;
  generos?: string | null;
  resumen?: string | null;
  imagen_url?: string | null;
};

export type SerieGuardada = {
  id: number;
  nombre: string;
  imagen_url: string | null;
  resumen: string | null;
  generos: string | null;
  estado: Estado;
  temporada_actual: number | null;
  episodio_actual: number | null;
  remote_id: string | null;
  updated_at: string;
  deleted: number;
  pending: number;
};
