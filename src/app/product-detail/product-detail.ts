<<<<<<< HEAD
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../services/product.service';
import { Product, photoUrl, thumbUrl } from '../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, BreadcrumbModule, GalleriaModule, ButtonModule, TagModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => Number(p.get('id')))), { initialValue: 0 });

  readonly product = computed(() => this.productService.getProductById(this.id()));

  /** Fotos para la galería: grande + miniatura */
  readonly imagenes = computed(() =>
    (this.product()?.images ?? []).map((img, i) => ({
      src: photoUrl(img),
      thumb: thumbUrl(img),
      alt: `${this.product()?.name} – foto ${i + 1}`,
    })),
  );

  readonly relacionados = computed(() => {
    const p = this.product();
    return p ? this.productService.related(p) : [];
  });

  readonly breadcrumb = computed<MenuItem[]>(() => {
    const p = this.product();
    if (!p) return [{ label: 'Catálogo', routerLink: '/catalogo' }];
    return [
      { label: 'Catálogo', routerLink: '/catalogo' },
      { label: this.estilo(p), routerLink: '/catalogo', queryParams: { estilo: p.style } },
      { label: p.name },
    ];
  });

  readonly inicio: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

  readonly tonos = Object.fromEntries(this.productService.tones.map((t) => [t.id, t.label]));

  estilo(p: Product) {
    return this.productService.getCategoryLabel(p.style);
  }

  foto(p: Product) {
    return thumbUrl(p.images[0]);
  }

  irAContacto() {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }
}
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {}
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
