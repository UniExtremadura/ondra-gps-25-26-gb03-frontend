// src/app/shared/components/logout-confirm-modal/logout-confirm-modal.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-confirm-modal.component.html',
  styleUrls: ['./logout-confirm-modal.component.scss']
})
export class LogoutConfirmModalComponent {
  @Output() confirmLogout = new EventEmitter<void>();
  @Output() cancelLogout = new EventEmitter<void>();

  confirm(): void {
    this.confirmLogout.emit();
  }

  cancel(): void {
    this.cancelLogout.emit();
  }
}
