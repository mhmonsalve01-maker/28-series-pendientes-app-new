import { ALMACEN_VACIO, conDecision, conProgreso, pendientes, sinUltima } from '../lista';
import type { Serie } from '../seriesMock';

const series: Serie[] = [
  { id: 1, nombre: 'A', generos: '', resumen: '' },
  { id: 2, nombre: 'B', generos: '', resumen: '' },
  { id: 3, nombre: 'C', generos: '', resumen: '' },
];

describe('lista', () => {
  it('no muestra series descartadas ni ya decididas', () => {
    let a = conDecision(ALMACEN_VACIO, 1, 'descartada');
    a = conDecision(a, 2, 'quiero');
    expect(pendientes(series, a.decisiones).map((s) => s.id)).toEqual([3]);
  });
  it('deshacer devuelve la última serie a la pila', () => {
    let a = conDecision(ALMACEN_VACIO, 1, 'quiero');
    a = conDecision(a, 2, 'descartada');
    a = sinUltima(a);
    expect(pendientes(series, a.decisiones).map((s) => s.id)).toEqual([2, 3]);
  });
  it('deshacer sin historial no cambia nada', () => {
    expect(sinUltima(ALMACEN_VACIO)).toBe(ALMACEN_VACIO);
  });
  it('evita duplicados', () => {
    const a = conDecision(ALMACEN_VACIO, 1, 'quiero');
    expect(conDecision(a, 1, 'descartada')).toBe(a);
  });
  it('guardar progreso pasa a "viendo" y conserva "vista"', () => {
    const a = conProgreso(conDecision(ALMACEN_VACIO, 1, 'quiero'), 1, 2, 5);
    expect(a.decisiones[1]).toEqual({ estado: 'viendo', temporada: 2, episodio: 5 });
    const b = conProgreso(conDecision(ALMACEN_VACIO, 2, 'vista'), 2, 1, 1);
    expect(b.decisiones[2]?.estado).toBe('vista');
  });
});
