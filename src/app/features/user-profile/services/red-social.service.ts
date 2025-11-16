// src/app/features/user-profile/services/red-social.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RedSocial, RedSocialCrear, RedSocialEditar } from '../models/red-social.model';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RedSocialService {
  private apiUrl = `${environment.apis.usuarios}/artistas`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las redes sociales de un artista (público)
   */
  listarRedesSociales(artistaId: number): Observable<RedSocial[]> {
    const url = `${this.apiUrl}/${artistaId}/redes`;

    return this.http.get<RedSocial[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva red social para un artista (requiere autenticación)
   * El token JWT se agrega automáticamente mediante el interceptor
   */
  crearRedSocial(artistaId: number, datos: RedSocialCrear): Observable<RedSocial> {
    const url = `${this.apiUrl}/${artistaId}/redes`;

    // Validaciones del cliente
    this.validarRedSocial(datos);

    return this.http.post<RedSocial>(url, datos).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Edita una red social existente (requiere autenticación)
   * El token JWT se agrega automáticamente mediante el interceptor
   */
  editarRedSocial(
    artistaId: number,
    idRedSocial: number,
    datos: RedSocialEditar
  ): Observable<RedSocial> {
    const url = `${this.apiUrl}/${artistaId}/redes/${idRedSocial}`;

    // Validar si hay URL
    if (datos.urlRedSocial) {
      this.validarUrl(datos.urlRedSocial);
    }

    return this.http.put<RedSocial>(url, datos).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una red social (requiere autenticación)
   * El token JWT se agrega automáticamente mediante el interceptor
   */
  eliminarRedSocial(artistaId: number, idRedSocial: number): Observable<void> {
    const url = `${this.apiUrl}/${artistaId}/redes/${idRedSocial}`;

    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private validarRedSocial(datos: RedSocialCrear): void {
    if (!datos.tipoRedSocial) {
      throw new Error('El tipo de red social es obligatorio');
    }

    this.validarUrl(datos.urlRedSocial);
  }

  private validarUrl(url: string): void {
    if (!url || !url.trim()) {
      throw new Error('La URL de la red social es obligatoria');
    }

    const urlTrimmed = url.trim();

    // Validación de longitud (10-500 caracteres)
    if (urlTrimmed.length < 10) {
      throw new Error('La URL debe tener al menos 10 caracteres');
    }

    if (urlTrimmed.length > 500) {
      throw new Error('La URL no puede exceder 500 caracteres');
    }

    // Validación de formato (debe empezar con http:// o https://)
    if (!urlTrimmed.match(/^https?:\/\/.+/)) {
      throw new Error('La URL debe comenzar con http:// o https://');
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos. Verifica la información ingresada';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Red social o artista no encontrado';
          break;
        case 409:
          errorMessage = 'Ya tienes una red social de este tipo registrada';
          break;
        case 500:
          errorMessage = 'Error del servidor. Inténtalo más tarde';
          break;
        default:
          errorMessage = error.error?.message || `Error del servidor (${error.status})`;
      }
    }

    console.error('❌ Error en RedSocialService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
