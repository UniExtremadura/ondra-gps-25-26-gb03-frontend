import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ArtistasService } from '../../../shared/services/artistas.service';
import { ArtistaDTO } from '../../../shared/models/artista.model';
import { StatsGlobales } from '../../../shared/models/stats.model';

/**
 * Servicio específico para la página Home
 * Orquesta las llamadas a otros servicios
 */
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private artistasService = inject(ArtistasService);

  /**
   * Obtiene los artistas en tendencia (por defecto 5)
   */
  obtenerArtistasTrending(limit: number = 5): Observable<ArtistaDTO[]> {
    return this.artistasService.obtenerArtistasTendencia(limit);
  }

  /**
   * Obtiene las estadísticas globales
   * NOTA: Por ahora hardcodeado, cuando tengas el endpoint real conéctalo aquí
   */
  obtenerStats(): Observable<StatsGlobales> {
    // Datos hardcodeados temporalmente
    const stats: StatsGlobales = {
      totalUsuarios: 1520,
      totalArtistas: 245,
      totalCanciones: 893,
      totalReproducciones: 12500
    };

    return of(stats);

    // Cuando esté el endpoint real, descomentar esto:
    // return this.http.get<StatsGlobales>(`${environment.apis.usuarios}/stats/globales`);
  }
}
