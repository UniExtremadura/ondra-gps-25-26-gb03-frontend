// src/app/features/user-profile/components/favorites-preview/favorites-preview.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ContentCarouselComponent, CarouselItem } from '../content-carousel/content-carousel.component';
import { environment } from '../../../../../enviroments/enviroment';

@Component({
  selector: 'app-favorites-preview',
  standalone: true,
  imports: [CommonModule, ContentCarouselComponent],
  templateUrl: './favorites-preview.component.html',
  styleUrls: ['./favorites-preview.component.scss']
})
export class FavoritesPreviewComponent implements OnInit {
  @Input() userId!: number;
  @Input() isOwnProfile: boolean = false; // ✅ NUEVO

  favoritos: CarouselItem[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.favoritos = [
        {
          id: 1,
          nombre: 'One More Time',
          artista: 'Daft Punk',
          tipo: 'canción',
          imagen: 'https://i.scdn.co/image/ab67616d0000b27338e5c88261ac859cee792916'
        },
        {
          id: 2,
          nombre: 'Around the World',
          artista: 'Daft Punk',
          tipo: 'canción',
          imagen: 'https://i.scdn.co/image/ab67616d0000b27338e5c88261ac859cee792916'
        },
        {
          id: 3,
          nombre: 'Random Access Memories',
          artista: 'Daft Punk',
          tipo: 'álbum',
          imagen: 'https://i.scdn.co/image/ab67616d0000b27338e5c88261ac859cee792916'
        },
        {
          id: 4,
          nombre: 'Get Lucky',
          artista: 'Daft Punk',
          tipo: 'canción',
          imagen: 'https://i.scdn.co/image/ab67616d0000b27338e5c88261ac859cee792916'
        },
        {
          id: 5,
          nombre: 'Instant Crush',
          artista: 'Daft Punk',
          tipo: 'canción',
          imagen: 'https://i.scdn.co/image/ab67616d0000b27338e5c88261ac859cee792916'
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  onItemClick(item: CarouselItem): void {
    console.log('Favorito clickeado:', item);
    // TODO: Navegar a detalle de la canción/álbum
  }
}
