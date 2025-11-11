import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArtistaDTO } from '../../../../shared/models/artista.model';

@Component({
  selector: 'app-trending-artists',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trending-artists.component.html',
  styleUrl: './trending-artists.component.scss'
})
export class TrendingArtistsComponent {
  @Input() artistas: ArtistaDTO[] = [];
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;

  /**
   * Obtiene la URL de la foto del artista o una imagen por defecto
   */
  getFotoArtista(artista: ArtistaDTO): string {
    return artista.fotoPerfilArtistico || 'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(artista.nombreArtistico) + '&background=2563EB&color=fff&size=400';
  }

  /**
   * Obtiene el enlace de una red social específica
   */
  getRedSocial(artista: ArtistaDTO, tipo: string): string | null {
    const red = artista.redesSociales.find(r => r.tipoRedSocial.toLowerCase() === tipo.toLowerCase());
    return red?.urlRedSocial || null;
  }
}
