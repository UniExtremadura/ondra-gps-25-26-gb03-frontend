import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GENEROS_MUSICALES, GENERO_ID_MAP, obtenerIdGenero } from '../../../core/models/generos.model';

export interface GeneroOption {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  /**
   * Obtiene todos los géneros como opciones para selectores
   */
  obtenerGenerosComoOpciones(): Observable<GeneroOption[]> {
    const opciones = GENEROS_MUSICALES.map(nombre => ({
      id: GENERO_ID_MAP[nombre],
      nombre: nombre
    }));

    return of(opciones);
  }

  /**
   * Obtiene un género por ID
   */
  obtenerGeneroPorId(id: number): string | undefined {
    return Object.entries(GENERO_ID_MAP)
      .find(([_, generoId]) => generoId === id)?.[0];
  }

  /**
   * Obtiene el ID de un género por su nombre
   */
  obtenerIdPorNombre(nombre: string): number | undefined {
    return obtenerIdGenero(nombre);
  }
}
