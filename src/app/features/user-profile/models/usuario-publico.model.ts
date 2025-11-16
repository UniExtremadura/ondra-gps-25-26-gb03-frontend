// src/app/features/user-profile/models/usuario-publico.model.ts

export interface UsuarioPublico {
  idUsuario: number;
  slug: string;
  nombreUsuario: string;
  apellidosUsuario: string;
  fotoPerfil: string | null;
  tipoUsuario: 'NORMAL' | 'ARTISTA';
  fechaRegistro: string | number[];

  // ✅ Campos específicos de artista
  idArtista?: number;  // ✅ AGREGAR ESTE CAMPO
  nombreArtistico?: string;
  slugArtistico?: string;
  biografiaArtistico?: string;
  fotoPerfilArtistico?: string;
}
