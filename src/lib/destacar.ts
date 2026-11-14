export interface Parte {
  texto: string;
  destacado: boolean;
}

/** "Fabricamos **filtros** a medida" → partes con `destacado` según las marcas `**…**` del contenido. */
export function partes(texto: string): Parte[] {
  return texto
    .split('**')
    .map((trozo, i) => ({ texto: trozo, destacado: i % 2 === 1 }))
    .filter((parte) => parte.texto !== '');
}

/** Texto sin las marcas `**`, para atributos como `alt` o metadatos. */
export const sinMarcas = (texto: string): string => texto.replaceAll('**', '');
