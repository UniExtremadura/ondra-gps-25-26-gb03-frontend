import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { ArtistaDTO, EditarArtistaDTO } from '../models/artista.model';

/**
 * Servicio para interactuar con el endpoint de Artistas
 * del microservicio de Usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class ArtistasService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apis.usuarios + '/artistas';

  /**
   * Obtiene los artistas en tendencia
   * GET /api/artistas?limit=10
   * Endpoint público (no requiere autenticación)
   */
  obtenerArtistasTendencia(limit: number = 5): Observable<ArtistaDTO[]> {
    return this.http.get<ArtistaDTO[]>(`${this.API_URL}`, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Obtiene el perfil completo de un artista por ID
   * GET /api/artistas/{id}
   * Endpoint público (no requiere autenticación)
   */
  obtenerArtista(id: number): Observable<ArtistaDTO> {
    return this.http.get<ArtistaDTO>(`${this.API_URL}/${id}`);
  }

  /**
   * Edita el perfil de un artista
   * PUT /api/artistas/{id}
   * Requiere autenticación JWT
   */
  editarArtista(id: number, dto: EditarArtistaDTO): Observable<ArtistaDTO> {
    return this.http.put<ArtistaDTO>(`${this.API_URL}/${id}`, dto);
  }

  /**
   * Elimina el perfil de un artista
   * DELETE /api/artistas/{id}
   * Requiere autenticación JWT
   */
  eliminarArtista(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
