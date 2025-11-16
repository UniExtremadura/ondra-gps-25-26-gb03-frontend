// src/app/features/user-profile/components/editable-field/editable-field.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-editable-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.scss']
})
export class EditableFieldComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() fieldName: string = '';
  @Input() userId!: number;
  @Input() artistaId?: number;  // ✅ NUEVO
  @Input() isTextarea: boolean = false;
  @Output() fieldUpdated = new EventEmitter<UserProfile>();

  isEditing = false;
  editedValue = '';
  isSaving = false;

  // ✅ Campos que pertenecen a la tabla Artistas
  private camposArtista = ['nombreArtistico', 'biografiaArtistico', 'fotoPerfilArtistico'];

  constructor(private userProfileService: UserProfileService) {}

  startEditing(): void {
    this.isEditing = true;
    this.editedValue = this.value || '';
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedValue = '';
  }

  saveChanges(): void {
    // Permitir biografía vacía, pero no otros campos
    if (this.editedValue.trim() === '' && this.fieldName !== 'biografiaArtistico') {
      alert('El campo no puede estar vacío');
      return;
    }

    if (this.editedValue === this.value) {
      this.cancelEditing();
      return;
    }

    this.isSaving = true;
    const updateData = { [this.fieldName]: this.editedValue };

    // ✅ Decidir qué endpoint usar según el campo
    const isArtistaField = this.camposArtista.includes(this.fieldName);

    if (isArtistaField && this.artistaId) {
      // Editar campos de artista
      this.userProfileService.editarPerfilArtista(this.artistaId, updateData).pipe(
        // Después de editar artista, recargar perfil completo
        switchMap(() => this.userProfileService.obtenerPerfil(this.userId))
      ).subscribe({
        next: (updatedProfile) => {
          this.fieldUpdated.emit(updatedProfile);
          this.isEditing = false;
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error al actualizar campo de artista:', error);
          alert('Error al actualizar el campo');
          this.isSaving = false;
        }
      });
    } else {
      // Editar campos de usuario
      this.userProfileService.editarPerfilUsuario(this.userId, updateData).subscribe({
        next: (updatedProfile) => {
          this.fieldUpdated.emit(updatedProfile);
          this.isEditing = false;
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error al actualizar campo de usuario:', error);
          alert('Error al actualizar el campo');
          this.isSaving = false;
        }
      });
    }
  }
}
