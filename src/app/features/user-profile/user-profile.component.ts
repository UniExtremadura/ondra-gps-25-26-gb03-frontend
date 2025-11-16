// src/app/features/user-profile/user-profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfileService } from './services/user-profile.service';
import { UserSeguimientoService } from './services/user-seguimiento.service';
import { UserProfile } from './models/user-profile.model';
import { EstadisticasSeguimiento, ModalType } from './models/seguimiento.model';

import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { PersonalInfoSectionComponent } from './components/personal-info-section/personal-info-section.component';
import { BecomeArtistModalComponent } from './components/become-artist-modal/become-artist-modal.component';
import { FollowersModalComponent } from './components/followers-modal/followers-modal.component';
import { PurchasesPreviewComponent } from './components/purchases-preview/purchases-preview.component';
import { FavoritesPreviewComponent } from './components/favorites-preview/favorites-preview.component';
import { CancionesPreviewComponent } from './components/canciones-preview/canciones-preview.component';
import { AlbumesPreviewComponent } from './components/albumes-preview/albumes-preview.component';
import { LeaveArtistModalComponent } from './components/leave-artist-modal/leave-artist-modal.component';
import { SocialNetworksSectionComponent } from './components/social-networks-section/social-networks-section.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    PersonalInfoSectionComponent,
    SocialNetworksSectionComponent,
    BecomeArtistModalComponent,
    FollowersModalComponent,
    PurchasesPreviewComponent,
    FavoritesPreviewComponent,
    CancionesPreviewComponent,
    AlbumesPreviewComponent,
    LeaveArtistModalComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  estadisticas: EstadisticasSeguimiento | null = null;
  isLoading = true;
  modalType: ModalType = null;
  mostrarLeaveArtistModal = false;
  mostrarBecomeArtistModal = false;
  totalReproducciones: number | null = null; // ✅ Para artistas

  constructor(
    private router: Router,
    private authStateService: AuthStateService,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private location: Location,
    private seguimientoService: UserSeguimientoService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const user = this.authStateService.getUserInfo();
    if (user?.idUsuario) {
      this.cargarPerfil(user.idUsuario);
      this.cargarEstadisticas(user.idUsuario);
    } else {
      this.router.navigate(['/login']);
    }
  }

  get isArtist(): boolean {
    return this.userProfile?.tipoUsuario === 'ARTISTA';
  }

  cargarPerfil(idUsuario: number): void {
    this.userProfileService.obtenerPerfil(idUsuario).subscribe({
      next: (profile) => {
        this.userProfile = profile;

        // ✅ Cargar reproducciones si es artista
        if (this.isArtist && profile.idArtista) {
          this.cargarReproducciones(profile.idArtista);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);

        if (error.status === 401 && error.error?.error === 'TOKEN_EXPIRED') {
          console.log('🔄 Token expirado, intentando renovar...');
          this.authService.refreshToken().subscribe({
            next: () => {
              console.log('✅ Token renovado, recargando perfil...');
              this.cargarPerfil(idUsuario);
            },
            error: (refreshError) => {
              console.error('❌ Error al renovar token:', refreshError);
              alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
              this.authService.logout();
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  cargarEstadisticas(idUsuario: number): void {
    this.seguimientoService.obtenerEstadisticas(idUsuario).subscribe({
      next: (stats) => {
        this.estadisticas = stats;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  // ✅ Cargar reproducciones totales del artista
  cargarReproducciones(idArtista: number): void {
    // Simulación de datos - diferentes valores por artista
    const artistaStats: { [key: number]: number } = {
      1: 1247893,
      2: 892345,
      3: 3456789,
      4: 567234,
      5: 2345678,
      6: 456789,
      7: 9876543,
      8: 234567,
      9: 678901,
      10: 1234567,
      11: 345678,
      12: 890123,
      13: 456789,
      14: 123456
    };

    // Usar el ID del artista como clave, o un valor aleatorio entre 100K y 5M
    this.totalReproducciones = artistaStats[idArtista] || Math.floor(Math.random() * (5000000 - 100000) + 100000);

    console.log(`🎵 Total reproducciones para artista ${idArtista}: ${this.totalReproducciones}`);

    // TODO: Cuando tengas el endpoint real del backend:
    /*
    this.artistaService.obtenerReproduccionesTotales(idArtista).subscribe({
      next: (total) => {
        this.totalReproducciones = total;
      },
      error: (error) => {
        console.error('Error al cargar reproducciones:', error);
        this.totalReproducciones = 0;
      }
    });
    */
  }

  recargarEstadisticas(): void {
    if (this.userProfile?.idUsuario) {
      this.cargarEstadisticas(this.userProfile.idUsuario);
    }
  }

  onProfileUpdated(updatedProfile: UserProfile): void {
    this.userProfile = updatedProfile;

    this.authStateService.updateUserInfo({
      nombreUsuario: updatedProfile.nombreUsuario,
      apellidosUsuario: updatedProfile.apellidosUsuario,
      fotoPerfil: updatedProfile.fotoPerfil,
      tipoUsuario: updatedProfile.tipoUsuario,
      nombreArtistico: updatedProfile.nombreArtistico,
      fotoPerfilArtistico: updatedProfile.fotoPerfilArtistico,
      idArtista: updatedProfile.idArtista,
      biografiaArtistico: updatedProfile.biografiaArtistico
    });
  }

  openModal(type: ModalType): void {
    this.modalType = type;
  }

  closeModal(): void {
    this.modalType = null;
  }

  goBack(): void {
    this.location.back();
  }

  navegarAPagos(): void {
    this.router.navigate(['/perfil/pagos']);
  }

  abrirLeaveArtistModal(): void {
    this.mostrarLeaveArtistModal = true;
  }

  cerrarLeaveArtistModal(): void {
    this.mostrarLeaveArtistModal = false;
  }

  onArtistLeft(): void {
    this.cerrarLeaveArtistModal();
    if (this.userProfile?.idUsuario) {
      this.cargarPerfil(this.userProfile.idUsuario);
      this.cargarEstadisticas(this.userProfile.idUsuario);
    }
  }

  abrirBecomeArtistModal(): void {
    this.mostrarBecomeArtistModal = true;
  }

  cerrarBecomeArtistModal(): void {
    this.mostrarBecomeArtistModal = false;
  }

  onArtistCreated(): void {
    this.cerrarBecomeArtistModal();
    if (this.userProfile?.idUsuario) {
      this.cargarPerfil(this.userProfile.idUsuario);
      this.cargarEstadisticas(this.userProfile.idUsuario);
    }
  }
}
