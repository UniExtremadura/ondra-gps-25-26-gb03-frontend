import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface AgregarPreferenciasDTO {
  ids_generos: number[];
}

export interface PreferenciaGeneroDTO {
  id_genero: number;
  nombre_genero: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apis.recomendaciones}/usuarios`;

  /**
   * Agrega géneros musicales a las preferencias del usuario
   */
  agregarPreferencias(idUsuario: number, idsGeneros: number[]): Observable<any> {
    const body: AgregarPreferenciasDTO = { ids_generos: idsGeneros };
    return this.http.post(`${this.API_URL}/${idUsuario}/preferencias`, body);
  }

  /**
   * Obtiene las preferencias del usuario
   */
  obtenerPreferencias(idUsuario: number): Observable<PreferenciaGeneroDTO[]> {
    return this.http.get<PreferenciaGeneroDTO[]>(`${this.API_URL}/${idUsuario}/preferencias`);
  }
}
