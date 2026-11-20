import { buscarSeries, patronContiene, unirResultados } from '../busqueda';
import { SERIES_MOCK } from '../seriesMock';

describe('buscarSeries', () => {
  it('ignora mayúsculas', () => {
    expect(buscarSeries(SERIES_MOCK, 'dark').map((s) => s.nombre)).toEqual(['Dark']);
  });
  it('ignora tildes', () => {
    const series = [{ id: 9, nombre: 'Élite', generos: '', resumen: '' }];
    expect(buscarSeries(series, 'elite')).toHaveLength(1);
  });
  it('texto vacío => sin resultados', () => {
    expect(buscarSeries(SERIES_MOCK, '   ')).toEqual([]);
  });
});

describe('patronContiene', () => {
  it('normaliza y envuelve con %', () => {
    expect(patronContiene(' Élite ')).toBe('%elite%');
  });
  it('escapa los comodines de LIKE', () => {
    expect(patronContiene('a_b%')).toBe('%a\\_b\\%%');
  });
});

describe('unirResultados', () => {
  it('no duplica series que ya están guardadas', () => {
    const guardadas = [{ id: 1 }, { id: 2 }];
    const catalogo = [{ id: 2 }, { id: 3 }];
    expect(unirResultados(guardadas, catalogo).map((s) => s.id)).toEqual([1, 2, 3]);
  });
});
