export type Serie = {
  id: number;
  nombre: string;
  generos: string;
  resumen: string;
};

export const SERIES_MOCK: Serie[] = [
  { id: 1, nombre: 'Breaking Bad', generos: 'Drama, Crimen', resumen: 'Un profesor de química se convierte en fabricante de metanfetamina.' },
  { id: 2, nombre: 'Stranger Things', generos: 'Ciencia ficción, Terror', resumen: 'Un grupo de niños enfrenta fuerzas sobrenaturales en su pueblo.' },
  { id: 3, nombre: 'The Office', generos: 'Comedia', resumen: 'La vida diaria de los empleados de una oficina de papel.' },
  { id: 4, nombre: 'Dark', generos: 'Misterio, Ciencia ficción', resumen: 'La desaparición de un niño revela secretos y viajes en el tiempo.' },
  { id: 5, nombre: 'Friends', generos: 'Comedia, Romance', resumen: 'Seis amigos viven sus días en Nueva York.' },
];
