import { Injectable, computed, signal } from '@angular/core';
import { Category, HatStyle, HatTone, Product, ToneOption } from '../models/product.model';

const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'vueltiao-tradicional',
    name: 'Vueltiao tradicional',
    style: 'vueltiao',
    tone: 'oscuro',
    description: 'El clásico sombrero colombiano de franjas negras y claras que dan la vuelta desde la copa hasta el ala.',
    features: ['Franjas en blanco y negro', 'Ala ancha y plana', 'Diseño tradicional colombiano'],
    images: ['vueltiao-tradicional-1', 'vueltiao-tradicional-2'],
    featured: true,
  },
  {
    id: 2,
    slug: 'vueltiao-tricolor',
    name: 'Vueltiao tricolor Colombia',
    style: 'vueltiao',
    tone: 'color',
    description: 'Vueltiao con franjas amarillas, azules y rojas, y la palabra "Colombia" bordada en la copa.',
    features: ['Colores de la bandera', 'Copa con la palabra Colombia', 'Ideal para celebraciones'],
    images: ['vueltiao-tricolor-1', 'vueltiao-tricolor-2'],
    featured: true,
  },
  {
    id: 3,
    slug: 'ala-ancha-rosado',
    name: 'Ala ancha rosado con cinta tricolor',
    style: 'casual',
    tone: 'color',
    description: 'Sombrero de ala ancha con bloques en rosado y gris, terminado con una cinta en los colores de Colombia.',
    features: ['Ala ancha', 'Combinación rosado y gris', 'Cinta tricolor'],
    images: ['ala-ancha-rosado-1'],
  },
  {
    id: 4,
    slug: 'vaquero-blanco-cuero',
    name: 'Vaquero blanco con correa de cuero',
    style: 'vaquero',
    tone: 'blanco',
    description: 'Vaquero blanco de copa alta con cinta trenzada y un detalle en cuero sobre el costado.',
    features: ['Color blanco natural', 'Cinta trenzada', 'Detalle de cuero'],
    images: ['vaquero-blanco-cuero-1', 'vaquero-blanco-cuero-2', 'vaquero-blanco-cuero-3'],
    featured: true,
  },
  {
    id: 5,
    slug: 'vaquero-pluma-dorada',
    name: 'Vaquero blanco con pluma dorada',
    style: 'vaquero',
    tone: 'blanco',
    description: 'Vaquero blanco con cinta clara y una pluma metálica dorada que le da un toque elegante.',
    features: ['Pluma decorativa dorada', 'Cinta en tono crema', 'Ala curvada'],
    images: ['vaquero-pluma-dorada-1', 'vaquero-pluma-dorada-2', 'vaquero-pluma-dorada-3'],
  },
  {
    id: 6,
    slug: 'vaquero-bicolor',
    name: 'Vaquero bicolor con cinta roja',
    style: 'vaquero',
    tone: 'blanco',
    description: 'Copa blanca y ala en tono natural, con cinta tejida en negro y rojo.',
    features: ['Dos tonos: blanco y natural', 'Cinta tejida negra y roja', 'Copa con pliegue'],
    images: ['vaquero-bicolor-1', 'vaquero-bicolor-2', 'vaquero-bicolor-3', 'vaquero-bicolor-4'],
    featured: true,
  },
  {
    id: 7,
    slug: 'vaquero-hebilla-dorada',
    name: 'Vaquero blanco con hebilla dorada',
    style: 'vaquero',
    tone: 'blanco',
    description: 'Vaquero blanco con cinta trenzada y hebilla dorada al frente.',
    features: ['Hebilla dorada', 'Cinta trenzada', 'Acabado blanco'],
    images: ['vaquero-hebilla-dorada-1', 'vaquero-hebilla-dorada-2'],
  },
  {
    id: 8,
    slug: 'vaquero-cinta-trenzada',
    name: 'Vaquero blanco de cinta trenzada',
    style: 'vaquero',
    tone: 'blanco',
    description: 'Modelo vaquero sencillo y versátil, con cinta trenzada en tono crema.',
    features: ['Cinta trenzada crema', 'Ala levantada a los lados', 'Para uso diario'],
    images: ['vaquero-cinta-trenzada-1', 'vaquero-cinta-trenzada-2'],
  },
  {
    id: 9,
    slug: 'vaquero-cinta-negra',
    name: 'Vaquero blanco con cinta negra',
    style: 'vaquero',
    tone: 'blanco',
    description: 'Vaquero blanco con cinta negra y adorno plateado que hace contraste.',
    features: ['Cinta negra', 'Adorno plateado', 'Contraste blanco y negro'],
    images: ['vaquero-cinta-negra-1', 'vaquero-cinta-negra-2'],
  },
  {
    id: 10,
    slug: 'el-charro-envejecido',
    name: 'El Charro envejecido',
    style: 'vaquero',
    tone: 'tierra',
    description: 'Vaquero con acabado envejecido en tonos tostados, cinta ancha de cuero negro y costuras cruzadas en el ala.',
    features: ['Acabado envejecido', 'Cinta ancha de cuero negro', 'Costuras cruzadas en el ala'],
    images: ['el-charro-envejecido-1'],
    featured: true,
  },
  {
    id: 11,
    slug: 'el-charro-marron',
    name: 'El Charro marrón',
    style: 'vaquero',
    tone: 'tierra',
    description: 'Vaquero en marrón con textura suave, cinta del mismo tono y copa con pliegue clásico.',
    features: ['Color marrón', 'Textura suave', 'Copa con pliegue clásico'],
    images: ['el-charro-marron-1'],
  },
  {
    id: 12,
    slug: 'el-charro-natural',
    name: 'El Charro natural',
    style: 'vaquero',
    tone: 'tierra',
    description: 'Vaquero en tono natural con cinta de diseño geométrico en blanco y negro.',
    features: ['Tono natural', 'Cinta geométrica', 'Ala amplia'],
    images: ['el-charro-natural-1'],
  },
  {
    id: 13,
    slug: 'vaquero-mostaza',
    name: 'Vaquero mostaza',
    style: 'vaquero',
    tone: 'tierra',
    description: 'Vaquero en color mostaza con brillo dorado y pequeño adorno metálico.',
    features: ['Color mostaza', 'Brillo dorado', 'Adorno metálico'],
    images: ['vaquero-mostaza-1', 'vaquero-mostaza-2'],
  },
  {
    id: 14,
    slug: 'vaquero-calado',
    name: 'Vaquero calado',
    style: 'vaquero',
    tone: 'tierra',
    description: 'Vaquero con tejido calado en la copa, cinta negra y detalle rojo.',
    features: ['Tejido calado (con aberturas)', 'Cinta negra con detalle rojo', 'Ligero y fresco'],
    images: ['vaquero-calado-1'],
  },
  {
    id: 15,
    slug: 'bosalino-tejido-brisa',
    name: 'Bosalino corto tejido brisa',
    style: 'casual',
    tone: 'tierra',
    description: 'Colección bosalino de ala corta con tejido brisa: aberturas en la copa en tonos crema, arena y miel.',
    features: ['Ala corta', 'Tejido brisa', 'Varios tonos tierra'],
    images: ['bosalino-tejido-brisa-1', 'bosalino-tejido-brisa-2', 'bosalino-tejido-brisa-3', 'bosalino-tejido-brisa-4'],
    featured: true,
  },
  {
    id: 16,
    slug: 'sombrero-oscuro-pluma',
    name: 'Sombrero oscuro con pluma plateada',
    style: 'vaquero',
    tone: 'oscuro',
    description: 'Sombrero de tono oscuro con cinta delgada y plumas plateadas en el costado.',
    features: ['Tono oscuro', 'Plumas plateadas', 'Cinta delgada'],
    images: ['sombrero-oscuro-pluma-1'],
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(PRODUCTS);

  readonly categories: Category[] = [
    { id: 'vueltiao', label: 'Vueltiao', description: 'El sombrero insignia de Colombia' },
    { id: 'vaquero', label: 'Vaquero', description: 'Copa alta y ala curvada' },
    { id: 'casual', label: 'Casual', description: 'Bosalinos y ala ancha' },
  ];

  readonly tones: ToneOption[] = [
    { id: 'blanco', label: 'Blancos' },
    { id: 'tierra', label: 'Tonos tierra' },
    { id: 'oscuro', label: 'Oscuros' },
    { id: 'color', label: 'De colores' },
  ];

  readonly featured = computed(() => this.productsSignal().filter((p) => p.featured));

  getProducts() {
    return this.productsSignal.asReadonly();
  }

  getProductById(id: number): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  countByStyle(style: HatStyle): number {
    return this.productsSignal().filter((p) => p.style === style).length;
  }

  getCategoryLabel(style: HatStyle): string {
    return this.categories.find((c) => c.id === style)?.label ?? style;
  }

  filterProducts(style?: HatStyle | null, tone?: HatTone | null, text?: string | null): Product[] {
    const query = normalize(text ?? '');
    return this.productsSignal().filter((product) => {
      if (style && product.style !== style) return false;
      if (tone && product.tone !== tone) return false;
      if (query) {
        const haystack = normalize([product.name, product.description, ...product.features].join(' '));
        if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
      }
      return true;
    });
  }

  /** Otros modelos del mismo estilo (para el detalle) */
  related(product: Product, limit = 4): Product[] {
    return this.productsSignal()
      .filter((p) => p.id !== product.id && p.style === product.style)
      .slice(0, limit);
  }
}

/** minúsculas y sin tildes, para que "Vueltiáo" encuentre "vueltiao" */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}
