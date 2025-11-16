export interface RedSocial {
  idRedSocial: number;
  idArtista: number;
  tipoRedSocial: string;
  urlRedSocial: string;
}

export interface RedSocialCrear {
  tipoRedSocial: string;
  urlRedSocial: string;
}

export interface RedSocialEditar {
  tipoRedSocial?: string;
  urlRedSocial?: string;
}

export interface TipoRedSocialInfo {
  value: string;
  label: string;
  icon: string;
  color: string;
}

export const TIPOS_REDES_SOCIALES: TipoRedSocialInfo[] = [
  { value: 'INSTAGRAM', label: 'Instagram', icon: 'instagram', color: 'pink' },
  { value: 'X', label: 'X (Twitter)', icon: 'x', color: 'black' },
  { value: 'FACEBOOK', label: 'Facebook', icon: 'facebook', color: 'blue' },
  { value: 'YOUTUBE', label: 'YouTube', icon: 'youtube', color: 'red' },
  { value: 'TIKTOK', label: 'TikTok', icon: 'tiktok', color: 'black' },
  { value: 'SPOTIFY', label: 'Spotify', icon: 'spotify', color: 'green' },
  { value: 'SOUNDCLOUD', label: 'SoundCloud', icon: 'soundcloud', color: 'orange' }
];
