// src/app/features/user-profile/components/profile-header/profile-header.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../models/user-profile.model';
import { UsuarioPublico } from '../../models/usuario-publico.model';
import { EstadisticasSeguimiento, ModalType } from '../../models/seguimiento.model';
import { UserProfileService } from '../../services/user-profile.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {
  @Input() userProfile!: UserProfile | UsuarioPublico;
  @Input() estadisticas: EstadisticasSeguimiento | null = null;
  @Input() isOwnProfile: boolean = true;
  @Input() isPublicView: boolean = false;

  // ✅ NUEVOS INPUTS para el botón seguir
  @Input() isFollowing: boolean = false;
  @Input() isProcessingFollow: boolean = false;
  @Input() showFollowButton: boolean = false; // Para controlar si se muestra el botón
  @Input() totalReproducciones: number | null = null; // ✅ NUEVO: Total de reproducciones del artista

  @Output() openModalEvent = new EventEmitter<ModalType>();
  @Output() profileUpdated = new EventEmitter<UserProfile>();
  @Output() followClick = new EventEmitter<void>(); // ✅ NUEVO: Emitir evento de seguir

  isUploadingPhoto = false;

  constructor(private userProfileService: UserProfileService) {}

  ngOnInit(): void {
    console.log('🔍 UserProfile:', this.userProfile);
    console.log('🔍 Tipo Usuario:', this.userProfile.tipoUsuario);
    console.log('🔍 Total Reproducciones:', this.totalReproducciones);
  }

  // Helper para verificar si es UserProfile (tiene emailUsuario)
  private isUserProfile(profile: UserProfile | UsuarioPublico): profile is UserProfile {
    return 'emailUsuario' in profile;
  }

  get hasPhoto(): boolean {
    if (this.userProfile.tipoUsuario === 'ARTISTA') {
      const fotoArtista = this.userProfile.fotoPerfilArtistico;
      if (fotoArtista && fotoArtista.trim() !== '') {
        return true;
      }
    }
    const fotoNormal = this.userProfile.fotoPerfil;
    return !!(fotoNormal && fotoNormal.trim() !== '');
  }

  get displayPhoto(): string {
    if (this.userProfile.tipoUsuario === 'ARTISTA' && this.userProfile.fotoPerfilArtistico) {
      return this.userProfile.fotoPerfilArtistico;
    }
    return this.userProfile.fotoPerfil || '';
  }

  get userInitials(): string {
    if (this.userProfile.tipoUsuario === 'ARTISTA' && this.userProfile.nombreArtistico) {
      const nombreArtistico = this.userProfile.nombreArtistico.trim();
      const parts = nombreArtistico.split(' ').filter(p => p.length > 0);

      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      } else if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].substring(0, 2).toUpperCase();
      }
    }

    const nombre = (this.userProfile.nombreUsuario || '').trim();
    const apellido = (this.userProfile.apellidosUsuario || '').trim();

    if (nombre && apellido) {
      return `${nombre[0]}${apellido[0]}`.toUpperCase();
    } else if (nombre && nombre.length >= 2) {
      return nombre.substring(0, 2).toUpperCase();
    } else if (nombre) {
      return `${nombre[0]}${nombre[0]}`.toUpperCase();
    }

    return 'U?';
  }

  get displayName(): string {
    if (this.userProfile.tipoUsuario === 'ARTISTA' && this.userProfile.nombreArtistico) {
      return this.userProfile.nombreArtistico;
    }
    return `${this.userProfile.nombreUsuario} ${this.userProfile.apellidosUsuario}`;
  }

  get isArtist(): boolean {
    return this.userProfile.tipoUsuario === 'ARTISTA';
  }

  get memberSince(): string {
    if (!this.userProfile.fechaRegistro) {
      return '';
    }

    try {
      let date: Date;

      if (typeof this.userProfile.fechaRegistro === 'string') {
        date = new Date(this.userProfile.fechaRegistro);
      } else if (Array.isArray(this.userProfile.fechaRegistro)) {
        const [year, month, day] = this.userProfile.fechaRegistro;
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(this.userProfile.fechaRegistro as any);
      }

      if (isNaN(date.getTime())) {
        return '';
      }

      return date.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  }

  // ✅ NUEVO: Formatear números grandes
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }

  // ✅ NUEVO: Manejar click en seguir
  onFollowClick(): void {
    this.followClick.emit();
  }

  onPhotoClick(): void {
    if (!this.isOwnProfile || this.isPublicView || !this.isUserProfile(this.userProfile)) {
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg,image/webp';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadPhoto(file);
      }
    };
    input.click();
  }

  uploadPhoto(file: File): void {
    if (!this.isUserProfile(this.userProfile)) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5MB');
      return;
    }

    const validFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    this.isUploadingPhoto = true;

    const uploadObservable = this.isArtist
      ? this.userProfileService.subirImagenPerfilArtista(file)
      : this.userProfileService.subirImagenPerfil(file);

    uploadObservable.subscribe({
      next: (response) => {
        console.log('✅ Imagen subida:', response.url);

        if (this.isArtist && this.userProfile.idArtista) {
          const updateData = { fotoPerfilArtistico: response.url };

          this.userProfileService.editarPerfilArtista(this.userProfile.idArtista, updateData).pipe(
            switchMap(() => this.userProfileService.obtenerPerfil(this.userProfile.idUsuario))
          ).subscribe({
            next: (updatedProfile: UserProfile) => {
              this.profileUpdated.emit(updatedProfile);
              this.isUploadingPhoto = false;
              alert('Foto de perfil actualizada correctamente');
            },
            error: (error: any) => {
              console.error('Error al actualizar foto de artista:', error);
              alert('Error al actualizar la foto');
              this.isUploadingPhoto = false;
            }
          });
        } else {
          const updateData = { fotoPerfil: response.url };

          this.userProfileService.editarPerfilUsuario(this.userProfile.idUsuario, updateData).subscribe({
            next: (updatedProfile: UserProfile) => {
              this.profileUpdated.emit(updatedProfile);
              this.isUploadingPhoto = false;
              alert('Foto de perfil actualizada correctamente');
            },
            error: (error: any) => {
              console.error('Error al actualizar foto:', error);
              alert('Error al actualizar la foto');
              this.isUploadingPhoto = false;
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error al subir imagen:', error);
        alert('Error al subir la imagen');
        this.isUploadingPhoto = false;
      }
    });
  }

  openModal(type: ModalType): void {
    if (this.isArtist && type === 'seguidos') {
      return;
    }
    this.openModalEvent.emit(type);
  }
}
