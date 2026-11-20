import { procesarInclinacion } from '../inclinacion';

describe('procesarInclinacion', () => {
  it('armado e inclinado a la derecha => quiero y se desarma', () => {
    expect(procesarInclinacion(true, 0.6)).toEqual({ armado: false, decision: 'quiero' });
  });
  it('armado e inclinado a la izquierda => descartar', () => {
    expect(procesarInclinacion(true, -0.6)).toEqual({ armado: false, decision: 'descartar' });
  });
  it('inclinación pequeña => no decide', () => {
    expect(procesarInclinacion(true, 0.3)).toEqual({ armado: true, decision: null });
  });
  it('desarmado no decide aunque siga inclinado', () => {
    expect(procesarInclinacion(false, 0.8)).toEqual({ armado: false, decision: null });
  });
  it('desarmado vuelve a armarse al regresar al centro', () => {
    expect(procesarInclinacion(false, 0.1)).toEqual({ armado: true, decision: null });
  });
  it('valor inválido => ignora', () => {
    expect(procesarInclinacion(true, Number.NaN)).toEqual({ armado: true, decision: null });
  });
});
