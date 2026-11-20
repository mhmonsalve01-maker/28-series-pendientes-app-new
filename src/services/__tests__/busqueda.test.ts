import { buscarSeries } from '../busqueda';
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
