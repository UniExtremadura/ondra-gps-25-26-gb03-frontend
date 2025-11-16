import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

export const artistOnlyGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const user = authState.currentUser();

  if (user?.tipoUsuario === 'ARTISTA') {
    return true;
  }

  console.warn('❌ Acceso denegado: solo artistas');
  router.navigate(['/']);
  return false;
};
