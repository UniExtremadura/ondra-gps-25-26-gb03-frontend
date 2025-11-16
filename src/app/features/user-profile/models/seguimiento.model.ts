// src/app/features/user-profile/models/seguimiento.model.ts

export interface UsuarioBasico {
  idUsuario: number;
  nombreUsuario: string;
  apellidosUsuario: string;
  nombreArtistico?: string;
  fotoPerfil: string | null;
  tipoUsuario: 'NORMAL' | 'ARTISTA';
  slug?: string;              // ✅ NUEVO
  slugArtistico?: string;     // ✅ NUEVO
}

export interface EstadisticasSeguimiento {
  idUsuario: number;
  seguidos: number;
  seguidores: number;
}

export interface SeguirUsuarioRequest {
  idUsuarioASeguir: number;
}

export type ModalType = 'seguidos' | 'seguidores' | null;
