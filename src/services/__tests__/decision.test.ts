import { decidir } from '../decision';

const ANCHO = 400; // 30 % = 120 px

describe('decidir', () => {
  it('derecha pasando el 30 % => quiero', () => {
    expect(decidir(150, 0, ANCHO)).toBe('quiero');
  });
  it('izquierda pasando el 30 % => descartar', () => {
    expect(decidir(-150, 0, ANCHO)).toBe('descartar');
  });
  it('sin pasar el umbral y lento => volver', () => {
    expect(decidir(100, 200, ANCHO)).toBe('volver');
  });
  it('swipe rápido aunque no pase el umbral => decide', () => {
    expect(decidir(60, 1000, ANCHO)).toBe('quiero');
  });
  it('velocidad contraria al desplazamiento => volver', () => {
    expect(decidir(60, -1000, ANCHO)).toBe('volver');
  });
  it('ancho inválido => volver', () => {
    expect(decidir(200, 0, 0)).toBe('volver');
  });
});
