export interface LoginFormValue {
  email: string;
  password: string;
}

export interface RegistroFormValue {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipoUsuario: 'NORMAL' | 'ARTISTA';
  generosPreferidos: string[];
}

export interface RecuperarPasswordFormValue {
  email: string;
}

export interface RestablecerPasswordFormValue {
  codigoVerificacion: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

export { GENEROS_MUSICALES, GENERO_ID_MAP, convertirGenerosAIds } from '../../../core/models/generos.model';
