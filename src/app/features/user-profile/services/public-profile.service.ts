// src/app/features/user-profile/services/public-profile.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioPublico } from '../models/usuario-publico.model';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PublicProfileService {
  private apiUrl = `${environment.apis.usuarios}/public`;

  constructor(private http: HttpClient) {}

  // Obtener perfil público de usuario por slug
  obtenerPerfilUsuario(slug: string): Observable<UsuarioPublico> {
    return this.http.get<UsuarioPublico>(`${this.apiUrl}/usuarios/${slug}`);
  }

  // Obtener perfil público de artista por slugArtistico
  obtenerPerfilArtista(slugArtistico: string): Observable<UsuarioPublico> {
    return this.http.get<UsuarioPublico>(`${this.apiUrl}/artistas/${slugArtistico}`);
  }
}
