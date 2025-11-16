// src/app/features/user-profile/components/purchases-preview/purchases-preview.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ContentCarouselComponent, CarouselItem } from '../content-carousel/content-carousel.component';
import { environment } from '../../../../../enviroments/enviroment';

@Component({
  selector: 'app-purchases-preview',
  standalone: true,
  imports: [CommonModule, ContentCarouselComponent],
  templateUrl: './purchases-preview.component.html',
  styleUrls: ['./purchases-preview.component.scss']
})
export class PurchasesPreviewComponent implements OnInit {
  @Input() userId!: number;

  compras: CarouselItem[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    // TODO: Implementar llamada real al microservicio de contenidos
    this.isLoading = true;

    setTimeout(() => {
      this.compras = [
        {
          id: 1,
          nombre: 'Blinding Lights',
          artista: 'The Weeknd',
          tipo: 'canción',
          precio: 0.99,
          imagen: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
        },
        {
          id: 2,
          nombre: 'Starboy',
          artista: 'The Weeknd',
          tipo: 'álbum',
          precio: 9.99,
          imagen: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
        },
        {
          id: 3,
          nombre: 'Save Your Tears',
          artista: 'The Weeknd',
          tipo: 'canción',
          precio: 0.99,
          imagen: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
        },
        {
          id: 4,
          nombre: 'After Hours',
          artista: 'The Weeknd',
          tipo: 'álbum',
          precio: 12.99,
          imagen: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
        },
        {
          id: 5,
          nombre: 'Die For You',
          artista: 'The Weeknd',
          tipo: 'canción',
          precio: 0.99,
          imagen: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  onItemClick(item: CarouselItem): void {
    console.log('Compra clickeada:', item);
    // TODO: Navegar a detalle de la canción/álbum
  }
}
