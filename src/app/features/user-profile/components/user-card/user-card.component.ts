// src/app/features/user-profile/components/user-card/user-card.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioBasico } from '../../models/seguimiento.model';
import { UserSeguimientoService } from '../../services/user-seguimiento.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() usuario!: UsuarioBasico;
  @Input() siguiendo: boolean = false;
  @Input() currentUserId: number = 0;
  @Input() currentUserTipoUsuario: 'NORMAL' | 'ARTISTA' = 'NORMAL';
  @Output() followStatusChanged = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  isProcessing = false;

  constructor(
    private seguimientoService: UserSeguimientoService,
    private router: Router
  ) {}

  get isOwnProfile(): boolean {
    return this.usuario.idUsuario === this.currentUserId;
  }

  get isCurrentUserArtist(): boolean {
    return this.currentUserTipoUsuario === 'ARTISTA';
  }

  get showFollowButton(): boolean {
    return !this.isOwnProfile && !this.isCurrentUserArtist;
  }

  get displayName(): string {
    if (this.usuario.tipoUsuario === 'ARTISTA' && this.usuario.nombreArtistico) {
      return this.usuario.nombreArtistico;
    }
    return `${this.usuario.nombreUsuario} ${this.usuario.apellidosUsuario}`;
  }

  get displaySubtitle(): string {
    // ✅ Si es tu propio perfil, mostrar "Tú"
    if (this.isOwnProfile) {
      return 'Tú';
    }

    if (this.usuario.tipoUsuario === 'ARTISTA' && this.usuario.nombreArtistico) {
      return 'Artista';
    }
    return 'Usuario';
  }

  get displayPhoto(): string {
    return this.usuario.fotoPerfil || 'https://ui-avatars.com/api/?name=User&background=1E3A8A&color=fff&size=80';
  }

  toggleFollow(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;

    if (this.siguiendo) {
      this.seguimientoService.dejarDeSeguir(this.usuario.idUsuario).subscribe({
        next: () => {
          this.isProcessing = false;
          this.followStatusChanged.emit();
        },
        error: (error) => {
          console.error('Error al dejar de seguir:', error);
          this.isProcessing = false;
        }
      });
    } else {
      this.seguimientoService.seguirUsuario(this.usuario.idUsuario).subscribe({
        next: () => {
          this.isProcessing = false;
          this.followStatusChanged.emit();
        },
        error: (error) => {
          console.error('Error al seguir:', error);
          this.isProcessing = false;
        }
      });
    }
  }

  verPerfil(): void {
    this.profileClick.emit();

    setTimeout(() => {
      if (this.usuario.tipoUsuario === 'ARTISTA' && this.usuario.slugArtistico) {
        this.router.navigate(['/artista', this.usuario.slugArtistico]);
      } else if (this.usuario.slug) {
        this.router.navigate(['/usuario', this.usuario.slug]);
      } else {
        console.error('❌ Usuario sin slug:', this.usuario);
      }
    }, 100);
  }
}
