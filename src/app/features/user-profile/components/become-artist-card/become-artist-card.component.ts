// src/app/features/user-profile/components/become-artist-card/become-artist-card.component.ts

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BecomeArtistModalComponent } from '../become-artist-modal/become-artist-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-artist-card',
  standalone: true,
  imports: [CommonModule, BecomeArtistModalComponent],
  templateUrl: './become-artist-card.component.html',
  styleUrls: ['./become-artist-card.component.scss']
})
export class BecomeArtistCardComponent {
  showModal = signal(false);

  constructor(private router: Router) {}

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onArtistaCreado(): void {
    // Recargar la página o redirigir al perfil
    window.location.reload();
  }
}
