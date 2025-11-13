import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const fullToken = authState.getFullAuthToken(); // Ya incluye "Bearer "

  // Solo añadir el token si la petición es a tu API
  if (fullToken && req.url.includes('/api/')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: fullToken // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
