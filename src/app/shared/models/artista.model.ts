/**
 * DTO del perfil público de un artista
 */
export interface ArtistaDTO {
  idArtista: number;
  idUsuario: number;
  nombreArtistico: string;
  biografiaArtistico?: string;
  fotoPerfilArtistico?: string;
  slugArtistico?: string;
  esTendencia: boolean;
  redesSociales: RedSocialDTO[];
}

export interface RedSocialDTO {
  idRedSocial: number;
  idArtista: number;
  tipoRedSocial: string;
  urlRedSocial: string;
}

export interface EditarArtistaDTO {
  nombreArtistico?: string;
  biografiaArtistico?: string;
  fotoPerfilArtistico?: string;
}
