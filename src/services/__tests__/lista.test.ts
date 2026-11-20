import { pendientes } from '../lista';

const catalogo = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('pendientes', () => {
  it('sin decisiones muestra todo el catálogo', () => {
    expect(pendientes(catalogo, []).map((s) => s.id)).toEqual([1, 2, 3]);
  });
  it('no muestra series ya decididas ni descartadas', () => {
    expect(pendientes(catalogo, [{ id: 1 }, { id: 2 }]).map((s) => s.id)).toEqual([3]);
  });
  it('una serie deshecha vuelve a la pila', () => {
    expect(pendientes(catalogo, [{ id: 2 }]).map((s) => s.id)).toEqual([1, 3]);
  });
});
