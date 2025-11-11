import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;
  @ViewChild('buttonRef') buttonRef!: ElementRef;

  private overlayRef?: OverlayRef;

  isAuthenticated = true;
  userName = 'Miguel Ángel Campón';
  userInitials = 'MC';
  userPhoto = 'https://i.pravatar.cc/150?img=14';

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  toggleDropdown(): void {
    if (this.overlayRef?.hasAttached()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    // Crear estrategia de posición
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

    // Crear el overlay
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    // Attach el template
    const portal = new TemplatePortal(
      this.dropdownTemplate,
      this.viewContainerRef
    );
    this.overlayRef.attach(portal);

    // Cerrar al hacer click en el backdrop
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
    console.log('Click en Acceder');
  }

  accionPerfil(): void {
    console.log('Click en Mi perfil');
    this.closeDropdown();
  }

  accionCerrarSesion(): void {
    console.log('Click en Cerrar sesión');
    this.closeDropdown();
  }
}
