import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/enviroment';
import { ArchivoAudioResponseDTO, ArchivoImagenResponseDTO } from '../../songs/models/song.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apis.contenidos;

  /**
   * Sube un archivo de audio (MP3, WAV, etc.)
   */
  subirAudio(archivo: File, tipo: 'cancion' | 'album' = 'cancion'): Observable<ArchivoAudioResponseDTO> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('tipo', tipo);

    return this.http.post<ArchivoAudioResponseDTO>(
      `${this.apiUrl}/archivos/audio`,
      formData
    );
  }

  /**
   * Sube una imagen (portada de canción o álbum)
   */
  subirImagen(archivo: File, tipo: 'cancion' | 'album' = 'cancion'): Observable<ArchivoImagenResponseDTO> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('tipo', tipo);

    return this.http.post<ArchivoImagenResponseDTO>(
      `${this.apiUrl}/archivos/imagen`,
      formData
    );
  }

  /**
   * Elimina un archivo de Cloudinary
   */
  eliminarArchivo(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/archivos/${publicId}`);
  }
}
