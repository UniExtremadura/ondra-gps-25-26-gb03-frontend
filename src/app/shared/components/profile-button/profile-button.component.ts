import { Component, signal, ViewChild, ElementRef, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [CommonModule, OverlayModule],
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

  // Signals reactivos del estado de autenticación
  readonly isAuthenticated = this.authState.isAuthenticated;
  readonly currentUser = this.authState.currentUser;
  readonly userName = this.authState.userFullName;
  readonly userInitials = this.authState.userInitials;
  readonly userPhoto = this.authState.userPhoto;
  readonly userEmail = computed(() => this.currentUser()?.emailUsuario || 'usuario@ejemplo.com');

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
    const userId = this.currentUser()?.idUsuario;
    this.closeDropdown();
    this.router.navigate(['/perfil', userId]);
  }

  accionCerrarSesion(): void {
    this.closeDropdown();
    this.authService.logout().subscribe({
      next: () => console.log('✅ Sesión cerrada'),
      error: (err) => console.error('❌ Error al cerrar sesión:', err)
    });
  }
}
