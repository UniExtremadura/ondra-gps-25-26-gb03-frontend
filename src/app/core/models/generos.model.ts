// src/app/features/auth/models/generos.model.ts

/**
 * Lista completa de géneros musicales disponibles en la plataforma
 */
export const GENEROS_MUSICALES = [
  'Rock',
  'Pop',
  'Jazz',
  'Blues',
  'Clásica',
  'Reggae',
  'Country',
  'Electrónica',
  'Hip Hop',
  'R&B',
  'Soul',
  'Funk',
  'Metal',
  'Punk',
  'Indie',
  'Folk',
  'Latina',
  'Salsa',
  'Reggaeton',
  'Flamenco',
  'Tango',
  'Bachata',
  'Merengue',
  'Cumbia',
  'Dubstep',
  'House',
  'Techno',
  'Trap',
  'K-Pop',
  'Anime'
];

/**
 * Mapeo de nombres de géneros a IDs del backend
 * IMPORTANTE: Estos IDs deben coincidir EXACTAMENTE con la tabla generos_musicales de tu BD
 */
export const GENERO_ID_MAP: Record<string, number> = {
  'Rock': 1,
  'Pop': 2,
  'Jazz': 3,
  'Blues': 4,
  'Clásica': 5,
  'Reggae': 6,
  'Country': 7,
  'Electrónica': 8,
  'Hip Hop': 9,
  'R&B': 10,
  'Soul': 11,
  'Funk': 12,
  'Metal': 13,
  'Punk': 14,
  'Indie': 15,
  'Folk': 16,
  'Latina': 17,
  'Salsa': 18,
  'Reggaeton': 19,
  'Flamenco': 20,
  'Tango': 21,
  'Bachata': 22,
  'Merengue': 23,
  'Cumbia': 24,
  'Dubstep': 25,
  'House': 26,
  'Techno': 27,
  'Trap': 28,
  'K-Pop': 29,
  'Anime': 30
};

/**
 * Convierte nombres de géneros seleccionados a sus IDs correspondientes
 * @param nombresGeneros Array de nombres de géneros (ej: ['Rock', 'Jazz', 'Pop'])
 * @returns Array de IDs numéricos (ej: [1, 3, 2])
 */
export function convertirGenerosAIds(nombresGeneros: string[]): number[] {
  return nombresGeneros
    .map(nombre => GENERO_ID_MAP[nombre])
    .filter(id => id !== undefined); // Filtrar géneros no encontrados
}

/**
 * Convierte IDs de géneros a sus nombres
 * @param idsGeneros Array de IDs (ej: [1, 3, 2])
 * @returns Array de nombres (ej: ['Rock', 'Jazz', 'Pop'])
 */
export function convertirIdsAGeneros(idsGeneros: number[]): string[] {
  const idToNameMap = Object.entries(GENERO_ID_MAP).reduce((acc, [name, id]) => {
    acc[id] = name;
    return acc;
  }, {} as Record<number, string>);

  return idsGeneros
    .map(id => idToNameMap[id])
    .filter(nombre => nombre !== undefined);
}

/**
 * Valida que un género existe en el sistema
 */
export function esGeneroValido(nombreGenero: string): boolean {
  return GENEROS_MUSICALES.includes(nombreGenero);
}

/**
 * Obtiene el ID de un género por su nombre
 */
export function obtenerIdGenero(nombreGenero: string): number | undefined {
  return GENERO_ID_MAP[nombreGenero];
}
