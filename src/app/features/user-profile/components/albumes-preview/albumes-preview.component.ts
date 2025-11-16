// src/app/features/user-profile/components/albumes-preview/albumes-preview.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContentCarouselComponent, CarouselItem } from '../content-carousel/content-carousel.component';
import { AlbumService } from '../../../albums/services/album.service';
import { AlbumDTO } from '../../../albums/models/album.model';

@Component({
  selector: 'app-albumes-preview',
  standalone: true,
  imports: [CommonModule, ContentCarouselComponent],
  templateUrl: './albumes-preview.component.html',
  styleUrls: ['./albumes-preview.component.scss']
})
export class AlbumesPreviewComponent implements OnInit {
  @Input() artistaId!: number;
  @Input() isOwnProfile: boolean = false;

  albumes: CarouselItem[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private albumService: AlbumService
  ) {}

  ngOnInit(): void {
    this.cargarAlbumes();
  }

  cargarAlbumes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Usar el endpoint correcto según si es el propio perfil o no
    const observable = this.isOwnProfile
      ? this.albumService.listarMisAlbumes()
      : this.albumService.listarAlbumes({ artista: this.artistaId });

    observable.subscribe({
      next: (response) => {
        console.log('✅ Álbumes cargados:', response);

        // Si es listarMisAlbumes(), la respuesta es directamente un array
        // Si es listarAlbumes(), puede venir paginado o en un objeto
        const albumesData = Array.isArray(response) ? response : (response.albumes || response.content || []);

        this.albumes = albumesData.map((album: AlbumDTO) => ({
          id: album.idAlbum,
          nombre: album.tituloAlbum,
          artista: album.artista || 'Artista',
          tipo: 'álbum' as const,
          imagen: album.urlPortada || 'https://via.placeholder.com/300x300?text=Sin+Portada'
        }));

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar álbumes:', error);
        this.errorMessage = 'No se pudieron cargar los álbumes';

        // FALLBACK: Datos hardcodeados
        console.warn('⚠️ Usando datos de ejemplo como fallback');
        this.albumes = this.obtenerAlbumesFallback();
        this.isLoading = false;
      }
    });
  }

  /**
   * Devuelve datos hardcodeados como fallback en caso de error
   */
  private obtenerAlbumesFallback(): CarouselItem[] {
    return [
      {
        id: 1,
        nombre: 'Revolá',
        artista: 'Sanguijuelas del Guadiana',
        tipo: 'álbum',
        imagen: 'https://i.discogs.com/Vj4nMORHrblEfXVKjRqpPd5wd-6G36TQxOjFiqxNjUE/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0Mzg0/MTk4LTE3NTEwMDk4/MjQtNTQ0MC5qcGVn.jpeg'
      },
      {
        id: 2,
        nombre: '100 AMAPOLAS',
        artista: 'Sanguijuelas del Guadiana',
        tipo: 'álbum',
        imagen: 'https://i.discogs.com/Vj4nMORHrblEfXVKjRqpPd5wd-6G36TQxOjFiqxNjUE/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0Mzg0/MTk4LTE3NTEwMDk4/MjQtNTQ0MC5qcGVn.jpeg'
      },
      {
        id: 3,
        nombre: 'Mirando por los míos',
        artista: 'Sanguijuelas del Guadiana',
        tipo: 'álbum',
        imagen: 'https://i.discogs.com/Vj4nMORHrblEfXVKjRqpPd5wd-6G36TQxOjFiqxNjUE/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0Mzg0/MTk4LTE3NTEwMDk4/MjQtNTQ0MC5qcGVn.jpeg'
      },
      {
        id: 4,
        nombre: 'Intacto',
        artista: 'Sanguijuelas del Guadiana',
        tipo: 'álbum',
        imagen: 'https://i.discogs.com/Vj4nMORHrblEfXVKjRqpPd5wd-6G36TQxOjFiqxNjUE/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM0Mzg0/MTk4LTE3NTEwMDk4/MjQtNTQ0MC5qcGVn.jpeg'
      }
    ];
  }

  onAddAlbum(): void {
    this.router.navigate([`/perfil/subir-album`]);
  }

  onItemClick(item: CarouselItem): void {
    console.log('Álbum clickeado:', item);
    this.router.navigate([`/album/${item.id}`]);
  }
}
