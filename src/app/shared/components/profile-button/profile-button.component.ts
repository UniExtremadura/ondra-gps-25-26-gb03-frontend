import { Component, signal, ViewChild, ElementRef, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AuthService } from '../../../core/services/auth.service';
import {TemplatePortal} from '@angular/cdk/portal';
import { LogoutConfirmModalComponent } from '../../../shared/components/logout-confirm-modal/logout-confirm-modal.component';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [CommonModule, OverlayModule, LogoutConfirmModalComponent],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;
  @ViewChild('buttonRef') buttonRef!: ElementRef;

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private authState = inject(AuthStateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private overlayRef?: OverlayRef;
  private modalOverlayRef?: OverlayRef; // ✅ NUEVO: Overlay para el modal

  // ✅ Ya no necesitamos este signal
  // mostrarLogoutModal = signal(false);

  // Signals reactivos del estado de autenticación
  readonly isAuthenticated = this.authState.isAuthenticated;
  readonly currentUser = this.authState.currentUser;
  readonly userEmail = computed(() => this.currentUser()?.emailUsuario || 'usuario@ejemplo.com');

  // Mostrar nombre artístico si es artista, si no, nombre completo
  readonly displayName = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Usuario';

    // Si es artista y tiene nombre artístico, mostrarlo
    if (user.tipoUsuario === 'ARTISTA' && user.nombreArtistico) {
      return user.nombreArtistico;
    }

    // Si no, mostrar nombre completo
    return `${user.nombreUsuario} ${user.apellidosUsuario}`;
  });

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return 'U';

    // Si es artista, usar iniciales del nombre artístico
    if (user.tipoUsuario === 'ARTISTA' && user.nombreArtistico) {
      const parts = user.nombreArtistico.split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : user.nombreArtistico.substring(0, 2).toUpperCase();
    }

    // Si no, usar iniciales normales
    return `${user.nombreUsuario[0]}${user.apellidosUsuario?.[0] || ''}`.toUpperCase();
  });

  readonly userPhoto = computed(() => {
    const user = this.currentUser();
    if (!user) return null;

    // Si es artista, usar foto artística si existe
    if (user.tipoUsuario === 'ARTISTA' && user.fotoPerfilArtistico) {
      return user.fotoPerfilArtistico;
    }

    // Si no, usar foto normal
    return user.fotoPerfil || null;
  });

  toggleDropdown(): void {
    if (this.overlayRef?.hasAttached()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.buttonRef)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 8
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    const portal = new TemplatePortal(
      this.dropdownTemplate,
      this.viewContainerRef
    );
    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());
  }

  closeDropdown(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  accionAcceder(): void {
    this.router.navigate(['/login']);
  }

  accionPerfil(): void {
    this.closeDropdown();
    this.router.navigate(['/perfil/info']);
  }

  // ✅ MODIFICADO: Ahora abre el modal usando Overlay
  accionCerrarSesion(): void {
    this.closeDropdown();
    this.openLogoutModal();
  }

  // ✅ NUEVO: Abrir modal usando Overlay
  openLogoutModal(): void {
    // Crear el overlay con posición centrada
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.modalOverlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop', // Fondo oscuro
      panelClass: 'modal-overlay-pane', // Clase personalizada si necesitas
      scrollStrategy: this.overlay.scrollStrategies.block() // Bloquear scroll
    });

    // Crear el portal del componente
    const modalPortal = new ComponentPortal(LogoutConfirmModalComponent);
    const componentRef = this.modalOverlayRef.attach(modalPortal);

    // Suscribirse a los eventos del modal
    componentRef.instance.confirmLogout.subscribe(() => {
      this.confirmarLogout();
    });

    componentRef.instance.cancelLogout.subscribe(() => {
      this.cancelarLogout();
    });

    // Cerrar al hacer click en el backdrop
    this.modalOverlayRef.backdropClick().subscribe(() => {
      this.cancelarLogout();
    });
  }

  // ✅ MODIFICADO: Cerrar el overlay del modal
  closeLogoutModal(): void {
    if (this.modalOverlayRef) {
      this.modalOverlayRef.detach();
      this.modalOverlayRef.dispose();
      this.modalOverlayRef = undefined;
    }
  }

  // ✅ MODIFICADO: Confirmar cierre de sesión
  confirmarLogout(): void {
    this.closeLogoutModal();
    console.log('🔴 Cerrando sesión...');
    this.authService.logout();
  }

  // ✅ MODIFICADO: Cancelar cierre de sesión
  cancelarLogout(): void {
    this.closeLogoutModal();
  }
}
