import { validarProgreso } from '../validacion';

describe('validarProgreso', () => {
  it('valores válidos => ok', () => {
    expect(validarProgreso('2', '5')).toEqual({ ok: true, temporada: 2, episodio: 5 });
  });
  it('acepta espacios alrededor', () => {
    expect(validarProgreso(' 1 ', ' 1 ')).toEqual({ ok: true, temporada: 1, episodio: 1 });
  });
  it('temporada 0 => error de temporada', () => {
    const r = validarProgreso('0', '3');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.map((x) => x.campo)).toEqual(['temporada']);
  });
  it('episodio 0 => error de episodio', () => {
    const r = validarProgreso('1', '0');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores.map((x) => x.campo)).toEqual(['episodio']);
  });
  it('vacío o texto => errores en ambos', () => {
    const r = validarProgreso('', 'abc');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errores).toHaveLength(2);
  });
  it('negativos y decimales => inválidos', () => {
    expect(validarProgreso('-1', '2').ok).toBe(false);
    expect(validarProgreso('1', '2.5').ok).toBe(false);
  });
});
