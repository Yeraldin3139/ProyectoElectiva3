export type HatStyle = 'vueltiao' | 'vaquero' | 'casual';
export type HatTone = 'blanco' | 'tierra' | 'oscuro' | 'color';

export interface Product {
  id: number;
  slug: string;
  name: string;
  style: HatStyle;
  tone: HatTone;
  description: string;
  features: string[];
  /** Nombres base de las fotos en public/sombreros (sin extensión) */
  images: string[];
  featured?: boolean;
}

export interface Category {
  id: HatStyle;
  label: string;
  description: string;
}

export interface ToneOption {
  id: HatTone;
  label: string;
}

/** Ruta de la foto grande (galería del detalle) */
export function photoUrl(image: string): string {
  return `sombreros/${image}.webp`;
}

/** Ruta de la foto pequeña (tarjetas y miniaturas) */
export function thumbUrl(image: string): string {
  return `sombreros/${image}-sm.webp`;
}
