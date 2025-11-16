// src/app/features/user-profile/components/followers-modal/followers-modal.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalType, UsuarioBasico } from '../../models/seguimiento.model';
import { UserSeguimientoService } from '../../services/user-seguimiento.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-followers-modal',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.scss']
})
export class FollowersModalComponent implements OnInit {
  @Input() modalType!: ModalType;
  @Input() userId!: number;
  @Output() closeModal = new EventEmitter<void>();
  @Output() statsUpdated = new EventEmitter<void>();

  usuarios: UsuarioBasico[] = [];
  usuariosSiguiendo: Set<number> = new Set();
  isLoading = true;
  currentUserId: number = 0;
  currentUserTipoUsuario: 'NORMAL' | 'ARTISTA' = 'NORMAL';  // ✅ NUEVO

  constructor(
    private seguimientoService: UserSeguimientoService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    const user = this.authStateService.getUserInfo();
    if (user?.idUsuario) {
      this.currentUserId = user.idUsuario;
      this.currentUserTipoUsuario = user.tipoUsuario as 'NORMAL' | 'ARTISTA';  // ✅ NUEVO
    }
    this.cargarUsuarios();
  }

  get title(): string {
    if (this.modalType === 'seguidos') {
      return `Seguidos (${this.usuarios.length})`;
    }
    return `Seguidores (${this.usuarios.length})`;
  }

  cargarUsuarios(): void {
    this.isLoading = true;

    const observable = this.modalType === 'seguidos'
      ? this.seguimientoService.obtenerSeguidos(this.userId)
      : this.seguimientoService.obtenerSeguidores(this.userId);

    observable.subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        if (this.currentUserId > 0) {
          this.verificarSeguimientos();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.isLoading = false;
      }
    });
  }

  verificarSeguimientos(): void {
    this.usuarios.forEach(usuario => {
      if (usuario.idUsuario === this.currentUserId) {
        return;
      }

      this.seguimientoService.verificarSeguimiento(usuario.idUsuario).subscribe({
        next: (siguiendo) => {
          if (siguiendo) {
            this.usuariosSiguiendo.add(usuario.idUsuario);
          }
        },
        error: (error) => {
          if (error.status !== 403) {
            console.error('Error al verificar seguimiento:', error);
          }
        }
      });
    });
  }

  isSiguiendo(idUsuario: number): boolean {
    return this.usuariosSiguiendo.has(idUsuario);
  }

  onFollowStatusChanged(): void {
    this.usuariosSiguiendo.clear();
    this.cargarUsuarios();
    this.statsUpdated.emit();
  }

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
