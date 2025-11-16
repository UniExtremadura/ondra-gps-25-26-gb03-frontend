// src/app/features/user-profile/components/personal-info-section/personal-info-section.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../models/user-profile.model';
import { EditableFieldComponent } from '../editable-field/editable-field.component';
import {ChangePasswordModalComponent} from '../change-password-modal/change-password-modal.component';
import { AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-personal-info-section',
  standalone: true,
  imports: [CommonModule, EditableFieldComponent, ChangePasswordModalComponent],
  templateUrl: './personal-info-section.component.html',
  styleUrls: ['./personal-info-section.component.scss']
})
export class PersonalInfoSectionComponent {
  @Input() userProfile!: UserProfile;
  @Output() profileUpdated = new EventEmitter<UserProfile>();

  constructor(private authService: AuthService) {}

  showPasswordModal = false;

  get isArtist(): boolean {
    return this.userProfile.tipoUsuario === 'ARTISTA';
  }

  onFieldUpdated(updatedProfile: UserProfile): void {
    this.profileUpdated.emit(updatedProfile);
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  onPasswordChanged(): void {
    alert('Contraseña cambiada exitosamente. Por seguridad, vuelve a iniciar sesión.');
    this.authService.logout();
  }
}
