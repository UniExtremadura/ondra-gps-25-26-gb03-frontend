import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor simplificado (sin autenticación por ahora)
 * Cuando se implemente el login, aquí se añadirá el JWT
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Por ahora solo deja pasar las peticiones sin modificar
  // Cuando esté auth, se añadirá el token JWT
  return next(req);
};
