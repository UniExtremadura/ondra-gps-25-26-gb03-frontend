import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UsuarioBasico,
  EstadisticasSeguimiento,
  SeguirUsuarioRequest
} from '../models/seguimiento.model';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserSeguimientoService {
  private apiUrl = `${environment.apis.usuarios}/seguimientos`;

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(idUsuario: number): Observable<EstadisticasSeguimiento> {
    return this.http.get<EstadisticasSeguimiento>(`${this.apiUrl}/${idUsuario}/estadisticas`);
  }

  obtenerSeguidos(idUsuario: number): Observable<UsuarioBasico[]> {
    return this.http.get<UsuarioBasico[]>(`${this.apiUrl}/${idUsuario}/seguidos`);
  }

  obtenerSeguidores(idUsuario: number): Observable<UsuarioBasico[]> {
    return this.http.get<UsuarioBasico[]>(`${this.apiUrl}/${idUsuario}/seguidores`);
  }

  seguirUsuario(idUsuarioASeguir: number): Observable<any> {
    const request: SeguirUsuarioRequest = { idUsuarioASeguir };
    return this.http.post(this.apiUrl, request);
  }

  dejarDeSeguir(idUsuario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUsuario}`);
  }

  verificarSeguimiento(idUsuario: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${idUsuario}/verificar`);
  }
}
