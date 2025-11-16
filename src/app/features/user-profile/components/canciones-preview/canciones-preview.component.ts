// src/app/features/user-profile/components/canciones-preview/canciones-preview.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContentCarouselComponent, CarouselItem } from '../content-carousel/content-carousel.component';
import { SongService } from '../../../songs/services/song.service';
import { CancionDTO } from '../../../songs/models/song.model';

@Component({
  selector: 'app-canciones-preview',
  standalone: true,
  imports: [CommonModule, ContentCarouselComponent],
  templateUrl: './canciones-preview.component.html',
  styleUrls: ['./canciones-preview.component.scss']
})
export class CancionesPreviewComponent implements OnInit {
  @Input() artistaId!: number;
  @Input() isOwnProfile: boolean = false;

  canciones: CarouselItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.cargarCanciones();
  }

  cargarCanciones(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Usar el endpoint correcto según si es el propio perfil o no
    const observable = this.isOwnProfile
      ? this.songService.listarMisCanciones()
      : this.songService.listarCanciones({ artista: this.artistaId });

    observable.subscribe({
      next: (response) => {
        console.log('✅ Canciones cargadas:', response);

        // Si es listarMisCanciones(), la respuesta es directamente un array
        // Si es listarCanciones(), puede venir paginado o en un objeto
        const cancionesData = Array.isArray(response)
          ? response
          : (response.canciones || response.content || []);

        this.canciones = cancionesData.map((cancion: CancionDTO) => ({
          id: cancion.idCancion,
          nombre: cancion.tituloCancion,
          artista: cancion.artista.nombreArtistico,
          tipo: 'canción' as const,
          imagen: cancion.urlPortada || 'https://via.placeholder.com/300x300?text=Sin+Portada'
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar canciones:', error);
        this.errorMessage = 'No se pudieron cargar las canciones';

        // FALLBACK: Datos hardcodeados
        console.warn('⚠️ Usando datos de ejemplo como fallback');
        this.canciones = this.obtenerCancionesFallback();
        this.isLoading = false;
      }
    });
  }

  /**
   * Devuelve datos hardcodeados como fallback en caso de error
   */
  private obtenerCancionesFallback(): CarouselItem[] {
    return [
      {
        id: 1,
        nombre: 'Tití Me Preguntó',
        artista: 'Bad Bunny',
        tipo: 'canción',
        imagen: 'https://m.media-amazon.com/images/I/A1SIcgwSn3L._AC_UF894,1000_QL80_.jpg'
      },
      {
        id: 2,
        nombre: 'Moscow Mule',
        artista: 'Bad Bunny',
        tipo: 'canción',
        imagen: 'https://m.media-amazon.com/images/I/A1SIcgwSn3L._AC_UF894,1000_QL80_.jpg'
      },
      {
        id: 3,
        nombre: 'Después de la Playa',
        artista: 'Bad Bunny',
        tipo: 'canción',
        imagen: 'https://m.media-amazon.com/images/I/A1SIcgwSn3L._AC_UF894,1000_QL80_.jpg'
      },
      {
        id: 4,
        nombre: 'Me Porto Bonito',
        artista: 'Bad Bunny',
        tipo: 'canción',
        imagen: 'https://m.media-amazon.com/images/I/A1SIcgwSn3L._AC_UF894,1000_QL80_.jpg'
      },
      {
        id: 5,
        nombre: 'Tarot',
        artista: 'Bad Bunny',
        tipo: 'canción',
        imagen: 'https://m.media-amazon.com/images/I/A1SIcgwSn3L._AC_UF894,1000_QL80_.jpg'
      },
      {
        id: 6,
        nombre: 'Dos Mil 16',
        artista: 'Bad Bunny',
        tipo: 'canción',
        imagen: 'https://m.media-amazon.com/images/I/A1SIcgwSn3L._AC_UF894,1000_QL80_.jpg'
      }
    ];
  }

  onAddCancion(): void {
    this.router.navigate([`/perfil/subir-cancion`]);
  }

  onItemClick(item: CarouselItem): void {
    console.log('Canción clickeada:', item);
    this.router.navigate([`/cancion/${item.id}`]);
  }
}
