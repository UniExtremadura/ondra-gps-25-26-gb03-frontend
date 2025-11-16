import { Component, Output, EventEmitter, signal, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ IMPORTAR
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../core/services/auth.service'; // ✅ IMPORTAR

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent {
  @Input() userId!: number;
  @Output() closeModal = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router); // ✅ INYECTAR
  private authService = inject(AuthService); // ✅ INYECTAR

  passwordForm!: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.clearMessages();

    const formValue = this.passwordForm.value;
    const dto = {
      passwordActual: formValue.currentPassword,
      nuevaPassword: formValue.newPassword
    };

    this.userProfileService.cambiarPassword(this.userId, dto).subscribe({
      next: () => {
        this.successMessage.set('Contraseña cambiada correctamente. Redirigiendo al login...');
        this.passwordForm.reset();
        this.isSubmitting.set(false);

        // Esperar 3 segundos, hacer logout y redirigir
        setTimeout(() => {
          this.authService.logout(); // Cerrar sesión
          this.router.navigate(['/login']); // Redirigir al login
        }, 3000);
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);
        this.errorMessage.set(error.error?.message || 'Error al cambiar la contraseña');
        this.isSubmitting.set(false);
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update(v => !v);
  }

  toggleNewPassword(): void {
    this.showNewPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  isFieldInvalid(field: AbstractControl | null): boolean {
    return !!(field && field.invalid && field.touched);
  }

  hasError(field: AbstractControl | null, errorType: string): boolean {
    return !!(field && field.hasError(errorType) && field.touched);
  }
}
